// =================================================================
// get the packages we need ========================================
// =================================================================
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const config = require("config"); // get our config require(file)
const session = require("express-session"); // we remove this require(later)
const Orbital = require("./api");
const MongoDb = require("./api/MongoDb");
const userModel = require("./api/MongoDb/models/user");
const settingsModel = require("./api/MongoDb/models/settings");
const permissionsSchema = require("./api/MongoDb/models/permissions");
const permissionsModel = mongoose.model("Permissions", permissionsSchema);
const contactsSchema = require("./api/MongoDb/models/contacts");
const contactsModel = mongoose.model("Contacts", contactsSchema);
const formsSchema = require("./api/MongoDb/models/forms");
const formsModel = mongoose.model("Forms", formsSchema);
const hashSchema = require("./api/MongoDb/models/hash");
const hashModel = mongoose.model("Hash", hashSchema);
const expressPrintRoutes = require("express-print-routes");
const path = require("path");

const getExpressApp = config => {
  // =================================================================
  // starting the server ================================================
  // =================================================================

  // =================================================================
  // App =============================================================
  // =================================================================
  const app = express();
  const port = config.get("server.port"); // used to create, sign, and verify tokens
  const ip = config.get("server.host");
  var server = http.createServer(app);
  server.listen(port);
  console.log(`Magic happens at ${ip}:${port}`);
  // =================================================================
  // configuration ===================================================
  // =================================================================
  app.set("superSecret", config.secret); // secret variable

  // required for passport session auth
  app.use(
    session({
      secret: "secrettexthere",
      saveUninitialized: true,
      resave: true
    })
  );

  //CORS
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  // use body parser so we can get info = POST and/or URL parameters
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));
  // use morgan to log requests to the console
  app.use(morgan("dev"));
  return { server, app };
};

const getAllApis = () => {
  // Get all available end points
  const defaultProps = {
    permissionsModel,
    formsModel,
    settingsModel,
    userModel,
    hashModel,
    contactsModel,
    config
  };
  const {
    authApiRoutes,
    userApiRoutes,
    jwtApiRoutes,
    aclApiRoutes,
    formsApiRoutes,
    settingsApiRoutes,
    hashApiRoutes,
    contactsApiRoutes
  } = Orbital({
    ...defaultProps
  });
  return {
    authApiRoutes,
    userApiRoutes,
    jwtApiRoutes,
    aclApiRoutes,
    formsApiRoutes,
    settingsApiRoutes,
    hashApiRoutes,
    contactsApiRoutes,
    ...defaultProps
  };
};

const registerAllRoutes = ({
  app,
  server,
  authApiRoutes,
  userApiRoutes,
  jwtApiRoutes,
  aclApiRoutes,
  hashApiRoutes,
  contactsApiRoutes,
  ...defaultProps
}) => {
  app.use("/", authApiRoutes);
  app.use("/jwt", jwtApiRoutes);
  app.use("/users", jwtApiRoutes, ...userApiRoutes);
  app.use("/hash", ...hashApiRoutes);
  app.use("/contacts", ...contactsApiRoutes);
  app.use("/acl", jwtApiRoutes, ...aclApiRoutes);
};

// =================================================================
// printing all routes to a file =========================================
// =================================================================
const printAllRoutes = app => {
  let filepath = path.join(__dirname, "./docs/routes.md");
  expressPrintRoutes(app, filepath);
};

// =================================================================
// Setting up the database =========================================
// =================================================================

//models: mongoose models
//schemas: the schema of each model
// on DB initalization
const onDBInit = ({ app, server, models, schemas }) => {
  app.use("/schemas", (req, res, next) => {
    res.send(schemas);
  });
  printAllRoutes(app);
};

//if there is an error connecting to db, send an error back to the user
const onError = (err,app) => {
  //routes that don't require db connection
  app.use("/", (req, res, next) => {
    return res.status(500).send(err);
  });
};

const onDisconnect = ({app}) => {
  console.log("db disconnected");
  app.use("/", (req, res, next) => {
    return res.status(500).send("err: db disconnected");
  });
};

const main = () => {
  const { app, server } = getExpressApp(config);
  const dbConnection = MongoDb({
    config,
    onDBInit: (models, schemas) => onDBInit({ app, server, models, schemas }),
    onError,
    onDisconnect
  });
  const {
    authApiRoutes,
    userApiRoutes,
    jwtApiRoutes,
    aclApiRoutes,
    formsApiRoutes,
    settingsApiRoutes,
    hashApiRoutes,
    contactsApiRoutes,
    ...defaultProps
  } = getAllApis({ app, server });
  registerAllRoutes({
    app,
    server,
    authApiRoutes,
    userApiRoutes,
    jwtApiRoutes,
    aclApiRoutes,
    formsApiRoutes,
    settingsApiRoutes,
    hashApiRoutes,
    contactsApiRoutes,
    ...defaultProps
  });
  return { dbConnection, app };
};
module.exports = main;
module.exports.getAllApis = getAllApis;
module.exports.registerAllRoutes = registerAllRoutes;
module.exports.getExpressApp = getExpressApp;
