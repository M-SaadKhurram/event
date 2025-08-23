const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  eventType: { type: String, required: true },
  satisfaction: { type: Number, required: true }, // 1–5 stars
  easeOfUse: { type: Number, required: true },
  customerService: { type: Number, required: true },
  features: { type: Number, required: true },
  recommendation: { type: String, required: true },
  improvement: { type: String },
  successStory: { type: String },
  allowPublicUse: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Feedback", feedbackSchema);
