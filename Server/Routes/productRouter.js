//productRouter
const authMid = require("../middleware/authMid.js");
const roleMid = require("../middleware/roleMid.js");

const Router = require("express");
const productCont = require("../Controllers/productCont");
const router = new Router();

router.post("/", authMid, roleMid(["ADMIN"]), productCont.create);

router.get("/", productCont.getAll);

router.get("/:id", productCont.getOne);

router.patch("/:id",authMid, roleMid(["ADMIN"]), productCont.update);

router.delete("/:id", authMid, roleMid(["ADMIN"]), productCont.delete);

module.exports = router;
