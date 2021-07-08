const express = require("express");
const router = express.Router();
const upload = require("../helpers/imgUploader");

const userCtrl = require("../controllers/userCtrl");

const useAuth = require("../helpers/useAuth");

const { validateRegister } = require("../helpers/validation");

router.post("/signup", validateRegister, userCtrl.signup);

router.post("/login", userCtrl.login);

router.post("/logout", useAuth, userCtrl.logout);

router.get("/current", useAuth, userCtrl.curUser);

router.patch("/", useAuth, userCtrl.updateUserSubscription);

router.patch(
  "/avatars",
  useAuth,
  upload.single("avatar"),
  userCtrl.updateUserAvatar
);

router.get("/verify/:verificationToken", userCtrl.verifyUser);

router.post("/verify", userCtrl.verifyUserByEmail);

module.exports = router;
