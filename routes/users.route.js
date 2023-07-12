const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/users.controller");
const userController = new UsersController();
const auth = require("../middlewares/auth-middleware");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/switch/:user_id", auth, userController.switch);
router.delete("/logout/:user_id", auth, userController.logout);

module.exports = router;
