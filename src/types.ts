export type UserRole = 'donor' | 'pharmacist' | 'ngo' | 'patient' | 'admin' | 'rider';

export interface UserProfile {
  uid: string;
  role: UserRole;
  name?: string;
  phone?: string;
  verified: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  city?: string;
  mediPoints?: number;
}
