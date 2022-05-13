// =================================================================
// get the packages we need ========================================
// =================================================================
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import config from "config"; // get our config file
import session from "express-session"; // we remove this later
import RestApi from "./api";
import MongoDb from "@markab.io/orbital-api/MongoDb";
import expressPrintRoutes from "express-print-routes";
import path from "path";

// =================================================================
// App =============================================================
// =================================================================
export const app = express();
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
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// use morgan to log requests to the console
app.use(morgan("dev"));

const registerAllRoutes = schemas => {
  // Get all available end points
  const {
    authApiRoutes,
    chatApiRoutes,
    userApiRoutes,
    jwtApiRoutes,
    localizationApiRoutes,
    aclApiRoutes,
    formsApiRoutes,
    blogApiRoutes,
    settingsApiRoutes,
    eventsApiRoutes
  } = RestApi({ app, config, schemas });

  // Register all end points
  app.use("/", authApiRoutes);
  app.use("/", ...localizationApiRoutes);
  app.use("/jwt", jwtApiRoutes);
  app.use("/users", jwtApiRoutes, ...userApiRoutes);
  app.use("/events", jwtApiRoutes, ...eventsApiRoutes);
  app.use("/blogs", jwtApiRoutes, ...blogApiRoutes);
  app.use("/settings", jwtApiRoutes, ...settingsApiRoutes);
  app.use("/chat", jwtApiRoutes, ...chatApiRoutes);
  app.use("/acl", jwtApiRoutes, ...aclApiRoutes);
  app.use("/forms", jwtApiRoutes, ...formsApiRoutes);
};

// =================================================================
// printing all routes to a file =========================================
// =================================================================
const printAllRoutes = app => {
  let filepath = path.join(__dirname, "../docs/routes.txt");
  expressPrintRoutes(app, filepath);
};

// =================================================================
// Setting up the database =========================================
// =================================================================

//models: mongoose models
//schemas: the schema of each model
// on DB initalization
const onDBInit = (models, schemas) => {
  registerAllRoutes(schemas);
  app.use("/schemas", (req, res, next) => {
    res.send(schemas);
  });
  printAllRoutes(app);
};

//if there is an error connecting to db, send an error back to the user
const onError = err => {
  //routes that don't require db connection
  app.use("/", (req, res, next) => {
    return res.status(500).send(err);
  });
};

const onDisconnect = () => {
  console.log("db disconnected");
  app.use("/", (req, res, next) => {
    return res.status(500).send("err: db disconnected");
  });
};
const dbConnection = MongoDb({ config, onDBInit, onError, onDisconnect });

// =================================================================
// starting the server ================================================
// =================================================================
const port = config.get("server.port"); // used to create, sign, and verify tokens
const ip = config.get("server.host");
app.listen(port, ip);
console.log(`Magic happens at ${ip}:${port}`);
