const express = require("express");
const router = express.Router();
const contactCtrl = require("../controllers/contactCtrl");

const useAuth = require("../helpers/useAuth");

const {
  validateCreateContact,
  validateUpdateContact,
} = require("../helpers/validation");

router.get("/", useAuth, contactCtrl.getContacts);

router.get("/:contactId", useAuth, contactCtrl.getContact);

router.post("/", validateCreateContact, useAuth, contactCtrl.addContact);

router.delete("/:contactId", useAuth, contactCtrl.deleteContact);

router.patch(
  "/:contactId",
  useAuth,
  validateUpdateContact,
  contactCtrl.updateContact
);

router.patch("/:contactId/favorite", useAuth, contactCtrl.updateContactStatus);

module.exports = router;
