const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["jobseeker", "employer", "admin"],
      default: "jobseeker",
    },
    profileImage: { type: String, default: "" },
    resume: { type: String, default: "" },
    headline: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    about: { type: String, default: "" },
    skills: [{ type: String }],
    experience: [
      {
        company: String,
        role: String,
        startDate: String,
        endDate: String,
        description: String,
        current: Boolean,
      },
    ],
    education: [
      {
        school: String,
        degree: String,
        field: String,
        startYear: String,
        endYear: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);