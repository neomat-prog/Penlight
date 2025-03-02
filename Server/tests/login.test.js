const request = require("supertest");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = require("../routes/user");

jest.mock("../models/user", () => {
  const UserMock = jest.fn(function () {
    this.save = jest.fn();
    return this;
  });
  UserMock.findOne = jest.fn();
  return UserMock;
});

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

const User = require("../models/user");

describe("POST /users/login", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/users", userRouter);

    jest.clearAllMocks();
    process.env.JWT_SECRET = "testsecret";
  });

  it("should login the user successfully", async () => {
    const mockUserData = { username: "newuser", password: "securepass123" };
    const mockSavedUser = {
      _id: "mockid123",
      username: "newuser",
      name: "New User", 
      passwordHash: "hashedpass",
    };

    User.findOne.mockResolvedValue(mockSavedUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("mocktoken123");

    const response = await request(app)
      .post("/users/login")
      .send(mockUserData)
      .expect(200);

    expect(response.body).toEqual({
      message: "Login successful",
      token: "mocktoken123",
      user: {
        id: "mockid123",
        username: "newuser",
        name: "New User", 
      },
    });
  });

  it("should fail login with invalid username", async () => {
    User.findOne.mockResolvedValue(null); 

    const response = await request(app)
      .post("/users/login")
      .send({ username: "wronguser", password: "securepass123" })
      .expect(401);

    expect(response.body).toEqual({ message: "Invalid username or password." });
  });

  it("should fail login with incorrect password", async () => {
    const mockSavedUser = {
      _id: "mockid123",
      username: "newuser",
      passwordHash: "hashedpass",
    };

    User.findOne.mockResolvedValue(mockSavedUser);
    bcrypt.compare.mockResolvedValue(false); 

    const response = await request(app)
      .post("/users/login")
      .send({ username: "newuser", password: "wrongpass" })
      .expect(401);

    expect(response.body).toEqual({ message: "Invalid username or password." }); 
  });

  it("should fail login with missing credentials", async () => {
    const response = await request(app)
      .post("/users/login")
      .send({}) 
      .expect(400);

    expect(response.body).toEqual({ message: "Username and password are required." });
  });
});