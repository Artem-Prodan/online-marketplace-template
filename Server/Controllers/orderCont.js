
const { Order, OrderItem, Product } = require("../Models/models");
const ApiError = require("../errors/apiError");

class OrderController {

    async placeOrder(req, res, next) {
        try {
            const { items } = req.body; // [{productId, quantity}]
            const userId = req.userId;

            if (!items || !Array.isArray(items) || items.length === 0) {
                return next(ApiError.badRequest("No items in order."));
            }

            let total = 0;
            const order = await Order.create({ userId, total: 0, status: "IN_PROCESS" });

            for (const item of items) {
                const product = await Product.findByPk(item.productId);
                if (!product) continue;

                const price = product.price * item.quantity;
                total += price;

                await OrderItem.create({
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: product.price
                });
            }

            order.total = total;
            await order.save();

            return res.json({ message: "Order placed", orderId: order.id });
        } catch (e) {
                console.error("ORDER ERROR:", e); 
            next(ApiError.internal("Order placing failed"));
        }
    }

    async confirmOrder(req, res, next) {
        try {
            const { id } = req.params;
            const order = await Order.findByPk(id);

            if (!order) {
                return next(ApiError.badRequest("Order not found"));
            }
            if (order.status !== "PAID" || order.paymentStatus !== "SUCCESS") {
                return res.status(400).json({ message: "Only paid and successful orders can be confirmed" });
            }

            order.status = "CONFIRMED";
            await order.save();

            return res.json({ message: "Order confirmed", id: order.id });
        } catch (e) {
            next(ApiError.internal("Order confirmation failed"));
        }
    }

    async getMyOrders(req, res, next) {
    try {
        const userId = req.userId;
        const orders = await Order.findAll({
            where: { userId },
            include: [{ model: OrderItem, as: "items", include: [Product] }],
            order: [['createdAt', 'DESC']]
        });
        return res.json(orders);
    } catch (e) {
        console.error("GET MY ORDERS ERROR:", e);
        next(ApiError.internal("Could not fetch orders"));
    }
}

    async remove(req, res, next) {
    try {
        const { id } = req.params;

        const order = await Order.findByPk(id);
        if (!order) {
            return next(ApiError.badRequest(`Order with id ${id} not found.`));
        }

        await order.destroy(); //  onDelete: 'CASCADE' OrderItems will be removed too

        return res.json({ message: `Order with id ${id} has been deleted.` });
    } catch (error) {
        console.error("ORDER DELETE ERROR:", error);
        return next(ApiError.internal("Deleting order failed"));
    }
}

}

module.exports = new OrderController();
