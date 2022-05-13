const express = require("express");
const Connection = require("tedious").Connection;
var ConnectionPool = require('tedious-connection-pool');
const config = require("config");
const { executeDomain } = require("@markab.io/node/utils/utils");
const Request = require("tedious").Request;

const getSqlWrapper = statements => {
  return `
BEGIN TRY  
  ${statements}
END TRY  
BEGIN CATCH  
    -- Execute error retrieval routine.  
SELECT  
    ERROR_NUMBER() AS ErrorNumber  
    ,ERROR_SEVERITY() AS ErrorSeverity  
    ,ERROR_STATE() AS ErrorState  
    ,ERROR_PROCEDURE() AS ErrorProcedure  
    ,ERROR_LINE() AS ErrorLine  
    ,ERROR_MESSAGE() AS ErrorMessage;  
END CATCH;   
`;
};

const getDbConnection = (dbconfig) => {
  const connection = new Connection(dbconfig);
  var poolConfig = {
    min: 2,
    max: 4,
    log: true
  };
  return new Promise((resolve, reject) => {
    connection.on("connect", function(err) {
      if (err) {
        console.log("Error connecting to sql server", err);
        reject(err);
        return err;
      }
      console.log("connected");
      resolve(connection)
    });
    connection.on("error", function(err) {
      console.log("connection error", err);
      reject(err);
    });
  })
}

module.exports = ({ execute, remoteConfig }) => {
  const apiRoutes = express.Router();
  const dbconfig = {
    server: config.get("auth.azuredb.server"),
    // If you're on Windows Azure, you will need this:
    options: { encrypt: true, database: config.get("auth.azuredb.db") },
    authentication: {
      type: "default",
      options: {
        userName: config.get("auth.azuredb.user"),
        password: config.get("auth.azuredb.pass")
      }
    }
  };

  apiRoutes.get("/sql", (req, res) => {
    res.send("SQL service is working!");
  });
  apiRoutes.post("/sql", (req, res) => {
    const connection = getDbConnection((dbconfig))
    let { isPermitted, onResponse } = executeDomain(req, res, execute);
    let results = [];
    let error;
    const statement = req.body.sql;
    if (!isPermitted) {
      return res.status(409).send({
        message: `You are not authorized to execute sql`
      });
    }
    connection.then((server) => {
      let request = new Request(statement.sql, (err, rowCount, rows) => {
        if (err) {
          console.log("ERROR", err);
          error = err;
          return res.status(500).send(err);
        }
      });
      request.on("requestCompleted", function() {
        if (!error) {
          return onResponse(results, req, res);
        }
      });
      request.on("row", data => {
        // console.log("DATA!!!", data);
        // console.log("-----------------------------------");
        results.push(data[0]);
      });
      request.on("error", data => {
        console.log("ERROR EVENT Fired");
        error = data;
      });
      try {
        server.execSql(request);
      }
      catch (err) {
        res.status(500).send(err);
      }
    })

  });
  //executing a bulk sql operation
  apiRoutes.post("/sql/bulk", (req, res) => {
    const { isPermitted, onResponse } = executeDomain(req, res, execute);
    const connection = getDbConnection((dbconfig))
    let results = [];
    let metaResults = [];
    let error;
    const sql = req.body.sqlStatements;
    const title = sql.title.split(" ").join("");
    const sqlList = sql.statements.map(st => st.sql).join("\n");
    const transactionWrapper = getSqlWrapper(sqlList);
    console.info(transactionWrapper);
    if (!isPermitted) {
      return res.status(409).send({
        message: `You are not authorized to execute sql}`
      });
    }
    connection.then((server) => {
      let request = new Request(transactionWrapper, (err, rowCount, rows) => {
        if (err) {
          console.log("ERROR", err);
          error = err;
          return res.status(500).send(err);
        }
      });
      request.on("requestCompleted", function() {
        if (!error) {
          return onResponse(metaResults, req, res);
        }
      });
      request.on("row", data => {
        results.push(data[0]);
      });
      request.on("doneInProc", function(rowCount, more, rows) {
        console.log("BEGIN DONE IN PROC");
        console.log("ROW COUNT", rowCount);
        console.log("MORE!", more);
        console.log("ROWS!", rows);
        console.log("END DONE IN PROC");
        console.log(results, "res");
        metaResults.push(results);
        results = [];
      });
      request.on("doneProc", function(rowCount, more, returnStatus, rows) {
        console.log("BEGIN DONE!");
        console.log("ROW COUNT", rowCount);
        console.log("ROW COUNT", rowCount);
        console.log("MORE!", more);
        console.log("ROWS!", rows);
        console.log("RETURN STATUS!", returnStatus);
        console.log("END DONE!");
      });
      request.on("error", data => {
        console.log("ERROR EVENT Fired");
        error = data;
      });
      try {
        server.execSql(request);
      }
      catch (err) {
        res.status(500).send(err);
      }
    })
  });
  return apiRoutes;
};
