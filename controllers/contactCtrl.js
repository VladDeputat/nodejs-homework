const { contact: service } = require("../services");

const getContacts = async (req, res, next) => {
  const { query } = req;
  try {
    const contacts = await service.getContacts(query);
    res.json({
      code: 200,
      status: "success",
      data: {
        contacts,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getContact = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await service.getContact(contactId);
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
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const newContact = await service.addContact(req.body);
    return res.json({
      code: 201,
      status: "created",
      data: {
        newContact,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await service.getContact(contactId);
  if (!contact) {
    return res.json({
      code: 404,
      status: "error",
      message: "Not found",
    });
  } else {
    try {
      const result = await service.deleteContact(contactId);
      res.json({
        code: 201,
        status: "success",
        message: "contact deleted",
        data: { result },
      });
    } catch (error) {
      next(error);
    }
  }
};

const updateContact = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const result = await service.updateContact(contactId, req.body);
    if (!result) {
      return res.json({
        code: 404,
        status: "error",
        message: "Not found",
      });
    }
    res.json({
      code: 200,
      status: "success",
      message: "contact updated",
      data: { result },
    });
  } catch (error) {
    next(error);
  }
};

const updateContactStatus = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  console.log(req.body);
  if (!favorite) {
    return res.json({
      code: 400,
      status: "error",
      message: "missing field favorite",
    });
  } else {
    try {
      const result = await service.updateContactStatus(contactId, favorite);

      if (!result) {
        return res.json({
          code: 404,
          status: "error",
          message: "Not found",
        });
      }
      res.json({
        code: 200,
        status: "success",
        message: "contact status updated",
        data: { result },
      });
    } catch (error) {
      next(error);
    }
  }
};

const contactCtrl = {
  getContacts,
  getContact,
  addContact,
  deleteContact,
  updateContact,
  updateContactStatus,
};

module.exports = contactCtrl;
