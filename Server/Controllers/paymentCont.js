
const { Order } = require("../Models/models");
const ApiError = require("../errors/apiError");

class PaymentController {
    
    async pay(req, res, next) {
        try {
            const { orderId, paymentMethod } = req.body;

            const order = await Order.findByPk(orderId);
            if (!order) {
                return next(ApiError.badRequest("Order not found"));
            }

            if (order.status !== "IN_PROCESS") {
                return res.status(400).json({ message: "Order has not been paid yet" });
            }

            // Mock payment gateway logic
            const isSuccess = Math.random() > 0.2; // 80% success rate

            if (!isSuccess) {
                 order.paymentStatus = "FAILED";
                await order.save();

                console.warn(`Mock payment FAILED for order ${orderId}`);
                return res.status(402).json({ message: "Payment failed (mock gateway)" });
            }

            order.status = "PAID";
            order.paymentStatus = "SUCCESS";
            order.paidAt = new Date();
            order.paymentMethod = paymentMethod || "UNKNOWN";

            await order.save();

            console.log(`Mock payment SUCCESSFUL for order ${orderId}`);

            return res.json({ 
                message: "Payment successful", 
                orderId: order.id,
                paidAt: order.paidAt,
                paymentStatus: order.paymentStatus,
                paymentMethod: order.paymentMethod
            });
        } catch (e) {
            console.error("PAYMENT ERROR:", e);
            next(ApiError.internal("Payment error"));
        }
    }
}

module.exports = new PaymentController();
