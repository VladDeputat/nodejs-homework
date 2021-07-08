const { Schema } = require("mongoose");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");

const usersSchema = Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: (value) => value.includes("@"),
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: {
    type: String,
    default: function () {
      return gravatar.url(this.email, { s: 250 }, true);
    },
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, "Verify token is required"],
  },
});

usersSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

usersSchema.methods.passwordValid = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = usersSchema;
