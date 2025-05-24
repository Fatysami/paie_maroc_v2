
import React, { createContext, ReactNode } from 'react';
import { AuthContextType } from './types/authTypes';
import { useAuthProvider } from './hooks/useAuthProvider';
import { authOperations } from './utils/authUtils';

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { session, user, appUser, loading, isAdmin, initComplete, clearAuthState } = useAuthProvider();
  
  const { signIn, signUp } = authOperations;
  
  const signOut = async () => {
    await authOperations.signOut(clearAuthState);
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      appUser, 
      loading, 
      signIn, 
      signOut, 
      signUp,
      isAdmin,
      initComplete
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Export the useAuth hook from the hooks file
export { useAuth } from './hooks/useAuth';
