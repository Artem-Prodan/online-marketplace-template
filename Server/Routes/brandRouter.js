const authMid = require("../middleware/authMid.js");
const roleMid = require("../middleware/roleMid.js");
const Router = require("express");
const brandCont = require("../Controllers/brandCont");
const router = new Router()

router.post("/",authMid, roleMid(["ADMIN"]), brandCont.create);

router.get("/", brandCont.getAll);

router.patch("/:id",authMid, roleMid(["ADMIN"]), brandCont.update);

router.delete("/:id",authMid, roleMid(["ADMIN"]), brandCont.delete);


module.exports = router