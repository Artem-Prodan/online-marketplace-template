const OrderController = require("../Controllers/orderCont");
const { Order, OrderItem, Product } = require("../Models/models");
const ApiError = require("../errors/apiError");

jest.mock("../Models/models", () => ({
  Order: {
    create: jest.fn(),
    findByPk: jest.fn(),
  },
  OrderItem: {
    create: jest.fn(),
  },
  Product: {
    findByPk: jest.fn(),
  }
}));

describe("OrderController", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {}, userId: 1 };
    res = { json: jest.fn(), status: jest.fn(() => res) };
    next = jest.fn();

    jest.clearAllMocks();
  });

  // ===== placeOrder =====
  test("placeOrder places order with valid items", async () => {
    req.body.items = [{ productId: 1, quantity: 2 }];

    const mockOrder = { id: 10, total: 0, save: jest.fn() };
    Order.create.mockResolvedValue(mockOrder);
    Product.findByPk.mockResolvedValue({ id: 1, price: 100 });
    OrderItem.create.mockResolvedValue({});

    await OrderController.placeOrder(req, res, next);

    expect(Order.create).toHaveBeenCalledWith({ userId: 1, total: 0, status: "IN_PROCESS" });
    expect(Product.findByPk).toHaveBeenCalledWith(1);
    expect(OrderItem.create).toHaveBeenCalledWith({
      orderId: 10,
      productId: 1,
      quantity: 2,
      price: 100
    });
    expect(mockOrder.total).toBe(200);
    expect(mockOrder.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: "Order placed", orderId: 10 });
  });

  test("placeOrder fails with no items", async () => {
    req.body.items = [];

    await OrderController.placeOrder(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      message: "No items in order."
    }));
  });

  // ===== confirmOrder =====
  test("confirmOrder updates status if paid and successful", async () => {
    req.params.id = 5;

    const mockOrder = {
      id: 5,
      status: "PAID",
      paymentStatus: "SUCCESS",
      save: jest.fn()
    };

    Order.findByPk.mockResolvedValue(mockOrder);

    await OrderController.confirmOrder(req, res, next);

    expect(mockOrder.status).toBe("CONFIRMED");
    expect(mockOrder.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: "Order confirmed", id: 5 });
  });

  test("confirmOrder fails if order not found", async () => {
    req.params.id = 99;
    Order.findByPk.mockResolvedValue(null);

    await OrderController.confirmOrder(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      message: "Order not found"
    }));
  });

  test("confirmOrder fails if order not paid or payment failed", async () => {
    req.params.id = 10;
    Order.findByPk.mockResolvedValue({ id: 10, status: "IN_PROCESS", paymentStatus: "PENDING" });

    await OrderController.confirmOrder(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Only paid and successful orders can be confirmed"
    });
  });

  // ===== remove =====
  test("remove deletes existing order", async () => {
    req.params.id = 7;
    const mockOrder = { id: 7, destroy: jest.fn() };
    Order.findByPk.mockResolvedValue(mockOrder);

    await OrderController.remove(req, res, next);

    expect(mockOrder.destroy).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: "Order with id 7 has been deleted." });
  });

  test("remove fails if order not found", async () => {
    req.params.id = 123;
    Order.findByPk.mockResolvedValue(null);

    await OrderController.remove(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringContaining("not found")
    }));
  });
});
