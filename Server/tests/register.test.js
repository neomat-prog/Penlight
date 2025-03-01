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
}));
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

const User = require("../models/user"); 

describe("POST /users/register", () => {
  let app;

  beforeEach(() => {
    
    app = express();
    app.use(express.json());
    app.use("/users", userRouter);

    
    jest.clearAllMocks();

    
    process.env.JWT_SECRET = "testsecret";
  });

  
  it("should register a new user successfully", async () => {
    const mockUserData = {
      username: "newuser",
      name: "New User",
      password: "securepass123",
    };
    const mockSavedUser = {
      _id: "mockid123",
      username: "newuser",
      name: "New User",
      passwordHash: "hashedpass",
    };

    User.findOne.mockResolvedValue(null); 
    bcrypt.hash.mockResolvedValue("hashedpass");
    
    User.mockImplementation(() => ({
      ...mockSavedUser,
      save: jest.fn().mockResolvedValue(mockSavedUser),
    }));
    jwt.sign.mockReturnValue("mockjwt");

    const response = await request(app)
      .post("/users/register")
      .send(mockUserData)
      .expect(201);

    expect(response.body).toEqual({
      message: "User registered successfully",
      data: {
        id: "mockid123",
        username: "newuser",
        name: "New User",
      },
      token: "mockjwt",
    });
    expect(User.findOne).toHaveBeenCalledWith({ username: "newuser" });
    expect(bcrypt.hash).toHaveBeenCalledWith("securepass123", 10);
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: "mockid123" },
      "testsecret",
      { expiresIn: "1h" }
    );
  });

  
  it("should return 400 if any required field is missing", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({ username: "newuser" }) 
      .expect(400);

    expect(response.body).toEqual({ message: "All fields are required." });
    expect(User.findOne).not.toHaveBeenCalled();
  });

  
  it("should return 400 if password is less than 6 characters", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({ username: "newuser", name: "New User", password: "short" })
      .expect(400);

    expect(response.body).toEqual({
      message: "Password must be at least 6 characters long.",
    });
    expect(User.findOne).not.toHaveBeenCalled();
  });

  
  it("should return 400 if username already exists", async () => {
    User.findOne.mockResolvedValue({ username: "newuser" }); 

    const response = await request(app)
      .post("/users/register")
      .send({ username: "newuser", name: "New User", password: "securepass123" })
      .expect(400);

    expect(response.body).toEqual({ message: "Username already exists." });
    expect(User.findOne).toHaveBeenCalledWith({ username: "newuser" });
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });

  
  it("should return 500 if there is a server error", async () => {
    User.findOne.mockRejectedValue(new Error("DB failure"));

    const response = await request(app)
      .post("/users/register")
      .send({ username: "newuser", name: "New User", password: "securepass123" })
      .expect(500);

    expect(response.body).toEqual({ message: "Failed to register user." });
  });
});