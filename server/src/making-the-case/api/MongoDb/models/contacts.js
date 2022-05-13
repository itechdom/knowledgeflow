var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// set up a mongoose model
let contactsSchema = new Schema({
  key: String,
  name: { type: String },
  email: { type: String },
  message: { type: String },
  createdAt: { type: Date, default: Date.now },
  resource: { type: String, default: "contacts" }
});
module.exports = contactsSchema;
