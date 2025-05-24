
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import PricingSection from '@/components/PricingSection';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

const Index = () => {
  const { appUser } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Admin Quick Access Banner (only shown to admin users) */}
      {appUser?.role === 'admin' && (
        <div className="bg-blue-50 text-blue-800 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Mode Administrateur</span>
              <span className="text-blue-600">·</span>
              <span>Accès privilégié aux fonctionnalités d'administration</span>
            </div>
            <Button asChild variant="default" size="sm">
              <Link to="/admin">Tableau de bord Admin</Link>
            </Button>
          </div>
        </div>
      )}
      
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
