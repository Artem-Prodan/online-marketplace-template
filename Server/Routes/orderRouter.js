
const Router = require("express");
const router = new Router();
const orderCont = require("../Controllers/orderCont");
const authMid = require("../middleware/authMid");
const roleMid = require("../middleware/roleMid.js");

router.post("/", authMid, orderCont.placeOrder);
router.patch("/:id/confirm",authMid, roleMid(["ADMIN"]), orderCont.confirmOrder);
router.get("/my", authMid, orderCont.getMyOrders);
router.delete("/:id",authMid, roleMid(["ADMIN"]), orderCont.remove);
module.exports = router;
