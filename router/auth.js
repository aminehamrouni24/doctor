const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require('dotenv').config()
// register route
// @des public route
// @path /register
router.post("/register", async (req, res) => {
  const { fullName, email, password, isPatient, isDoctor } = req.body;
  try {
    //  checking existing user
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        isPatient,
        isDoctor,
      });
      return res.status(200).json({
        status: true,
        msg: "User Created Successfully !!",
        data: user,
      });
    }
    else {
      return res.status(400).json({ status: true, msg: "User Already Exists" });
      
    }
    
    
  } catch (err) {
    return res.status(500).json({ status: false, msg: err });
  }
});

// login route
// @des public route
// @path /login

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    //   verifying the existing user
    const user = await User.findOne({ email: email });
    if (user) {
      // verifying the passwords
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = await jwt.sign(
          { id: user._id, email: user.email },
          process.env.SECRET
        );
        return res
          .status(200)
          .json({
            status: true,
            msg: "User Logged in successfully !!",
            token: token,
            data: user,
          });
      } else {
        return res
          .status(400)
          .json({ status: true, msg: "Passwords do not match !!" });
      }
    } else {
      return res.status(400).json({ status: true, msg: "User not found !!" });
    }
  } catch (err) {
    res.status(500).json({ status: false, msg: err });
  }
});

module.exports = router;
