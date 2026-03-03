import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer as createViteServer } from 'vite';
import connectDB from './src/config/db.js';
import { User, Donation, Request, AuditLog } from './src/models/models.js';

dotenv.config();

async function startServer() {
  await connectDB();
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Helper to create audit log
  const createAuditLog = async (action: string, target: string, targetRole: string, adminId: string, status: 'Success' | 'Failed' | 'Rejected' = 'Success') => {
    try {
      await AuditLog.create({ action, target, targetRole, adminId, status });
    } catch (error) {
      console.error('Failed to create audit log:', error);
    }
  };

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
        pharmacistId,
        notes
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
      const { adminId } = req.body;
      const user = await User.findOneAndUpdate({ firebaseUID: req.params.uid }, {
        status: 'approved',
        verified: true
      }, { new: true });
      
      if (user && adminId) {
        await createAuditLog('User Approved', user.name || user.email || 'Unknown', user.role, adminId);
      }
      
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get('/api/admin/history', async (req, res) => {
    try {
      const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/admin/stats', async (req, res) => {
    try {
      const userCount = await User.countDocuments();
      const donationCount = await Donation.countDocuments();
      const requestCount = await Request.countDocuments();
      const pendingApprovals = await User.countDocuments({ status: 'pending' });
      
      res.json({
        userCount,
        donationCount,
        requestCount,
        pendingApprovals
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/admin/users', async (req, res) => {
    try {
      const users = await User.find().sort({ createdAt: -1 });
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // NGO Routes
  app.get('/api/donations/available', async (req, res) => {
    try {
      const donations = await Donation.find({ status: 'verified' }).sort({ createdAt: -1 });
      res.json(donations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/requests', async (req, res) => {
    try {
      const request = await Request.create(req.body);
      res.status(201).json(request);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get('/api/requests', async (req, res) => {
    try {
      const { userId } = req.query;
      const filter = userId ? { userId } : {};
      const requests = await Request.find(filter).populate('medicineId').sort({ createdAt: -1 });
      res.json(requests);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/requests/all', async (req, res) => {
    try {
      const requests = await Request.find().populate('medicineId').sort({ createdAt: -1 });
      const requestsWithUsers = await Promise.all(requests.map(async (r) => {
        const userData = await User.findOne({ firebaseUID: r.userId });
        return {
          ...r.toObject(),
          id: r._id,
          userId: userData || { name: 'Unknown', role: 'unknown' }
        };
      }));
      res.json(requestsWithUsers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch('/api/requests/:id/approve', async (req, res) => {
    try {
      const { decision, pharmacistId } = req.body;
      const request = await Request.findByIdAndUpdate(req.params.id, {
        status: decision === 'approved' ? 'approved' : 'rejected',
        pharmacistId
      }, { new: true });
      res.json(request);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get('/api/pharmacist/history', async (req, res) => {
    try {
      const { pharmacistId } = req.query;
      if (!pharmacistId) return res.status(400).json({ message: 'pharmacistId is required' });

      const [donations, requests] = await Promise.all([
        Donation.find({ pharmacistId }).sort({ updatedAt: -1 }),
        Request.find({ pharmacistId }).populate('medicineId').sort({ updatedAt: -1 })
      ]);

      const history = [
        ...donations.map(d => ({
          id: d._id,
          type: 'donation',
          medicine: d.medicineName,
          user: d.donorName,
          date: d.updatedAt,
          status: d.status === 'verified' ? 'Approved' : 'Rejected',
          notes: d.notes
        })),
        ...requests.map(r => ({
          id: r._id,
          type: 'request',
          medicine: (r.medicineId as any)?.medicineName || (r as any).customMedicineName,
          user: r.userId, // Will need to populate user name if needed, but for now just ID
          date: r.updatedAt,
          status: r.status === 'approved' ? 'Approved' : 'Rejected',
          notes: 'Request verification'
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      res.json(history);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
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
