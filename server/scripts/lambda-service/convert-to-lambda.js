const lambdaModel = require("@markab.io/orbital-api/MongoDb/models/lambda");
const lambdaService = require("@markab.io/node/lambda-service/lambda-service-script");
const MongoDb = require("@markab.io/orbital-api/MongoDb/index");
const config = require("config");
lambdaService({
  lambdaModel,
  APP_PATH: "./src/",
  MODELS_FOLDER: "./src/Orbital/Mongodb/models/",
  MongoDb,
  config,
});
