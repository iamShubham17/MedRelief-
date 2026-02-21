import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp, 
  addDoc,
  query,
  where,
  getDocs,
  orderBy
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { UserRole } from '@/context/AuthContext';

export const dbService = {
  async createUserProfile(uid: string, data: any) {
    console.log('dbService: Creating user profile...', { uid, role: data.role });
    try {
      await setDoc(doc(db, 'users', uid), {
        ...data,
        uid,
        createdAt: serverTimestamp(),
      });
      console.log('dbService: User profile created successfully');
    } catch (error) {
      console.error('dbService: Error creating user profile:', error);
      throw error;
    }
  },

  async getUserProfile(uid: string) {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? snap.data() : null;
  },

  async createDonation(donorId: string, data: any) {
    return await addDoc(collection(db, 'donations'), {
      ...data,
      donorId,
      status: 'pending_verification',
      createdAt: serverTimestamp(),
    });
  },

  async getDonationsByDonor(donorId: string) {
    const q = query(collection(db, 'donations'), where('donorId', '==', donorId), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getVerificationQueue() {
    const q = query(collection(db, 'donations'), where('status', '==', 'pending_verification'), orderBy('createdAt', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async verifyDonation(donationId: string, pharmacistId: string, decision: 'approved' | 'rejected', notes: string) {
    const donationRef = doc(db, 'donations', donationId);
    await updateDoc(donationRef, {
      status: decision === 'approved' ? 'verified' : 'rejected',
      verifiedAt: serverTimestamp(),
      verifiedBy: pharmacistId,
    });

    await addDoc(collection(db, 'verifications'), {
      donationId,
      pharmacistId,
      decision,
      notes,
      createdAt: serverTimestamp(),
    });
  },

  async getPendingApprovals(role: UserRole) {
    const q = query(collection(db, 'users'), where('role', '==', role), where('status', '==', 'pending'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async approveUser(uid: string) {
    await updateDoc(doc(db, 'users', uid), {
      status: 'approved',
      verified: true,
    });
  }
};
