const { Schema, SchemaTypes } = require("mongoose");

const contactsSchema = Schema({
  name: {
    type: String,
    minLength: 2,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Set email for contact"],
    validate: (value) => value.includes("@"),
  },
  phone: {
    type: String,
    unique: true,
    required: [true, "Set phone for contact"],
  },
  favorite: {
    type: String,
    enum: ["true", "false"],
    default: "false",
  },
  owner: {
    type: SchemaTypes.ObjectId,
    ref: "user",
  },
});

module.exports = contactsSchema;
