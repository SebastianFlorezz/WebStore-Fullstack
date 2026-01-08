const express = require("express");
const router = express.Router();

const { register, login, updateUserName} = require("./controller");

router.post("/register", register);
router.post("/login", login);
router.put("/updateUserName", updateUserName);



module.exports = router;