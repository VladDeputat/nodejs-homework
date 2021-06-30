const { user: service } = require("../services");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const result = await service.getUser({ email });
    if (result) {
      return res.json({
        code: 409,
        status: "conflict",
        message: "Email in use",
      });
    }
    const newUser = await service.addUser({ email, password });
    const { TOKEN_KEY } = process.env;
    const payload = {
      id: newUser._id,
    };
    const token = jwt.sign(payload, TOKEN_KEY);
    res.status(201).json({
      code: 201,
      status: "created",
      data: {
        newUser,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await service.getUser({ email });

    if (!user || !user.passwordValid(password)) {
      return res.status(401).json({
        code: 401,
        status: "Unauthorized",
        message: "Email or password is wrong",
      });
    }
    const payload = {
      id: user._id,
    };
    const { TOKEN_KEY } = process.env;
    const token = jwt.sign(payload, TOKEN_KEY);
    await service.updateUserToken(user._id, token);
    res.json({
      status: "success",
      code: 200,
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  const { user } = req;
  const token = null;
  try {
    await service.updateUserToken(user._id, token);
    res.status(204).json({
      status: "success",
      code: 204,
      message: "No content",
    });
  } catch (error) {
    next(error);
  }
};

const curUser = async (req, res, next) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(401).json({
        code: 401,
        status: "Unauthorized",
        message: "Not authorized",
      });
    }
    const currentUser = {
      email: req.user.email,
      subscription: req.user.subscription,
    };
    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        currentUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateUserSubscription = async (req, res, next) => {
  const { user } = req;
  const { subscription } = req.body;
  if (!subscription) {
    return res.json({
      code: 400,
      status: "error",
      message: "missing field subscription",
    });
  } else {
    try {
      const result = await service.updateUserSubscription(
        user._id,
        subscription
      );

      if (!result) {
        return res.json({
          code: 404,
          status: "error",
          message: "Not found",
        });
      }
      const updUser = {
        email: result.email,
        subscription: result.subscription,
      };
      res.json({
        code: 200,
        status: "success",
        message: "user subscription updated",
        data: { updUser },
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = { signup, login, logout, curUser, updateUserSubscription };
