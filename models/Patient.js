const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    image:{type : String},
    weight: { type: Number },
    height: { type: Number },
    bloodType: { type: String },
    allergies: { type: [String] },
    diseases: { type: [String] },
    analytics : {type : String},
    otherInfos : {type : String}
  },
  { timestamps: true }
);

const Patient = mongoose.model("patient", patientSchema);
module.exports = Patient;
