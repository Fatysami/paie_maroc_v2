
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AccesRefuse: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Accès refusé</h1>
          <p className="text-lg mb-6">
            Vous n'avez pas les droits nécessaires pour accéder à cette page. 
            Seuls les administrateurs peuvent accéder au tableau de bord d'administration.
          </p>
          <Button onClick={() => navigate('/')} className="bg-blue-primary hover:bg-blue-primary/90">
            Retour à l'accueil
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AccesRefuse;
