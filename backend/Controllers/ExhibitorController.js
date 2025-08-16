const Exhibitor = require("../Models/Exhibitor");
const Booth = require("../Models/Booth");

// Create Exhibitor
exports.createExhibitor = async (req, res) => {
    try {
        const exhibitor = new Exhibitor(req.body);
        await exhibitor.save();
        res.status(201).json({ message: "Exhibitor registered successfully", exhibitor });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get All Exhibitors
exports.getAllExhibitors = async (req, res) => {
    try {
        const exhibitors = await Exhibitor.find()
            .populate('expo_id', 'title date location')
            .populate('booth_selection', 'booth_number floor');
        res.status(200).json(exhibitors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Exhibitor
exports.getExhibitorById = async (req, res) => {
    try {
        const exhibitor = await Exhibitor.findById(req.params.id)
            .populate('expo_id', 'title date location')
            .populate('booth_selection', 'booth_number floor');
        if (!exhibitor) return res.status(404).json({ message: "Exhibitor not found" });
        res.status(200).json(exhibitor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Exhibitor
exports.updateExhibitor = async (req, res) => {
    try {
        const exhibitor = await Exhibitor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!exhibitor) return res.status(404).json({ message: "Exhibitor not found" });
        res.status(200).json({ message: "Exhibitor updated successfully", exhibitor });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete Exhibitor
exports.deleteExhibitor = async (req, res) => {
    try {
        const exhibitor = await Exhibitor.findByIdAndDelete(req.params.id);
        if (!exhibitor) return res.status(404).json({ message: "Exhibitor not found" });
        res.status(200).json({ message: "Exhibitor deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Approve Exhibitor and assign booth
exports.approveExhibitor = async (req, res) => {
    try {
        const exhibitorId = req.params.id
        const exhibitor = await Exhibitor.findById(exhibitorId)
        if (!exhibitor) return res.status(404).json({ message: "Exhibitor not found" })

        // Update exhibitor status
        exhibitor.status = "approved"
        await exhibitor.save()

        // Assign exhibitor to booth if booth_selection exists
        if (exhibitor.booth_selection) {
            await Booth.findByIdAndUpdate(
                exhibitor.booth_selection,
                { assigned_to: exhibitor._id }
            )
        }

        res.status(200).json({ message: "Exhibitor approved and booth assigned", exhibitor })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
