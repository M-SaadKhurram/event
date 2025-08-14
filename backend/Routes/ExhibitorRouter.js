const express = require('express');
const router = express.Router();
const ensureAuthenticated = require("../Middlewares/Auth");

const {
    createExhibitor,
    getAllExhibitors,
    getExhibitorById,
    updateExhibitor,
    deleteExhibitor
} = require("../Controllers/ExhibitorController");

// Routes
router.post("/", ensureAuthenticated, createExhibitor);
router.get("/", ensureAuthenticated, getAllExhibitors);
router.get("/:id", ensureAuthenticated, getExhibitorById);
router.put("/:id", ensureAuthenticated, updateExhibitor);
router.delete("/:id", ensureAuthenticated, deleteExhibitor);

module.exports = router;
