import { UserRole } from '@/types';

const API_URL = '/api';

export const dbService = {
  async createUserProfile(firebaseUID: string, data: any) {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firebaseUID, ...data }),
    });
    if (!response.ok) throw new Error('Failed to create user profile');
    return response.json();
  },

  async getUserProfile(firebaseUID: string) {
    const response = await fetch(`${API_URL}/users/${firebaseUID}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Failed to fetch user profile');
    return response.json();
  },

  async createDonation(donorId: string, data: any) {
    const response = await fetch(`${API_URL}/donations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ donorId, ...data }),
    });
    if (!response.ok) throw new Error('Failed to create donation');
    return response.json();
  },

  async getDonationsByDonor(donorId: string) {
    const response = await fetch(`${API_URL}/donations?donorId=${donorId}`);
    if (!response.ok) throw new Error('Failed to fetch donations');
    const data = await response.json();
    return data.map((d: any) => ({ ...d, id: d._id }));
  },

  async getVerificationQueue() {
    const response = await fetch(`${API_URL}/donations/queue`);
    if (!response.ok) throw new Error('Failed to fetch verification queue');
    const data = await response.json();
    return data.map((d: any) => ({ ...d, id: d._id }));
  },

  async verifyDonation(donationId: string, pharmacistId: string, decision: 'approved' | 'rejected', notes: string) {
    const response = await fetch(`${API_URL}/donations/${donationId}/verify`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision, notes, pharmacistId }),
    });
    if (!response.ok) throw new Error('Failed to verify donation');
    const data = await response.json();
    return { ...data, id: data._id };
  },

  async getPendingApprovals(role: UserRole) {
    const response = await fetch(`${API_URL}/admin/pending/${role}`);
    if (!response.ok) throw new Error('Failed to fetch pending approvals');
    const data = await response.json();
    return data.map((u: any) => ({ ...u, id: u.firebaseUID })); // Use firebaseUID as id for admin dashboard
  },

  async approveUser(uid: string) {
    const response = await fetch(`${API_URL}/admin/approve/${uid}`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Failed to approve user');
    return response.json();
  },

  async getAvailableMedicines() {
    const response = await fetch(`${API_URL}/donations/available`);
    if (!response.ok) throw new Error('Failed to fetch available medicines');
    const data = await response.json();
    return data.map((d: any) => ({ ...d, id: d._id }));
  },

  async requestMedicine(userId: string, medicineId: string) {
    const response = await fetch(`${API_URL}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, medicineId }),
    });
    if (!response.ok) throw new Error('Failed to request medicine');
    return response.json();
  },

  async getUserRequests(userId: string) {
    const response = await fetch(`${API_URL}/requests?userId=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user requests');
    const data = await response.json();
    return data.map((r: any) => ({ ...r, id: r._id }));
  }
};
