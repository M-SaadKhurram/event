// Middlewares/EnsureAdmin.js
module.exports = function ensureAdmin(req, res, next) {
  try {
    if (req.user && req.user.role === 'Admin') {
      return next();
    } else {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error in admin check", error });
  }
};
