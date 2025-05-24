
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarCheck, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar: React.FC = () => {
  const { appUser, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/connexion');
  };

  const navItems = [
    { text: 'Accueil', link: '/' },
    { text: 'Fonctionnalités', link: '/fonctionnalites' },
    { text: 'Tarifs', link: '/tarifs' },
    { text: 'À propos', link: '/a-propos' },
    { text: 'Contact', link: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <CalendarCheck className="w-6 h-6 text-blue-600" />
                <span className="text-xl font-bold text-blue-600">PayManager</span>
              </Link>
            </div>

            {/* Desktop menu */}
            {!isMobile && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.text}
                    to={item.link}
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    {item.text}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-3">
            {appUser ? (
              <>
                {appUser.role === 'admin' && (
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/admin')}
                    className="text-blue-600 hover:bg-blue-50"
                  >
                    Administration
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  onClick={() => navigate('/dashboard')}
                  className="text-blue-600 hover:bg-blue-50"
                >
                  Mon Espace
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
                    >
                      <span className="sr-only">Open user menu</span>
                      <span className="font-semibold">
                        {appUser.email.charAt(0).toUpperCase()}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{appUser.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">Tableau de bord</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/parametres">Paramètres</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>Déconnexion</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/connexion">Connexion</Link>
                </Button>
                <Button asChild>
                  <Link to="/inscription">S'inscrire</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.text}
                to={item.link}
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                onClick={toggleMenu}
              >
                {item.text}
              </Link>
            ))}

            {appUser ? (
              <>
                {appUser.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="border-transparent text-blue-600 hover:bg-gray-50 hover:border-blue-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                    onClick={toggleMenu}
                  >
                    Administration
                  </Link>
                )}
                
                <Link
                  to="/dashboard"
                  className="border-transparent text-blue-600 hover:bg-gray-50 hover:border-blue-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                  onClick={toggleMenu}
                >
                  Mon Espace
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/connexion"
                  className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                  onClick={toggleMenu}
                >
                  Connexion
                </Link>
                <Link
                  to="/inscription"
                  className="border-transparent text-blue-600 hover:bg-gray-50 hover:border-blue-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                  onClick={toggleMenu}
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
