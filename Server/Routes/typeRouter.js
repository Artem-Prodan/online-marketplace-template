//typeRouter
const authMid = require("../middleware/authMid.js");
const roleMid = require("../middleware/roleMid.js");

const Router = require("express");
const typeCont = require("../Controllers/typeCont");
const router = new Router()

router.post("/", authMid, roleMid(["ADMIN"]), typeCont.create);

router.get("/", typeCont.getAll);

router.patch("/:id",authMid, roleMid(["ADMIN"]), typeCont.update);

router.delete("/:id",authMid, roleMid(["ADMIN"]), typeCont.delete);


module.exports = router