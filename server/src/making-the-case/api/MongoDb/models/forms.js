var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// set up a mongoose model
let formsSchema = new Schema({
  key: String,
  fields: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
  resource: { type: String, default: "forms" }
});
module.exports = formsSchema;
