const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const exjwt = require("express-jwt");
const UserTable = require("./tables/user_table");

const PORT = 8080;
const secret = "secret-key";

const app = express();
let message = "heelo wollord!";

const jwtMW = exjwt({
  secret
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, PUT, GET, OPTIONS, DELETE"
  );

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/message", (req, res) => {
  res.json({ message });
});

app.delete("/deletemessage", (req, res) => {
  message = "";
  res.json({ message: "HTTP DELETE" });
});

app.put("/updatemessage", (req, res) => {
  const { messageA } = req.body;
  message = messageA;
  res.json({ message: "HTTP PUT", message: messageA });
});

app.get("/", jwtMW, (req, res) => {
  res.json({ message: "You are authenticated" });
});

app.post("/userExist", (req, res) => {
  const { username } = req.body;
  UserTable.userExist(username, res);
});

app.get("/users", (req, res) => {});

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  user = {
    id: 3,
    username,
    password
  };
  UserTable.storeUser(username, password);
  users.push(user);
  res.json({
    sucess: true,
    err: null,
    username,
    password,
    message: "registration"
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  UserTable.logInUser(username, password, res, secret);
});

app.use(function(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).send(err);
  } else {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log("Listening on port: ", PORT);
});
