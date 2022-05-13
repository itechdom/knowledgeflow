var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");

// set up a mongoose model
let sqlflowSchema = new Schema({
  title: String,
  statements: [
    {
      sql: String,
      title: String,
      description: String
    }
  ],
  tags: { type: Array, default: [] },
  status: String,
  gallery: Array,
  image: String,
  isASeed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  resource: { type: String, default: "sqlflow" }
});
sqlflowSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("SqlFlow", sqlflowSchema);
