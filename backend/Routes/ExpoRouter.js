const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../Middlewares/Auth");
const upload = require("../Middlewares/upload");

const {
  createExpo,
  getAllExpos,
  getExpoById,
  updateExpo,
  deleteExpo,
  getAvailableFloors, // Add this
} = require("../Controllers/ExpoController");

// Routes
router.post("/", ensureAuthenticated, upload.single("attachment"), createExpo); 
router.get("/",ensureAuthenticated, getAllExpos);
router.get("/available-floors", ensureAuthenticated, getAvailableFloors); // Add this route
router.get("/:id", getExpoById);
router.put("/:id", ensureAuthenticated, upload.single("attachment"), updateExpo);
router.delete("/:id", ensureAuthenticated, deleteExpo);

module.exports = router;
