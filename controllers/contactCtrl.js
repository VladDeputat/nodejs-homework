const { contact: service } = require("../services");

const getContacts = async (req, res, next) => {
  const { favorite } = req.query;
  const { user } = req;
  const query = favorite
    ? {
        favorite,
        owner: user._id,
      }
    : { owner: user._id };

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
  const { user } = req;
  const query = {
    _id: contactId,
    owner: user._id,
  };
  try {
    const contact = await service.getContact(query);
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
  const { body, user } = req;
  try {
    const newContact = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      owner: user._id,
    };
    const result = await service.addContact(newContact);
    res.json({
      code: 201,
      status: "created",
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { user } = req;
  const query = {
    _id: contactId,
    owner: user._id,
  };
  try {
    const contact = await service.getContact(query);
    console.log(contact);
    if (!contact) {
      return res.json({
        code: 404,
        status: "error",
        message: "Not found",
      });
    } else {
      const result = await service.deleteContact(contactId);
      res.json({
        code: 201,
        status: "success",
        message: "contact deleted",
        data: { result },
      });
    }
  } catch (error) {
    next(error);
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
