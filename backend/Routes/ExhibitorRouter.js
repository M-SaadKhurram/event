const express = require('express');
const router = express.Router();
const ensureAuthenticated = require("../Middlewares/Auth");

const { 
    createExhibitor,
    getAllExhibitors,
    getExhibitorById,
    updateExhibitor,
    deleteExhibitor,
    approveExhibitor
} = require("../Controllers/ExhibitorController");

// Routes
router.post("/", ensureAuthenticated, createExhibitor);
router.get("/", ensureAuthenticated, getAllExhibitors);
router.get("/:id", ensureAuthenticated, getExhibitorById);
router.put("/:id", ensureAuthenticated, updateExhibitor);
router.delete("/:id", ensureAuthenticated, deleteExhibitor);

// Approve exhibitor and assign booth
router.put("/:id/approve", ensureAuthenticated, approveExhibitor)

module.exports = router;
