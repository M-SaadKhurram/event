const express = require("express");
const router = express.Router();
const BoothController = require("../Controllers/BoothController");
const ensureAuthenticated = require("../Middlewares/Auth");


router.post("/", ensureAuthenticated, BoothController.createBooth);

// Get All Booths
router.get("/", ensureAuthenticated, BoothController.getBooths);

// Get Booth by ID
router.get("/:id", ensureAuthenticated, BoothController.getBoothById);

// Update Booth (Only Admin)
router.put("/:id", ensureAuthenticated, BoothController.updateBooth);

// Delete Booth (Only Admin)
router.delete("/:id", ensureAuthenticated, BoothController.deleteBooth);

module.exports = router;
