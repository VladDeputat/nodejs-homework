const { user: service } = require("../services");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const path = require("path");
const fs = require("fs").promises;
const jimp = require("jimp");
const { v4: uuid } = require("uuid");
const sendEmail = require("../helpers/sendEmail");

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const result = await service.getUser({ email });
    if (result) {
      return res.status(409).json({
        code: 409,
        status: "conflict",
        message: "Email in use",
      });
    }
    const verificationToken = uuid();

    await sendEmail(email, verificationToken);

    const newUser = await service.addUser({
      email,
      password,
      verificationToken,
    });
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
    if (!user.verify) {
      return res.status(401).json({
        code: 401,
        status: "Unauthorized",
        message: "Email is not verified",
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
    return res.status(400).json({
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
        return res.status(404).json({
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

const updateUserAvatar = async (req, res, next) => {
  const { user } = req;
  const uploadDir = path.join(process.cwd(), "public/avatars");
  const { path: tempName, originalname } = req.file;
  const fileName = path.join(
    uploadDir,
    user._id + Date.now() + "." + originalname.split(".")[1]
  );
  try {
    if (req.file) {
      const img = await jimp.read(tempName);
      await img
        .autocrop()
        .cover(
          250,
          250,
          jimp.HORIZONTAL_ALIGN_CENTER || jimp.VERTICAL_ALIGN_MIDDLE
        )
        .writeAsync(req.file.path);
    }
    await fs.rename(tempName, fileName);
    await service.updateUserAvatar(user._id, fileName);
    res.json({
      code: 200,
      status: "success",
      message: "user avatar updated",
      data: { avatarURL: { fileName } },
    });
  } catch (error) {
    await fs.unlink(tempName);
    next(error);
  }
};

const verifyUser = async (req, res, next) => {
  const { verificationToken } = req.params;
  try {
    result = await service.verifyUser({ verificationToken });
    if (result) {
      return res.json({
        code: 200,
        status: "success",
        message: "Verification successful",
      });
    } else {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "User not found",
      });
    }
  } catch (error) {
    next(error);
  }
};

const verifyUserByEmail = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: "missing required field email",
    });
  }
  try {
    const user = await service.getUser({ email });
    if (!user) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "User not found",
      });
    }
    if (user.verify) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Verification has already been passed",
      });
    } else {
      const result = await sendEmail(email, user.verificationToken);
      if (result) {
        return res.json({
          code: 200,
          status: "success",
          message: "Verification email sent",
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  curUser,
  updateUserSubscription,
  updateUserAvatar,
  verifyUser,
  verifyUserByEmail,
};
