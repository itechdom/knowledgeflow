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
const MongoDb = require("@markab.io/orbital-api/MongoDb");
const userModel = require("@markab.io/orbital-api/MongoDb/models/user");
const settingsModel = require("@markab.io/orbital-api/MongoDb/models/settings");
const permissionsSchema = require("@markab.io/orbital-api/MongoDb/models/permissions");
const permissionsModel = mongoose.model("Permissions", permissionsSchema);
const kernelModel = require("@markab.io/orbital-api/MongoDb/models/kernel");
const formsSchema = require("@markab.io/orbital-api/MongoDb/models/forms");
const notificationsSchema = require("@markab.io/orbital-api/MongoDb/models/notifications");
const notificationsModel = mongoose.model("Notification", notificationsSchema);
const formsModel = mongoose.model("Forms", formsSchema);
const orbitalApi = require("@markab.io/orbital-api");
const Kb = require("./src/knowledge-base/api");
const expressPrintRoutes = require("express-print-routes");
const path = require("path");
const cors = require("cors");

const getExpressApp = (config) => {
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

  const whitelist = config.get("cors.whitelist");
  const corsOptions = {
    origin: function (origin, callback) {
      console.warn("SHALL YOU PASS?", origin, whitelist);
      if (!origin) {
        return callback(null, false);
      }
      if (whitelist.find((or) => origin.indexOf(or) !== -1)) {
        console.warn("YOU SHALL PASS", origin);
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    exposedHeaders: ["Content-Length", "X-Foo", "X-Bar"],
  };

  // required for passport session auth
  app.use(
    session({
      secret: "thecatwentoverthefencebutfoundafoxsosheranaway",
      saveUninitialized: true,
      resave: true,
    })
  );

  //CORS
  app.options("*", cors(corsOptions)); // enable pre-flight request for DELETE request
  app.use(cors(corsOptions));
  //CORS
  // app.use(function(req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  //   res.header(
  //     "Access-Control-Allow-Headers",
  //     "Origin, X-Requested-With, Content-Type, Accept"
  //   );
  //   next();
  // });
  // use body parser so we can get info = POST and/or URL parameters
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));
  // use morgan to log requests to the console
  app.use(morgan("dev"));
  return { server, app };
};

const getAllApis = ({
  server,
  app,
  exceptions: { disableChat, disableRides },
}) => {
  // Get all available end points
  const defaultProps = {
    permissionsModel,
    formsModel,
    settingsModel,
    kernelModel,
    notificationsModel,
    userModel,
    // mediaModel,
    config,
  };
  const { knowledgeApiRoutes } = Kb({
    ...defaultProps,
  });
  const {
    authApiRoutes,
    userApiRoutes,
    jwtApiRoutes,
    aclApiRoutes,
    formsApiRoutes,
    settingsApiRoutes,
    kernelApiRoutes,
    notificationsApiRoutes,
    mediaApiRoutes,
  } = orbitalApi({
    ...defaultProps,
  });
 return {
    authApiRoutes,
    userApiRoutes,
    jwtApiRoutes,
    aclApiRoutes,
    mediaApiRoutes,
    formsApiRoutes,
    settingsApiRoutes,
    kernelApiRoutes,
    notificationsApiRoutes,
    knowledgeApiRoutes,
    ...defaultProps,
  };
};

const registerAllRoutes = ({
  app,
  server,
  exceptions,
  authApiRoutes,
  userApiRoutes,
  jwtApiRoutes,
  aclApiRoutes,
  formsApiRoutes,
  settingsApiRoutes,
  kernelApiRoutes,
  notificationsApiRoutes,
  knowledgeApiRoutes,
  ridesApiRoutes,
  mediaApiRoutes,
  ...defaultProps
}) => {
  const { disableChat, disableRides, disableNotifications } = exceptions;
  // Register all end points
  // Markab routes
  app.use("/", authApiRoutes);
  app.use("/jwt", jwtApiRoutes);
  app.use("/users", ...userApiRoutes);
  app.use("/media", ...mediaApiRoutes);
  app.use("/settings", ...settingsApiRoutes);
  app.use("/acl", jwtApiRoutes, ...aclApiRoutes);
  app.use("/forms", ...formsApiRoutes);
  app.use("/kernel", ...kernelApiRoutes);
  if (!disableNotifications) {
    app.use("/notifications", ...notificationsApiRoutes);
  }
 // Markab kb
  app.use("/knowledge", ...knowledgeApiRoutes);
};

// =================================================================
// printing all routes to a file =========================================
// =================================================================
const printAllRoutes = (app) => {
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
const onError = ({ app, err }) => {
  //routes that don't require db connection
  app.use("/", (req, res, next) => {
    return res.status(500).send(err);
  });
};

const onDisconnect = ({ app }) => {
  console.log("db disconnected");
  app.use("/", (req, res, next) => {
    return res.status(500).send("err: db disconnected");
  });
};

const main = ({ exceptions }) => {
  const { app, server } = getExpressApp(config);
  const dbConnection = MongoDb({
    config,
    onDBInit: (models, schemas) => onDBInit({ app, server, models, schemas }),
    onError,
    onDisconnect: () => onDisconnect({ app }),
    onError: (err) => onError({ app, err }),
  });
  const {
    authApiRoutes,
    userApiRoutes,
    jwtApiRoutes,
    aclApiRoutes,
    formsApiRoutes,
    settingsApiRoutes,
    kernelApiRoutes,
    notificationsApiRoutes,
    knowledgeApiRoutes,
    ...defaultProps
  } = getAllApis({ app, server, exceptions });
  registerAllRoutes({
    app,
    server,
    exceptions,
    authApiRoutes,
    userApiRoutes,
    jwtApiRoutes,
    aclApiRoutes,
    formsApiRoutes,
    settingsApiRoutes,
    kernelApiRoutes,
    notificationsApiRoutes,
    knowledgeApiRoutes,
    ...defaultProps,
  });
  return { dbConnection, app, exceptions };
};
module.exports = main;
module.exports.getAllApis = getAllApis;
module.exports.registerAllRoutes = registerAllRoutes;
module.exports.getExpressApp = getExpressApp;
