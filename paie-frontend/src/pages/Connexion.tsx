
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { authOperations } from "@/context/utils/authUtils";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/utils/supabaseClient";

const formSchema = z.object({
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères.",
  }),
  rememberMe: z.boolean().optional(),
});

const Connexion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, session, initComplete } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [lastEmail, setLastEmail] = useState("");
  const [loginAttempted, setLoginAttempted] = useState(false);
  
  // If already logged in, redirect to appropriate dashboard
  useEffect(() => {
    // Only check after initialization is complete to avoid premature redirects
    if (!initComplete) {
      console.log("Initialisation de l'authentification non terminée, en attente...");
      return;
    }
    
    const checkSession = async () => {
      try {
        // If we already attempted to login on this page view, don't auto-redirect
        if (loginAttempted) {
          console.log("Tentative de connexion effectuée, pas de redirection automatique");
          return;
        }

        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log("Utilisateur déjà connecté:", data.session.user?.email);
          console.log("Métadonnées utilisateur:", data.session.user?.user_metadata);
          
          const role = data.session.user?.user_metadata?.role || 'employee';
          
          // Get the intended destination from the location state, or use default based on role
          const from = (location.state as any)?.from?.pathname || 
            (role === 'admin' ? '/admin' : '/dashboard');
          
          console.log("Redirection vers:", from);
          
          // Use window.location to ensure a full page refresh to reset any stale states
          window.location.href = from;
        }
      } catch (error) {
        console.error("Erreur de vérification de session:", error);
      }
    };
    
    checkSession();
  }, [navigate, session, location, loginAttempted, initComplete]);
  
  // Retrieve the saved email if "Remember me" was checked
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      form.setValue("email", rememberedEmail);
      form.setValue("rememberMe", true);
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setAuthError(null);
    setNeedsVerification(false);
    setLastEmail(values.email);
    setLoginAttempted(true);
    
    try {
      console.log("Tentative de connexion avec:", values.email);
      // Use auth operations from the context instead
      const { data, error } = await authOperations.signIn(values.email, values.password);
      
      if (error) {
        console.error("Erreur de connexion:", error);
        
        if (error.message && error.message.includes('Email not confirmed')) {
          setNeedsVerification(true);
          setAuthError("Veuillez vérifier votre email avant de vous connecter.");
        } else {
          setAuthError(error.message || "Une erreur est survenue lors de la connexion.");
        }
        
        setIsLoading(false);
        return;
      }
      
      // Login successful
      console.log("Connexion réussie:", data);
      
      // If "Remember me" is checked, store credentials
      if (values.rememberMe) {
        localStorage.setItem("rememberedEmail", values.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      
      // Show success message
      toast.success("Connexion réussie !");
      
      // Check user role directly from response to redirect
      const role = data.user?.role || 'employee';
      
      // Get the intended destination from the location state, or use default based on role
      const from = (location.state as any)?.from?.pathname || 
        (role === 'admin' ? '/admin' : '/dashboard');
      
      console.log(`Redirection vers: ${from} basée sur le rôle: ${role}`);
      
      // Use window.location.href for a full page refresh instead of navigate
      // This ensures all components re-render with the new auth state
      window.location.href = from;
    } catch (error: any) {
      console.error("Erreur complète de connexion:", error);
      setAuthError("Une erreur inattendue s'est produite. Veuillez réessayer plus tard.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setAuthError(null);
    setLoginAttempted(true);
    
    try {
      console.log("Connexion Google simulée en mode données statiques");
      // In static data mode, just simulate success after delay
      setTimeout(() => {
        toast.success("Connexion Google réussie (simulée en mode données statiques)");
        window.location.href = "/dashboard";
      }, 1000);
    } catch (error: any) {
      console.error("Erreur lors de la connexion Google:", error);
      setAuthError("Erreur de connexion avec Google. Veuillez réessayer.");
      setGoogleLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!lastEmail) return;
    
    setResendingEmail(true);
    try {
      // Static data mode simulation
      console.log("Simulation de renvoi d'email pour:", lastEmail);
      setTimeout(() => {
        toast.success('Email de vérification envoyé ! (Simulé en mode données statiques)');
        setResendingEmail(false);
      }, 1000);
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
      setResendingEmail(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // If already logged in and redirecting, show loading state
  if (session && !loginAttempted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Vous êtes déjà connecté. Redirection en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-20 px-4 mt-16">
        <div className="w-full max-w-md">
          <Card className="border-blue-primary/20 shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold text-blue-primary">Connexion</CardTitle>
            </CardHeader>
            <CardContent>
              {authError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription className="flex flex-col gap-2">
                    <div>{authError}</div>
                    {needsVerification && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 flex items-center gap-2"
                        onClick={handleResendVerification}
                        disabled={resendingEmail}
                      >
                        {resendingEmail ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                        Renvoyer l'email de vérification
                      </Button>
                    )}
                  </AlertDescription>
                </Alert>
              )}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse email</FormLabel>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input
                              placeholder="nom@exemple.com"
                              className="pl-10"
                              type="email"
                              autoComplete="email"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input
                              placeholder="••••••••"
                              type={showPassword ? "text" : "password"}
                              className="pl-10 pr-10"
                              autoComplete="current-password"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-10 w-10"
                            onClick={togglePasswordVisibility}
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rememberMe"
                        checked={form.watch("rememberMe")}
                        onCheckedChange={(checked) => 
                          form.setValue("rememberMe", checked as boolean)
                        }
                        disabled={isLoading}
                      />
                      <label
                        htmlFor="rememberMe"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Se souvenir de moi
                      </label>
                    </div>
                    <Link
                      to="/mot-de-passe-oublie"
                      className="text-sm font-medium text-blue-primary hover:underline"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-blue-primary hover:bg-blue-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Connexion en cours...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <LogIn className="mr-2 h-4 w-4" />
                        Se connecter
                      </span>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Ou continuer avec
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4 flex items-center justify-center"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                >
                  {googleLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-foreground"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Connexion à Google...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                        <path d="M1 1h22v22H1z" fill="none" />
                      </svg>
                      Continuer avec Google
                    </span>
                  )}
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Vous n'avez pas de compte ?{" "}
                  <Link to="/inscription" className="font-medium text-blue-primary hover:underline">
                    Créer un compte
                  </Link>
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Connexion;
