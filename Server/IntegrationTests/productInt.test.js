const request = require("supertest");
const express = require("express");
const productRouter = require("../Routes/productRouter");
const { Product, ProductInfo } = require("../Models/models");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");

jest.mock("../middleware/authMid.js", () => (req, res, next) => {
  req.user = { id: 1, role: "ADMIN" };
  next();
});

jest.mock("../middleware/roleMid.js", () => (roles) => (req, res, next) => {
  if (roles.includes(req.user.role)) {
    return next();
  } else {
    return res.status(403).json({ message: "Forbidden" });
  }
});

jest.mock("../Models/models", () => ({
  Product: {
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn()
  },
  ProductInfo: {
    create: jest.fn(),
    destroy: jest.fn()
  }
}));

jest.mock("uuid", () => ({
  v4: jest.fn(() => "mock-uuid")
}));

describe("Product routes integration test", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(require("express-fileupload")());
    app.use(express.json());
    app.use("/api/product", productRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should create, get, update and delete a product", async () => {

    const mockImg = {
      mv: jest.fn((p, cb) => cb())
    };

    // ===== create =====
    Product.create.mockResolvedValue({ id: 1, name: "MockProduct" });
    ProductInfo.create.mockResolvedValue({});

    const resCreate = await request(app)
      .post("/api/product")
      .field("name", "MockProduct")
      .field("price", "100")
      .field("brandId", "1")
      .field("typeId", "1")
      .field("info", JSON.stringify([{ title: "testTitle", description: "testDesc" }]))
      .attach("img", Buffer.from("test"), {
        filename: "test.jpg",
        contentType: "image/jpeg"
      });

    expect(resCreate.statusCode).toBe(200);
    expect(Product.create).toHaveBeenCalledWith(expect.objectContaining({
      name: "MockProduct",
      price: "100",
      brandId: "1",
      typeId: "1",
      img: "mock-uuid.jpg"
    }));

    // ===== get all =====
    Product.findAndCountAll.mockResolvedValue({ count: 1, rows: [{ id: 1 }] });

    const resGetAll = await request(app).get("/api/product");
    expect(resGetAll.statusCode).toBe(200);
    expect(resGetAll.body).toEqual({ count: 1, rows: [{ id: 1 }] });

    // ===== get one =====
    Product.findOne.mockResolvedValue({ id: 1, name: "MockProduct", info: [] });

    const resGetOne = await request(app).get("/api/product/1");
    expect(resGetOne.statusCode).toBe(200);
    expect(resGetOne.body.name).toBe("MockProduct");

    // ===== update =====
    const save = jest.fn();
    Product.findByPk.mockResolvedValue({
      id: 1,
      name: "MockProduct",
      save,
      info: []
    });
    ProductInfo.destroy.mockResolvedValue(1);

    const resUpdate = await request(app)
      .patch("/api/product/1")
      .send({ name: "UpdatedName", info: JSON.stringify([{ title: "t", description: "d" }]) });

    expect(resUpdate.statusCode).toBe(200);
    expect(ProductInfo.create).toHaveBeenCalledWith({
      title: "t",
      description: "d",
      productId: 1
    });

    // ===== delete =====
    Product.destroy.mockResolvedValue(1);

    const resDelete = await request(app).delete("/api/product/1");
    expect(resDelete.statusCode).toBe(200);
    expect(resDelete.body.message).toMatch(/deleted/i);
  });
});

