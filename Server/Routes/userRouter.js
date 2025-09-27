//userRouter
const express = require("express");
const router = express.Router();
const UserCont = require("../Controllers/userCont");
const userCont = new UserCont();
const {check} = require("express-validator");
const authMid = require("../middleware/authMid.js");
const roleMid = require("../middleware/roleMid.js");

console.log("userCont.registration:", userCont.registration);

router.post(
  "/registration",
  [
    check("email", "Email is required").notEmpty(),
    check("email", "Email is not valid").isEmail(),
    check("password", "Password must be 4-10 characters long").isLength({ min: 4, max: 10 })
  ],
  userCont.registration
);

router.post("/login", userCont.login);

router.get("/check",authMid, roleMid(["ADMIN"]), userCont.check);

router.patch("/:id",authMid, userCont.update);

router.delete("/:id",authMid, roleMid(["ADMIN"]), userCont.delete);

module.exports = router
