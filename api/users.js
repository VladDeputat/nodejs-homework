const express = require("express");
const router = express.Router();
const upload = require("./imgUploader");

const userCtrl = require("../controllers/userCtrl");

const useAuth = require("./useAuth");

const { validateRegister } = require("./validation");

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

module.exports = router;
