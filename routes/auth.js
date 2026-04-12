const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const JWT_SECRET = "RaufIsAGoodBoy$True";
var jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser");

router.post(
  "/createUser",
  [
    body("name", "Name must be at least 3 characters long").isLength({
      min: 3,
    }),
    body("email", "Please provide a valid email").isEmail(),
    body("password", "Password must be at least 5 characters long").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    console.log(req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send(errors.array());
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry user already exist with that email" });
      }

      const salt = await bcrypt.genSalt(10);
      console.log("Salt is : ", salt);
      let secPassword = await bcrypt.hash(req.body.password, salt);
      console.log("Sec password is : ", secPassword);

      user = User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      console.log("Next printing data : ", data);

      const jwtData = jwt.sign(data, JWT_SECRET);
      console.log("JWT Data is : ", jwtData);

      res.json({ jwtData });
      // res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("internal server error");
    }

    console.log("User Saved Successfully");
  },
);

router.post(
  "/login",
  [
    body("email", "Please provide a valid email").isEmail(),
    body("password", "Password must be at least 5 characters long").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send(errors.array());
    }

    const { email, password } = req.body;
    try {
      // ✅ Find user by email
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      // ✅ Compare entered password with hashed password in DB
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      // ✅ Create JWT token
      const data = {
        user: {
          id: user.id,
        },
      };

      const jwtData = jwt.sign(data, JWT_SECRET);
      res.json({ message: "Login successful", jwtData });
      console.log("Login successful, JWT token generated");
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  },
);

//Get logged in user details using Post request : /api/auth/getUser login required with the help of middleware and jwt token

router.post("/getUser",fetchUser, async (req, res) => {
    try {
      userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  },
);

module.exports = router;
