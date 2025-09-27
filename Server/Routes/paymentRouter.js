
const Router = require("express");
const router = new Router();
const paymentCont = require("../Controllers/paymentCont");
const authMid = require("../middleware/authMid");

router.post("/", authMid, paymentCont.pay);

module.exports = router;
