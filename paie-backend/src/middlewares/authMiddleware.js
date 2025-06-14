import { verifyToken } from '../lib/jwt.js';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ success: false, message: 'Token manquant' });

  const token = authHeader.split(' ')[1];

  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token invalide' });
  }
};
