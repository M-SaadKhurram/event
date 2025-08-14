const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../Middlewares/Auth");
const {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule
} = require("../Controllers/ScheduleController");

// Routes
router.post("/", ensureAuthenticated, createSchedule);
router.get("/", ensureAuthenticated, getAllSchedules);
router.get("/:id", ensureAuthenticated, getScheduleById);
router.put("/:id", ensureAuthenticated, updateSchedule);
router.delete("/:id", ensureAuthenticated, deleteSchedule);

module.exports = router;
