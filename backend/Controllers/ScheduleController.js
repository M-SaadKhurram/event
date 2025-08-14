const Schedule = require("../Models/Schedule");

// Create Schedule
exports.createSchedule = async (req, res) => {
    try {
        const schedule = new Schedule(req.body);
        await schedule.save();
        res.status(201).json({ message: "Schedule created successfully", schedule });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get All Schedules
exports.getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find().populate("expo_id", "title date location");
        res.status(200).json(schedules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Schedule
exports.getScheduleById = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id).populate("expo_id", "title date location");
        if (!schedule) return res.status(404).json({ message: "Schedule not found" });
        res.status(200).json(schedule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Schedule
exports.updateSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!schedule) return res.status(404).json({ message: "Schedule not found" });
        res.status(200).json({ message: "Schedule updated successfully", schedule });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete Schedule
exports.deleteSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findByIdAndDelete(req.params.id);
        if (!schedule) return res.status(404).json({ message: "Schedule not found" });
        res.status(200).json({ message: "Schedule deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
