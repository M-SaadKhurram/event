const express = require("express");
const router = express.Router();
const { createFeedback, getFeedbacks } = require("../Controllers/feedbackController");

router.post("/", createFeedback);   
router.get("/", getFeedbacks);      

module.exports = router;
