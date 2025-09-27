// userCont.test.js

const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const { User, ShopCart } = require("../Models/models");
const UserCont = require("../Controllers/userCont");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

jest.mock("../utils/token", () => ({
  generateAccessToken: jest.fn(() => "mock-token")
}));

const { generateAccessToken } = require("../utils/token");


jest.mock("../Models/models", () => ({
  User: {
    
    findOne: jest.fn(),
    create: jest.fn()
  },
  ShopCart: {
    create: jest.fn()
  }
}));

jest.mock("bcrypt", () => ({
  hashSync: jest.fn(() => "hashedPassword"),
   compareSync: jest.fn()
}));

jest.mock("express-validator", () => {
  return {
    validationResult: jest.fn(() => ({
      isEmpty: () => true,
      array: () => []
    }))
  };
});

// create express app for testing
const app = express();
app.use(bodyParser.json());
const controller = new UserCont();
app.post("/register", controller.registration.bind(controller));
app.post("/login", controller.login.bind(controller));


describe("User Registration", () => {
  beforeEach(() => {
    User.findOne.mockReset();
    User.create.mockReset();
    ShopCart.create.mockReset();
    validationResult.mockReset();
  });

  test("should register user successfully", async () => {
    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => []
    });

    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ id: 1 });
    ShopCart.create.mockResolvedValue({});

    const response = await request(app)
      .post("/register")
      .send({
        email: "test@example.com",
        password: "123456"
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("User registered successfully");
    expect(User.findOne).toHaveBeenCalledWith({ where: { email: "test@example.com" } });
    expect(User.create).toHaveBeenCalled();
    expect(ShopCart.create).toHaveBeenCalledWith({ userId: 1 });
  });

//validation test
  test("should fail registration due to validation errors", async () => {
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: "Invalid email" }]
    });

    const response = await request(app)
      .post("/register")
      .send({ email: "bademail", password: "123" });

//invalid email format
    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toEqual([{ msg: "Invalid email" }]);
  });
});

// duplication test
test("should fail registration if email already exists", async () => {
  validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
  User.findOne.mockResolvedValue({ id: 1, email: "test@example.com" }); // уже есть такой email

  const response = await request(app)
    .post("/register")
    .send({ email: "test@example.com", password: "123456" });

  expect(response.statusCode).toBe(400);
  expect(response.body.message).toBe("Email already exists");
});


// missing fields test
test("should fail registration if required fields are missing", async () => {
  validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });

  //  email is empty
  let response = await request(app)
    .post("/register")
    .send({ password: "123456" });
  expect(response.statusCode).toBe(400);
  expect(response.body.message).toBe("Invalid email or password");

  // password is empty
  response = await request(app)
    .post("/register")
    .send({ email: "test@example.com" });
  expect(response.statusCode).toBe(400);
  expect(response.body.message).toBe("Invalid email or password");

  // both are empty
  response = await request(app)
    .post("/register")
    .send({});
  expect(response.statusCode).toBe(400);
  expect(response.body.message).toBe("Invalid email or password");
});


// -------------------- LOGIN tests --------------------

describe("User Login", () => {
  beforeEach(() => {
    User.findOne.mockReset();
    bcrypt.compareSync.mockReset(); 
    generateAccessToken.mockClear();
  });

  test("should login successfully with valid credentials", async () => {
    User.findOne.mockResolvedValue({
      id: 1,
      email: "test@example.com",
      password: "hashedpass",
      role: "USER"
    });
    require("bcrypt").compareSync.mockReturnValue(true);

    const res = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "123456" });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBe("mock-token");
    expect(generateAccessToken).toHaveBeenCalledWith(1, ["USER"]);
  });

  test("should fail when user is not found", async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post("/login")
      .send({ email: "notfound@example.com", password: "123456" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User notfound@example.com not found");
  });

  test("should fail when password is incorrect", async () => {
    User.findOne.mockResolvedValue({
      id: 1,
      email: "test@example.com",
      password: "hashedpass",
      role: "USER"
    });
    require("bcrypt").compareSync.mockReturnValue(false);

    const res = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "wrongpass" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });

  test("should handle server error gracefully", async () => {
     User.findOne.mockRejectedValue(new Error("DB error"));

    const res = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "123456" });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Login error");
  });
});


