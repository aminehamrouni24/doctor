const express = require("express");
const router = express.Router();
const auth = require("../utils/index");

const User = require("../models/User");
const Patient = require("../models/Patient");
const multer = require("../utils/multer");

// @public /users
// @des get all users
// @path /all

router.get("/all", auth, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ status: true, msg: "All Users !!", data: users });
  } catch (err) {
    res.status(500).json({ status: false, msg: err });
  }
});

// @public /users/doctors
// @des get all users doctors
// @path /doctors

router.get("/doctors", async (req, res) => {
  try {
    const users = await User.findOne({ isDoctor: true });
    res.status(200).json({ status: true, msg: "All Doctors !!", data: users });
  } catch (err) {
    res.status(500).json({ status: false, msg: err });
  }
});

// @public /users/patients
// @des get all users patients
// @path /patients

router.get("/patients", auth, async (req, res) => {
  try {
    const users = await User.findOne({ isPatient: true });
    res.status(200).json({ status: true, msg: "All Patients !!", data: users });
  } catch (err) {
    res.status(500).json({ status: false, msg: err });
  }
});

// @private route
// @des fill the patient profile
// @path /profile

router.post("/profile", auth,multer, async (req, res) => {
  const {
    weight,
    height,
    bloodType,
    allergies,
    diseases,
    analytics,
    otherInfos,
  } = req.body;

  try {
    const user = await User.findOne({ isPatient: true });
    if (!user) {
      return res.status(400).json({ status: true, msg: "Not allowed!!" });
    } else {
      let patient = await Patient.findOne({
        user: req.user._id,
      }).populate(req.user._id);
      if (!patient) {
        let patient = await Patient.create({
          weight,
          height,
          bloodType,
          allergies,
          diseases,
          analytics,
          otherInfos,
          image: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        });
        return res.status(200).json({
          status: true,
          msg: "Profile completed successfully!!",
          data: patient,
        });
      } else {
        return res.status(400).json({ status: true, msg: "Profile exists" });
      }
    }
  } catch (err) {
    res.status(500).json({ status: false, msg: err });
  }
});
// ****************************************************************************

// @private route
// @des update the patient profile
// @path /profile/:id

router.put("/profile/:id", auth, async (req, res) => {
  const {
    weight,
    height,
    bloodType,
    allergies,
    diseases,
    analytics,
    otherInfos,
  } = req.body;

  try {
    let { id } = req.params;
    let patient = await Patient.findOne({
      user: req.user._id,
    });
    if (patient) {
      let patient = await Patient.findOneAndUpdate(
        { id },
        { ...req.body },
        { new: true }
      );
      return res.status(200).json({
        status: true,
        msg: "Profile updated successfully!!",
        data: patient,
      });
    } else {
      return res.status(400).json({ status: true, msg: "Not allowed!!" });
    }
  } catch (err) {
    res.status(500).json({ status: false, msg: err });
  }
});

module.exports = router;
