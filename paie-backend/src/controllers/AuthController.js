import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import { generateToken } from '../lib/jwt.js';

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user || !user.is_active)
      return res.status(401).json({ success: false, message: 'Identifiants invalides' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ success: false, message: 'Mot de passe incorrect' });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      companyId: user.company_id
    });

    res.json({ success: true, token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: {
        email,
        password_hash: passwordHash,
        role: 'admin',
        first_name: firstName,
        last_name: lastName
      }
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      companyId: user.company_id
    });

    res.status(201).json({ success: true, token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

export const me = (req, res) => {
  res.json({ success: true, user: req.user });
};

export const logout = (_req, res) => {
  // côté client : il suffit d’oublier le token
  res.json({ success: true, message: 'Déconnecté' });
};

export const refresh = (req, res) => {
  try {
    const token = generateToken(req.user, '1h');
    res.json({ success: true, token });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token invalide' });
  }
};
