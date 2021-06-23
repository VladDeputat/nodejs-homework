const { Contact } = require("../models");

const getContacts = (query) => {
  return Contact.find(query);
};

const getContact = (id) => {
  return Contact.findById(id);
};

const addContact = (body) => {
  return Contact.create(body);
};

const updateContact = (id, body) => {
  return Contact.findByIdAndUpdate(id, body);
};

const deleteContact = (id) => {
  return Contact.findByIdAndDelete(id);
};

const updateContactStatus = (id, favorite) => {
  return Contact.findByIdAndUpdate(id, { favorite });
};

const service = {
  getContacts,
  getContact,
  addContact,
  updateContact,
  updateContactStatus,
  deleteContact,
};

module.exports = service;
