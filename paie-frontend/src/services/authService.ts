
// Mock AuthService that doesn't use Supabase
import { toast } from "sonner";
import { currentUser } from "@/data/users";

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    role: string;
  } | null;
  token?: string;
  error?: string;
  needsEmailVerification?: boolean;
}

export class AuthService {
  /**
   * Tente de connecter un utilisateur via les méthodes disponibles
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    // Simulate login - in real app this would use real auth
    console.log(`Tentative de connexion pour: ${email}`);
    
    // For this mock service, we'll consider admin@example.com as a valid login
    if (email === "admin@example.com" && password === "password") {
      // Store auth token in localStorage
      localStorage.setItem('auth_token', 'fake-auth-token');
      localStorage.setItem('user_data', JSON.stringify({
        id: currentUser.id,
        email: currentUser.email,
        role: currentUser.role
      }));
      
      toast.success("Connexion réussie !");
      
      return {
        success: true,
        user: {
          id: currentUser.id,
          email: currentUser.email,
          role: currentUser.role
        },
        token: "fake-auth-token"
      };
    }
    
    toast.error("Email ou mot de passe incorrect");
    return {
      success: false,
      error: "Email ou mot de passe incorrect. Vérifiez vos informations et réessayez."
    };
  }
  
  /**
   * Déconnecte l'utilisateur actuel
   */
  async logout(): Promise<boolean> {
    try {
      // Clear all auth data from localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      
      console.log("Utilisateur déconnecté avec succès");
      toast.info("Vous avez été déconnecté");
      
      return true;
    } catch (error: any) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error(`Erreur lors de la déconnexion: ${error.message}`);
      return false;
    }
  }
  
  /**
   * Inscrit un nouvel utilisateur
   */
  async signup(email: string, password: string, userData: any = {}): Promise<AuthResponse> {
    try {
      // In a real app, this would register a new user
      console.log("Inscription avec données:", { email, ...userData });
      
      // Simulate successful signup
      toast.success("Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte.");
      
      return {
        success: true,
        user: {
          id: "new-user-id",
          email: email,
          role: userData.role || "employee"
        }
      };
    } catch (error: any) {
      console.error("Erreur lors de l'inscription:", error);
      toast.error(`Échec de l'inscription: ${error.message}`);
      
      return {
        success: false,
        error: error.message || "Erreur lors de l'inscription"
      };
    }
  }
  
  /**
   * Récupère l'utilisateur actuellement connecté
   */
  async getCurrentUser() {
    // In a real app, this would validate the token and get user data
    // For this mock, just return the current user
    return currentUser;
  }
  
  /**
   * Renvoie l'email de confirmation
   */
  async resendEmailConfirmation(email: string): Promise<boolean> {
    try {
      // Simulate resending confirmation email
      toast.success("Email de confirmation renvoyé. Veuillez vérifier votre boîte de réception.");
      return true;
    } catch (error: any) {
      console.error("Erreur lors du renvoi de l'email de confirmation:", error);
      toast.error(`Erreur: ${error.message || "Impossible de renvoyer l'email"}`);
      return false;
    }
  }
}

// Exporter une instance unique du service d'authentification
export const authService = new AuthService();
