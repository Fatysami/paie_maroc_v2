import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/utils/supabaseClient';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { appUser, loading, isAdmin, user, session } = useAuth();
  const location = useLocation();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [manualCheckDone, setManualCheckDone] = useState(false);
  const [manualIsAdmin, setManualIsAdmin] = useState(false);
  const [manualCheckLoading, setManualCheckLoading] = useState(false);
  
  // Debug current path
  useEffect(() => {
    console.log("AdminRoute rendered at path:", location.pathname);
  }, [location.pathname]);
  
  // Debug auth state
  useEffect(() => {
    console.log("Auth state in AdminRoute:", {
      loading,
      isAdmin,
      manualIsAdmin,
      userEmail: user?.email,
      sessionExists: !!session,
      appUserRole: appUser?.role
    });
  }, [loading, isAdmin, manualIsAdmin, user, session, appUser]);
  
  // Manual check for admin status directly from auth user metadata
  useEffect(() => {
    if (!session && !loading) {
      console.log("No session found and URL is admin, redirecting to login");
      return;
    }
    
    if (!isAdmin && !manualCheckDone && !manualCheckLoading && session) {
      setManualCheckLoading(true);
      
      const checkAdminStatus = async () => {
        try {
          console.log("Performing manual admin check");
          // In static data mode, we'll just check if the user is admin from the session
          const isUserAdmin = session?.user?.user_metadata?.role === 'admin' || appUser?.role === 'admin';
          setManualIsAdmin(isUserAdmin);
          
          if (isUserAdmin) {
            console.log("Admin access confirmed via metadata");
          } else {
            console.log("User is not an admin according to metadata");
            // Redirect non-admin users after a short delay
            setTimeout(() => {
              if (location.pathname.startsWith('/admin')) {
                console.log("Redirecting non-admin user to access denied page");
                window.location.href = '/acces-refuse';
              }
            }, 100);
          }
        } catch (err) {
          console.error("Error in manual admin check:", err);
        } finally {
          setManualCheckDone(true);
          setManualCheckLoading(false);
        }
      };
      
      checkAdminStatus();
    }
  }, [isAdmin, manualCheckDone, manualCheckLoading, location.pathname, session, loading, appUser]);
  
  // Set a timeout for loading to prevent infinite loading
  useEffect(() => {
    console.log("AdminRoute loading state:", loading);
    console.log("AdminRoute appUser:", appUser);
    console.log("AdminRoute isAdmin:", isAdmin);
    console.log("AdminRoute manualIsAdmin:", manualIsAdmin);
    
    if ((loading || manualCheckLoading) && !loadingTimeout) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
        toast.error("Loading timed out, please try again");
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [loading, appUser, isAdmin, manualIsAdmin, loadingTimeout, manualCheckLoading]);
  
  // Function to refresh the page
  const handleRefresh = () => {
    window.location.reload();
  };
  
  // Show timeout message if loading takes too long
  if ((loading && loadingTimeout) || (manualCheckLoading && loadingTimeout)) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
        <p className="text-red-500">Loading timed out, please try again</p>
        <button 
          onClick={handleRefresh} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh page
        </button>
      </div>
    );
  }
  
  // Check for valid session first - if no session but URL is admin, redirect to login
  if (!loading && !session && location.pathname.startsWith('/admin')) {
    console.log("No session found and URL is admin, redirecting to login");
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }
  
  // Show loading indicator
  if (loading || manualCheckLoading) {
    console.log("AdminRoute: Loading...");
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-primary mb-4"></div>
        <p className="text-gray-600">Loading admin page...</p>
      </div>
    );
  }
  
  // Redirect to login if not logged in
  if (!user) {
    console.log("AdminRoute: User not logged in, redirecting to login page");
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }
  
  // Check admin status from all sources
  const userMetadataAdmin = user?.user_metadata?.role === 'admin';
  const isUserAdmin = isAdmin || manualIsAdmin || userMetadataAdmin;
  console.log("Final admin status check:", { isAdmin, manualIsAdmin, userMetadataAdmin, finalResult: isUserAdmin });
  
  if (!isUserAdmin) {
    console.log("AdminRoute: User is not admin, redirecting to access denied", appUser?.role);
    return <Navigate to="/acces-refuse" replace />;
  }
  
  // Allow admin content if user is admin
  console.log("AdminRoute: Admin access granted");
  return <>{children}</>;
};

export default AdminRoute;
