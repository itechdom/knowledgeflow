var mongoose = require("mongoose");
var findOrCreate = require("mongoose-findorcreate");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const saltRounds = 10;
const Joi = require("joi");
const mongoosePaginate = require("mongoose-paginate");

const userJoiSchema = Joi.object()
  .keys({
    password: Joi.string()
      .min(8)
      .max(60),
    email: Joi.string()
      .email()
      .required(),
    name: Joi.string().required(),
    avatar: Joi.string(),
    image: Joi.string(),
    created: Joi.date()
  })
  .unknown();

const Schema = mongoose.Schema;
let userSchema = new Schema({
  id: String,
  name: String,
  email: { type: String, unique: true },
  phone: { type: String },
  password: {
    type: String
  },
  resetPasswordToken: {
    type: String,
    set: function() {
      const buf = Buffer.alloc(10);
      crypto.randomFillSync(buf, 5);
      let randToken = buf.toString("hex");
      return randToken;
    }
  },
  confirmEmailToken: {
    type: String,
    default: function() {
      const buf = Buffer.alloc(10);
      crypto.randomFillSync(buf, 5);
      let randToken = buf.toString("hex");
      return randToken;
    }
  },
  gender: String,
  avatar: String,
  jwtToken: String,
  acl: Array,
  image: String,
  hasSeenTutorial: { type: Boolean, default: false },
  hasConfirmedEmail: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  permissions: [{ type: Schema.Types.ObjectId, ref: "Permissions" }],
  hashes: [{ type: Schema.Types.ObjectId, ref: "Hash" }],
  createdAt: { type: Date, default: Date.now },
  isASeed: { type: Boolean, default: false },
  resource: { type: String, default: "users" }
});
userSchema.plugin(findOrCreate);
userSchema.plugin(mongoosePaginate);

userSchema.methods.verifyPassword = function(password) {
  if (bcrypt.compareSync(password, this.password)) {
    return this;
  }
  return false;
};

userSchema.methods.joiValidate = function(obj) {
  return Joi.validate(obj, userJoiSchema);
};

userSchema.statics.encryptPassword = function(newValue) {
  return bcrypt.hashSync(newValue, saltRounds);
};

userSchema.statics.joiValidate = function(obj) {
  return Joi.validate(obj, userJoiSchema);
};

// set up a mongoose model
module.exports = mongoose.model("User", userSchema);
