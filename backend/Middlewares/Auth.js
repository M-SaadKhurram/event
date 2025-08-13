const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(403).json({ message: 'Unauthorized. JWT Token is required' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Unauthorized. Token not found' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains _id, email, role
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Unauthorized. JWT Token is expired or invalid' });
  }
};

module.exports = ensureAuthenticated;
