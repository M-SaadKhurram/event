// Usage: requireRole("Admin/Organizer"), requireRole("Exhibitor"), requireRole("Attendee")
// Or multiple: requireRole("Admin/Organizer", "Exhibitor")
const requireRole = (...allowed) => {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(403).json({ message: 'Forbidden: No role in token' });
    }
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }
    next();
  };
};

module.exports = requireRole;
