//indexR.js

const Router = require("express")
const router = new Router()

const productRouter = require("./productRouter")
const userRouter = require("./userRouter")
const typeRouter = require("./typeRouter")
const brandRouter = require("./brandRouter")
const orderRouter = require("./orderRouter");
const paymentRouter = require("./paymentRouter");

router.use("/user",userRouter)
router.use("/product",productRouter)
router.use("/type",typeRouter)
router.use("/brand",brandRouter)
router.use("/order", orderRouter);
router.use("/payment", paymentRouter);

module.exports = router