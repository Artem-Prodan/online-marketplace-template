
const request = require("supertest");
const express = require("express");
const fileUpload = require("express-fileupload");

const orderRouter = require("../Routes/orderRouter");
const orderController = require("../Controllers/orderCont");

jest.mock("../Models/models", () => ({
  Order: {
    create: jest.fn(),
    findByPk: jest.fn()
  },
  OrderItem: {
    create: jest.fn()
  },
  Product: {
    findByPk: jest.fn()
  }
}));

jest.mock("../middleware/authMid", () => (req, res, next) => {
  req.userId = 1;
  next();
});
jest.mock("../middleware/roleMid", () => roles => (req, res, next) => {
  next();
});

const { Order, OrderItem, Product } = require("../Models/models");

describe("Order routes integration test", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(fileUpload());
    app.use("/api/order", orderRouter);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create, confirm and delete an order", async () => {
    // ---- CREATE ----
    const mockOrder = {
      id: 10,
      total: 0,
      status: "IN_PROCESS",
      save: jest.fn()
    };
    Order.create.mockResolvedValue(mockOrder);
    Product.findByPk.mockResolvedValue({ id: 1, price: 100 });
    OrderItem.create.mockResolvedValue({});

    const createRes = await request(app)
      .post("/api/order")
      .send({ items: [{ productId: 1, quantity: 2 }] });

    expect(createRes.statusCode).toBe(200);
    expect(createRes.body).toEqual({ message: "Order placed", orderId: 10 });

    // ---- CONFIRM ----
    const mockPaidOrder = {
      id: 10,
      status: "PAID",
      paymentStatus: "SUCCESS",
      save: jest.fn()
    };
    Order.findByPk.mockResolvedValue(mockPaidOrder);

    const confirmRes = await request(app)
      .patch("/api/order/10/confirm");

    expect(confirmRes.statusCode).toBe(200);
    expect(confirmRes.body).toEqual({ message: "Order confirmed", id: 10 });
    expect(mockPaidOrder.status).toBe("CONFIRMED");

    // ---- DELETE  ----
    const mockOrderToDelete = {
      id: 10,
      destroy: jest.fn()
    };
    Order.findByPk.mockResolvedValue(mockOrderToDelete);

    const deleteRes = await request(app)
      .delete("/api/order/10");

    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body).toEqual({ message: "Order with id 10 has been deleted." });
    expect(mockOrderToDelete.destroy).toHaveBeenCalled();
  });
});