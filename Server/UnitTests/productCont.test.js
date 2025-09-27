const ProductCont = require("../Controllers/productCont");
const { Product, ProductInfo } = require("../Models/models");
const ApiError = require("../errors/apiError");
const uuid = require("uuid");
const path = require("path");

jest.mock("../Models/models", () => ({
  Product: { create: jest.fn() },
  ProductInfo: { create: jest.fn() }
}));

jest.mock("uuid", () => ({
  v4: jest.fn(() => "test-uuid")
}));

describe("ProductCont.create", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        name: "TestProduct",
        price: 100,
        brandId: 1,
        typeId: 1,
        info: JSON.stringify([{ title: "info1", description: "desc1" }])
      },
      files: {
        img: {
          mv: jest.fn((path, cb) => cb && cb()) // moving file imitation
        }
      }
    };
    res = {
      json: jest.fn()
    };
    next = jest.fn();

    Product.create.mockReset();
    ProductInfo.create.mockReset();
    req.files.img.mv.mockClear();
    uuid.v4.mockClear();
  });

  test("valid product addition", async () => {
    Product.create.mockResolvedValue({ id: 1, name: "TestProduct" });
    ProductInfo.create.mockResolvedValue({});

    await ProductCont.create(req, res, next);

    expect(req.files.img.mv).toHaveBeenCalledWith(expect.any(String));
    expect(Product.create).toHaveBeenCalledWith({
      name: "TestProduct",
      price: 100,
      brandId: 1,
      typeId: 1,
      img: "test-uuid.jpg"
    });
    expect(ProductInfo.create).toHaveBeenCalledWith({
      title: "info1",
      description: "desc1",
      productId: 1
    });
    expect(res.json).toHaveBeenCalledWith({ id: 1, name: "TestProduct" });
    expect(next).not.toHaveBeenCalled();
  });

  test("missing required fields", async () => {
    req.body = {};  // empty querry

    Product.create.mockImplementation(() => { throw new Error("Missing fields"); });

    await ProductCont.create(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: "Missing fields" }));
    expect(res.json).not.toHaveBeenCalled();
  });

  test("duplicate product name", async () => {
    // if already exists
    Product.create.mockImplementation(() => { throw new Error("duplicate key value if forbidden"); });

    await ProductCont.create(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining("duplicate") }));
    expect(res.json).not.toHaveBeenCalled();
  });
});


jest.mock("../Models/models", () => ({
  Product: {
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn(),
  },
  ProductInfo: {
    create: jest.fn(),
    destroy: jest.fn(),
  }
}));

describe("ProductCont other methods", () => {
  let req, res, next;

  beforeEach(() => {
    req = { query: {}, params: {}, body: {}, files: {} };
    res = { json: jest.fn() };
    next = jest.fn();

    jest.clearAllMocks();
  });

  // ===== getAll =====
  test("getAll returns all products without filters", async () => {
    Product.findAndCountAll.mockResolvedValue({ count: 1, rows: [{ id: 1 }] });

    await ProductCont.getAll(req, res);

    expect(Product.findAndCountAll).toHaveBeenCalledWith({ limit: 9, offset: 0 });
    expect(res.json).toHaveBeenCalledWith({ count: 1, rows: [{ id: 1 }] });
  });

  test("getAll filters by brandId and typeId", async () => {
    req.query = { brandId: "2", typeId: "3", page: "2", limit: "5" };
    Product.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

    await ProductCont.getAll(req, res);

    expect(Product.findAndCountAll).toHaveBeenCalledWith({
      where: { brandId: "2", typeId: "3" },
      limit: "5",
      offset: 5
    });
    expect(res.json).toHaveBeenCalledWith({ count: 0, rows: [] });
  });

  // ===== getOne =====
  test("getOne returns product by id", async () => {
    req.params.id = 5;
    Product.findOne.mockResolvedValue({ id: 5, name: "Test", info: [] });

    await ProductCont.getOne(req, res);

    expect(Product.findOne).toHaveBeenCalledWith({
      where: { id: 5 },
      include: [{ model: ProductInfo, as: "info" }]
    });
    expect(res.json).toHaveBeenCalledWith({ id: 5, name: "Test", info: [] });
  });

  // ===== update =====
  test("update modifies product data", async () => {
    req.params.id = 10;
    req.body = { name: "Updated", info: JSON.stringify([{ title: "t", description: "d" }]) };
    const save = jest.fn();
    const mv = jest.fn((p, cb) => cb && cb());

    Product.findByPk.mockResolvedValue({
      id: 10,
      name: "Old",
      save,
      info: [],
    });
    ProductInfo.create.mockResolvedValue({});
    ProductInfo.destroy.mockResolvedValue(1);

    await ProductCont.update(req, res, next);

    expect(ProductInfo.destroy).toHaveBeenCalledWith({ where: { productId: 10 } });
    expect(ProductInfo.create).toHaveBeenCalledWith({
      title: "t",
      description: "d",
      productId: 10
    });
    expect(save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: "Product with id 10 updated successfully" });
  });

  test("update fails if product not found", async () => {
    req.params.id = 99;
    Product.findByPk.mockResolvedValue(null);

    await ProductCont.update(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringContaining("not found")
    }));
  });

  // ===== delete =====
  test("delete removes existing product", async () => {
    req.params.id = 7;
    Product.destroy.mockResolvedValue(1);

    await ProductCont.delete(req, res, next);

    expect(Product.destroy).toHaveBeenCalledWith({ where: { id: 7 } });
    expect(res.json).toHaveBeenCalledWith({ message: "Product with id 7 has been deleted." });
  });

  test("delete handles non-existent id", async () => {
    req.params.id = 999;
    Product.destroy.mockResolvedValue(0);

    await ProductCont.delete(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringContaining("not found")
    }));
  });
});