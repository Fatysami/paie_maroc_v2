
import React from 'react';
import UsersList from '@/components/users/UsersList';
import { useAuth } from '@/context/AuthContext';

const UsersPage: React.FC = () => {
  const { appUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-primary"></div>
      </div>
    );
  }

  // Vérifier si l'utilisateur a les droits d'accès (admin ou rh)
  const hasAccess = appUser?.role === 'admin' || appUser?.role === 'rh';

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Accès refusé</h1>
        <p className="text-center mb-6">
          Vous n'avez pas les droits nécessaires pour accéder à cette page.
          Seuls les administrateurs et les responsables RH peuvent gérer les utilisateurs.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
        <p className="text-gray-600">Administrez les utilisateurs de l'application</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <UsersList companyId={appUser?.role === 'admin' ? undefined : appUser?.companyId} />
      </div>
    </div>
  );
};

export default UsersPage;
