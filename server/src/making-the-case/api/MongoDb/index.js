const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

mongoose.plugin(mongoosePaginate);

const MongoDb = ({ config, onDBInit, onError, onDisconnect }) => {
  //run seeds
  const connection = mongoose.connect(`${config.get("db.host")}`, {
    dbName: "orbital"
  }); // connect to database
  const schemas = {};

  //extract resource and format mongodb schema
  connection
    .then(({ models }) => {
      Object.keys(models).map(modelName => {
        let pathObject = models[modelName].schema.paths;
        schemas[modelName] = pathObject;
      });
      onDBInit(models, schemas);
    })
    .catch(err => {
      console.log("connect error", err);
    });

  // If the connection throws an error
  mongoose.connection.on("error", function(err) {
    console.log("Mongoose default connection error: " + err);
    if (onError) {
      onError(err);
    }
  });

  // If the connection is disconnected
  mongoose.connection.on("disconnected", function() {
    console.log("Mongoose default connection disconnected");
    if (onDisconnect) {
      onDisconnect();
    }
  });

  return connection;
};

// Close the database connection when the node process terminates for whatever reason
process.on("SIGINT", function() {
  mongoose.connection.close(function() {
    console.log(
      "Mongoose default connection disconnected through app termination"
    );
    process.exit(0);
  });
});

module.exports = MongoDb;
