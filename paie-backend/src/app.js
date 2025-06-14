import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

// 🔧 Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// 📦 Routes API
app.use('/api/auth', authRoutes);

// 🔁 Healthcheck
app.get('/', (req, res) => {
  res.send('✅ API en ligne');
});

// 🚀 Serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
