const express = require("express");
const router = express.Router();
const contactCtrl = require("../controllers/contactCtrl");

const {
  validateCreateContact,
  validateUpdateContact,
} = require("./validation");

router.get("/", contactCtrl.getContacts);

router.get("/:contactId", contactCtrl.getContact);

router.post("/", validateCreateContact, contactCtrl.addContact);

router.delete("/:contactId", contactCtrl.deleteContact);

router.patch("/:contactId", validateUpdateContact, contactCtrl.updateContact);

router.patch("/:contactId/favorite", contactCtrl.updateContactStatus);

module.exports = router;
