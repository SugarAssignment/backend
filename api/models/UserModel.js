const mongoose = require("mongoose");
const crypto = require("crypto")

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    encryptedPassword: {
      type: String,
      required: true,
    },
    isAppUser: {
      type: mongoose.Schema.Types.Boolean,
      default: false
    },
    salt: String,
    city: String,
    outlet: {
      type: String,
      required: false
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { strict: false }
);

UserSchema.virtual("password").set(function (password) {
  this._password = password;
  this.salt = this.makeSalt();
  this.encryptedPassword = this.encryptPassword(password);
});

UserSchema.methods = {
  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random() + ""))
},
  encryptPassword: function (password) {
    if (!password) return "";
    return crypto.createHmac("sha1", this.salt).update(password).digest("hex");
  },
  authenticate: function (password) {
    return this.encryptedPassword === this.encryptPassword(password);
  },
};

module.exports = mongoose.model("User", UserSchema);
