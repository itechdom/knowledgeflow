var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");

// set up a mongoose model
let hashSchema = new Schema({
  hashId: { type: String },
  metaData: { type: Object },
  createdAt: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  resource: { type: String, default: "hash" }
});
hashSchema.plugin(mongoosePaginate);
module.exports = hashSchema;
