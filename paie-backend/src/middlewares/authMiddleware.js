import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Token requis' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ success: false, message: 'Token invalide ou expiré' });
  }
};

export default authMiddleware;
