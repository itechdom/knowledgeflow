const mongoose = require("mongoose");
const config = require("config");
let conn = null;
const uri = config.get("db.host");
const serverless = require("serverless-http");
const express = require("express");
const contactsApi = require("./index.js");
const app = express();
const model = require("./contacts");
const formsSchema = require("./forms");
const permissionsSchema = require("./permissions");
let handler, contactsModel, permissionsModel;
exports.handler = async function(event, context) {
  console.log(uri);
  // Make sure to add this so you can re-use "conn" between function calls.
  // See https://www.mongodb.com/blog/post/serverless-development-with-nodejs-aws-lambda-mongodb-atlas
  context.callbackWaitsForEmptyEventLoop = false;
  // Because "conn" is in the global scope, Lambda may retain it between
  // function calls thanks to "callbackWaitsForEmptyEventLoop".
  // This means your Lambda function doesn't have to go through the
  // potentially expensive process of connecting to MongoDB every time.
  if (conn == null) {
    console.log("connecting to db ...");
    conn = await mongoose.createConnection(uri, {
      // Buffering means mongoose will queue up operations if it gets
      // disconnected = MongoDB and send them when it reconnects.
      // With serverless, better to fail fast if not connected.
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // and MongoDB driver buffering
    });
    console.log("connected to db");
  }
  contactsModel = conn.model("Contacts", model);
  formsModel = conn.model("Forms", formsSchema);
  permissionsModel = conn.model("Permissions", permissionsSchema);
  handler = serverless(
    app.use(
      contactsApi({
        contactsModel,
        formsModel,
        permissionsModel
      })
    )
  );
  const result = await handler(event, context);
  return result;
};
