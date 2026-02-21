import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer as createViteServer } from 'vite';
import connectDB from './src/config/db.js';
import { User, Donation, Request } from './src/models/models.js';

dotenv.config();

async function startServer() {
  await connectDB();
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
  });

  // API Routes
  app.post('/api/users', async (req, res) => {
    try {
      const { firebaseUID, ...userData } = req.body;
      let user = await User.findOne({ firebaseUID });
      if (user) {
        user = await User.findOneAndUpdate({ firebaseUID }, userData, { new: true });
      } else {
        user = await User.create({ firebaseUID, ...userData });
      }
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get('/api/users/:firebaseUID', async (req, res) => {
    try {
      const user = await User.findOne({ firebaseUID: req.params.firebaseUID });
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/donations', async (req, res) => {
    try {
      const donation = await Donation.create(req.body);
      res.status(201).json(donation);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get('/api/donations', async (req, res) => {
    try {
      const { donorId } = req.query;
      const filter = donorId ? { donorId } : {};
      const donations = await Donation.find(filter).sort({ createdAt: -1 });
      res.json(donations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/donations/queue', async (req, res) => {
    try {
      const donations = await Donation.find({ status: 'pending_verification' }).sort({ createdAt: 1 });
      res.json(donations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch('/api/donations/:id/verify', async (req, res) => {
    try {
      const { decision, notes, pharmacistId } = req.body;
      const donation = await Donation.findByIdAndUpdate(req.params.id, {
        status: decision === 'approved' ? 'verified' : 'rejected',
      }, { new: true });
      res.json(donation);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get('/api/admin/pending/:role', async (req, res) => {
    try {
      const users = await User.find({ role: req.params.role, status: 'pending' });
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch('/api/admin/approve/:uid', async (req, res) => {
    try {
      const user = await User.findOneAndUpdate({ firebaseUID: req.params.uid }, {
        status: 'approved',
        verified: true
      }, { new: true });
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
