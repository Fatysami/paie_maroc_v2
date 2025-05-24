
import { authService } from '@/services/authService';
import { User as AppUser } from '@/types/user';
import { userService } from '@/utils/clientServices';

// Fetches user data for the authenticated user
export const fetchUserData = async (userId: string): Promise<AppUser | null> => {
  try {
    const userData = await userService.getUserById(userId);
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

// Authentication operations
export const authOperations = {
  // Sign in operation
  signIn: async (email: string, password: string) => {
    try {
      const result = await authService.login(email, password);
      return { data: result, error: result.success ? null : { message: result.error } };
    } catch (error: any) {
      return { data: null, error: { message: error.message || 'An error occurred during sign in' } };
    }
  },

  // Sign out operation
  signOut: async (clearAuthState?: () => void) => {
    try {
      await authService.logout();
      
      // Clear the auth state if function is provided
      if (clearAuthState) {
        clearAuthState();
      }
      
      console.log("Déconnexion terminée avec succès");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  },

  // Sign up operation
  signUp: async (email: string, password: string, userData?: any) => {
    try {
      const result = await authService.signup(email, password, userData);
      return { data: result, error: result.success ? null : { message: result.error } };
    } catch (error: any) {
      return { data: null, error: { message: error.message || 'An error occurred during sign up' } };
    }
  }
};
