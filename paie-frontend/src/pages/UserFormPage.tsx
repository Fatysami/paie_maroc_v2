
import React from 'react';
import UserForm from '@/components/users/UserForm';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserFormPage: React.FC = () => {
  const { appUser, loading } = useAuth();
  const navigate = useNavigate();

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
    navigate('/');
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gérer un utilisateur</h1>
        <p className="text-gray-600">Créez ou modifiez un utilisateur</p>
      </div>
      
      <UserForm />
    </div>
  );
};

export default UserFormPage;
