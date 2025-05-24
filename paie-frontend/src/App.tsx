
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { ThemeProvider } from './components/ui/theme-provider';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Pages
import Index from './pages/Index';
import Connexion from './pages/Connexion';
import Inscription from './pages/Inscription';
import MotDePasseOublie from './pages/MotDePasseOublie';
import ReinitialisationMotDePasse from './pages/ReinitialisationMotDePasse';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import APropos from './pages/APropos';
import Tarifs from './pages/Tarifs';
import AbonnementPlans from './pages/AbonnementPlans';
import Fonctionnalites from './pages/Fonctionnalites';
import Contact from './pages/Contact';
import AccesRefuse from './pages/AccesRefuse';
import GestionEmployes from './pages/GestionEmployes';
import EmployeDetail from './pages/EmployeDetail';
import GestionCongesAbsences from './pages/GestionCongesAbsences';
import PreparationPaie from './pages/PreparationPaie';
import HistoriqueGlobal from './pages/HistoriqueGlobal';
import GenerationBulletins from './pages/GenerationBulletins';
import Declarations from './pages/Declarations';
import IntegrationBancaire from './pages/IntegrationBancaire';
import Parametres from './pages/Parametres';
import UserFormPage from './pages/UserFormPage';
import UsersPage from './pages/UsersPage';
import ChoixTypeCompte from './pages/ChoixTypeCompte';

// Employee Pages
import EspaceEmploye from './pages/EspaceEmploye';
import TableauDeBordEmploye from './pages/employe/TableauDeBordEmploye';
import ProfilEmploye from './pages/employe/ProfilEmploye';
import BulletinsPaie from './pages/employe/BulletinsPaie';
import DemandeConges from './pages/employe/DemandeConges';
import AttestationsRH from './pages/employe/AttestationsRH';
import AnalytiqueRH from './pages/employe/AnalytiqueRH';

// Admin Pages
import AdminRoute from './components/admin/AdminRoute';
import DashboardPage from './pages/admin/DashboardPage';
import CompaniesPage from './pages/admin/CompaniesPage';
import CompanySubscriptionPage from './pages/admin/CompanySubscriptionPage';
import CompanyDetailsPage from './pages/admin/CompanyDetailsPage';
import UsersListPage from './pages/admin/UsersListPage';
import SubscriptionsAdminPage from './pages/admin/SubscriptionsAdminPage';

// Import and setup supabase client (replaced with static data mock)
import { supabase } from '@/utils/supabaseClient';

// Create a client
const queryClient = new QueryClient();

function App() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize authentication state
    const initAuth = async () => {
      // In real-world, this would be where you check the auth status with Supabase
      // With static data, we just simulate initialization
      setTimeout(() => {
        setInitialized(true);
      }, 500);

      // Listen for auth state changes (not actually functional in static data mode)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          console.log("Auth state changed (mock):", _event, session);
        }
      );
      
      return () => {
        subscription.unsubscribe();
      };
    };

    initAuth();
  }, []);

  if (!initialized) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="paie-theme">
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/connexion" element={<Connexion />} />
              <Route path="/inscription" element={<Inscription />} />
              <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />
              <Route path="/reinitialisation-mot-de-passe" element={<ReinitialisationMotDePasse />} />
              <Route path="/a-propos" element={<APropos />} />
              <Route path="/tarifs" element={<Tarifs />} />
              <Route path="/abonnement-plans" element={<AbonnementPlans />} />
              <Route path="/fonctionnalites" element={<Fonctionnalites />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/acces-refuse" element={<AccesRefuse />} />
              <Route path="/choix-type-compte" element={<ChoixTypeCompte />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/employes" element={<GestionEmployes />} />
              <Route path="/employes/:id" element={<EmployeDetail />} />
              <Route path="/conges-absences" element={<GestionCongesAbsences />} />
              <Route path="/preparation-paie" element={<PreparationPaie />} />
              <Route path="/historique" element={<HistoriqueGlobal />} />
              <Route path="/bulletins" element={<GenerationBulletins />} />
              <Route path="/declarations" element={<Declarations />} />
              <Route path="/integration-bancaire" element={<IntegrationBancaire />} />
              <Route path="/parametres/*" element={<Parametres />} />
              <Route path="/utilisateurs/nouveau" element={<UserFormPage />} />
              <Route path="/utilisateurs/:id" element={<UserFormPage />} />
              <Route path="/utilisateurs" element={<UsersPage />} />
              
              {/* Employee specific routes */}
              <Route path="/espace-employe" element={<EspaceEmploye />} />
              <Route path="/employe/tableau-de-bord" element={<TableauDeBordEmploye />} />
              <Route path="/employe/profil" element={<ProfilEmploye />} />
              <Route path="/employe/bulletins" element={<BulletinsPaie />} />
              <Route path="/employe/conges" element={<DemandeConges />} />
              <Route path="/employe/attestations" element={<AttestationsRH />} />
              <Route path="/employe/analytique" element={<AnalytiqueRH />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route
                path="/admin/dashboard"
                element={<AdminRoute><DashboardPage /></AdminRoute>}
              />
              <Route
                path="/admin/companies"
                element={<AdminRoute><CompaniesPage /></AdminRoute>}
              />
              <Route
                path="/admin/companies/:id"
                element={<AdminRoute><CompanyDetailsPage /></AdminRoute>}
              />
              <Route
                path="/admin/companies/:id/subscription"
                element={<AdminRoute><CompanySubscriptionPage /></AdminRoute>}
              />
              <Route
                path="/admin/users"
                element={<AdminRoute><UsersListPage /></AdminRoute>}
              />
              <Route
                path="/admin/subscriptions"
                element={<AdminRoute><SubscriptionsAdminPage /></AdminRoute>}
              />

              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            <SonnerToaster position="top-right" closeButton />
            <Toaster />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
