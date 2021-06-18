const express = require("express");
const router = express.Router();
const { v4 } = require("uuid");

const ctrl = require("../../model/index");
const {
  validateCreateContact,
  validateUpdateContact,
} = require("./validation");

router.get("/", async (req, res, next) => {
  try {
    const contacts = await ctrl.listContacts();
    res.json({
      code: 200,
      status: "success",
      data: {
        contacts,
      },
    });
  } catch (error) {
    throw error;
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await ctrl.getContactById(req.params.contactId);
    if (contact) {
      return res.json({
        code: 200,
        status: "success",
        data: {
          contact,
        },
      });
    } else {
      return res.json({
        code: 404,
        status: "error",
        message: "Contact not found",
      });
    }
  } catch (error) {
    throw error;
  }
});

router.post("/", validateCreateContact, async (req, res, next) => {
  const newContact = { _id: v4(), ...req.body };
  if (!newContact.name || !newContact.email || !newContact.phone) {
    return res.json({
      code: 400,
      status: "error",
      message: "missing required name field",
    });
  }
  try {
    await ctrl.addContact(newContact);
    return res.json({
      code: 201,
      status: "created",
      data: {
        newContact,
      },
    });
  } catch (error) {
    throw error;
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const contact = await ctrl.getContactById(req.params.contactId);
  if (!contact) {
    return res.json({
      code: 404,
      status: "error",
      message: "Not found",
    });
  } else {
    try {
      ctrl.removeContact(req.params.contactId);
      res.json({
        code: 200,
        status: "success",
        message: "contact deleted",
      });
    } catch (error) {
      throw error;
    }
  }
});

router.patch("/:contactId", validateUpdateContact, async (req, res, next) => {
  const id = req.params.contactId;
  const updContact = req.body;
  try {
    const contacts = await ctrl.listContacts();
    const contact = contacts.find(
      (contact) => contact.id?.toString() === id || contact._id === id
    );
    if (!contact) {
      return res.json({
        code: 404,
        status: "error",
        message: "Not found",
      });
    }
    if (!updContact.name || !updContact.email || !updContact.phone) {
      return res.json({
        code: 400,
        status: "error",
        message: "missing required name field",
      });
    }
    const data = await ctrl.updateContact(id, updContact);
    res.json({
      code: 200,
      status: "success",
      message: "contact updated",
      data,
    });
  } catch (error) {
    throw error;
  }
});

module.exports = router;
