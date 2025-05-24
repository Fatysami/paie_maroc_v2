
import { User as AppUser } from '@/types/user';
import { Session, SupabaseUser } from '../hooks/useAuthProvider';

export interface AuthResult {
  data: any;
  error: any;
}

export interface AuthContextType {
  session: Session | null;
  user: SupabaseUser | null;
  appUser: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  initComplete: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, userData?: any) => Promise<AuthResult>;
}
