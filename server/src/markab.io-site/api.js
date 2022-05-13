const mongoose = require("mongoose");
const contactsSchema = require("@markab.io/orbital-api/MongoDb/models/contacts");
const formsSchema = require("@markab.io/orbital-api/MongoDb/models/forms");
const permissionsSchema = require("@markab.io/orbital-api/MongoDb/models/permissions");
const lambdaModel = require("@markab.io/orbital-api/MongoDb/models/lambda");
const contactsModel = mongoose.model("Contacts", contactsSchema);
const formsModel = mongoose.model("Forms", formsSchema);
const permissionsModel = mongoose.model("Permissions", permissionsSchema);
const contactApi = require("./Contacts");

//api
const Api = ({ app, config, schemas }) => {
  let contactApiRoutes = contactApi({
    config,
    contactsModel,
    permissionsModel,
    formsModel,
    lambdaModel
  });
  return {
    contactApiRoutes
  };
};

module.exports = Api;
