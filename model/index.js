const fs = require("fs").promises;
const path = require("path");
// const contacts = require("./contacts.json");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  try {
    const contactsList = await fs.readFile(contactsPath);
    return JSON.parse(contactsList);
  } catch (error) {
    throw error;
  }
};

const getContactById = async (contactId) => {
  try {
    const contactsList = await listContacts(contactsPath);
    const contact = contactsList.find(
      (contact) =>
        (contact.id ? contact.id.toString() : contact._id) === contactId
    );
    return contact;
  } catch (error) {
    throw error;
  }
};

const removeContact = async (contactId) => {
  try {
    const contactsList = await fs.readFile(contactsPath);
    const updContacts = JSON.parse(contactsList).filter(
      (contact) =>
        (contact.id ? contact.id.toString() : contact._id) !== contactId
    );
    fs.writeFile(contactsPath, JSON.stringify(updContacts));
  } catch (error) {
    throw error;
  }
};

const addContact = async (body) => {
  try {
    const contactsList = await fs.readFile(contactsPath);
    const parsedContacts = JSON.parse(contactsList);
    parsedContacts.push(body);
    fs.writeFile(contactsPath, JSON.stringify(parsedContacts));
  } catch (error) {
    throw error;
  }
};

const updateContact = async (contactId, body) => {
  const contactsList = await listContacts(contactsPath);
  try {
    const idx = contactsList.findIndex(
      (contact) =>
        contact.id?.toString() === contactId || contact._id === contactId
    );
    const contact = contactsList[idx];
    contactsList[idx] = { ...contact, ...body };
    await fs.writeFile(contactsPath, JSON.stringify(contactsList, null));
    return contactsList[idx];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
