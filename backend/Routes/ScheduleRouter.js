const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../Middlewares/Auth");
const {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule,
    getSchedulesByExpo // Add this import
} = require("../Controllers/ScheduleController");

// Routes
router.post("/", ensureAuthenticated, createSchedule);
router.get("/", ensureAuthenticated, getAllSchedules);
router.get("/expo/:expoId", ensureAuthenticated, getSchedulesByExpo); // Add this route
router.get("/:id", ensureAuthenticated, getScheduleById);
router.put("/:id", ensureAuthenticated, updateSchedule);
router.delete("/:id", ensureAuthenticated, deleteSchedule);

module.exports = router;
