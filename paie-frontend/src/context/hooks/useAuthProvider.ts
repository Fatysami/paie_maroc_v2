
import { useState, useEffect } from 'react';
import { User as AppUser } from '@/types/user';
import { currentUser } from '@/data/users';

// Type for a simplified Supabase User
export type SupabaseUser = {
  id: string;
  email: string;
  user_metadata?: {
    role?: string;
    first_name?: string;
    last_name?: string;
    company_id?: string;
  };
  created_at?: string;
};

// Type for a simplified Session
export type Session = {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  expires_in?: number;
  token_type?: string;
  user: SupabaseUser;
};

export const useAuthProvider = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [initComplete, setInitComplete] = useState<boolean>(false);

  // Définir le statut d'administrateur en fonction du rôle de l'utilisateur
  useEffect(() => {
    if (appUser) {
      // Vérifier directement si l'utilisateur a le rôle d'administrateur
      const adminStatus = appUser.role === 'admin';
      setIsAdmin(adminStatus);
    } else if (user?.user_metadata?.role === 'admin') {
      // Fallback: vérifier les métadonnées d'utilisateur directement
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [appUser, user]);

  // Clear auth state function
  const clearAuthState = () => {
    setSession(null);
    setUser(null);
    setAppUser(null);
    setIsAdmin(false);
  };

  // Check for existing session on mount
  useEffect(() => {
    setLoading(true);
    
    const checkExistingSession = () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          const mockUser: AppUser = {
            ...currentUser,
            ...parsedUser
          };
          
          const mockSession = {
            access_token: token,
            refresh_token: 'fake-refresh-token',
            expires_at: new Date().getTime() + 3600000,
            expires_in: 3600,
            token_type: 'bearer',
            user: {
              id: mockUser.id,
              email: mockUser.email,
              user_metadata: {
                role: mockUser.role,
                first_name: mockUser.firstName,
                last_name: mockUser.lastName,
                company_id: mockUser.companyId
              },
              created_at: mockUser.createdAt
            }
          };
          
          setSession(mockSession);
          setUser(mockSession.user);
          setAppUser(mockUser);
          setIsAdmin(mockUser.role === 'admin');
          console.log("Session existante trouvée et restaurée");
        } else {
          console.log("Aucune session existante trouvée");
          clearAuthState();
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de la session existante:", error);
        clearAuthState();
      } finally {
        setLoading(false);
        setInitComplete(true);
      }
    };
    
    checkExistingSession();
  }, []);

  return {
    session,
    user,
    appUser,
    loading,
    isAdmin,
    initComplete,
    clearAuthState
  };
};
