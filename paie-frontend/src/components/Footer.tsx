
import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique d'abonnement à la newsletter
    console.log("Newsletter subscription submitted");
  };

  return (
    <footer className="bg-primary/5 text-gray-700 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Colonne 1 - À propos */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-blue-primary">PaieSimplifiée</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Solution moderne de gestion de paie adaptée aux spécificités du Maroc, conçue pour simplifier vos processus RH.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-500 hover:text-blue-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-500 hover:text-blue-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-500 hover:text-blue-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-500 hover:text-blue-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Colonne 2 - Liens rapides */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-blue-primary">Liens Rapides</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/fonctionnalites" className="text-gray-600 hover:text-blue-primary transition-colors">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link to="/tarifs" className="text-gray-600 hover:text-blue-primary transition-colors">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link to="/a-propos" className="text-gray-600 hover:text-blue-primary transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-blue-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-blue-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 - Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-blue-primary">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-gray-500" />
                <span className="text-gray-600">123 Avenue Mohammed V, Casablanca, Maroc</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 flex-shrink-0 text-gray-500" />
                <a href="tel:+212522123456" className="text-gray-600 hover:text-blue-primary transition-colors">
                  +212 522 12 34 56
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 flex-shrink-0 text-gray-500" />
                <a href="mailto:contact@paiesimplifiee.ma" className="text-gray-600 hover:text-blue-primary transition-colors">
                  contact@paiesimplifiee.ma
                </a>
              </li>
            </ul>
          </div>

          {/* Colonne 4 - Newsletter */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-blue-primary">Newsletter</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Abonnez-vous pour recevoir les dernières mises à jour et actualités.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <Input 
                type="email" 
                placeholder="Votre email" 
                className="bg-white border-gray-200 text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-opacity-50 focus:ring-blue-300"
                required
              />
              <Button type="submit" className="w-full bg-blue-primary hover:bg-blue-primary/90 text-white">
                S'abonner
              </Button>
            </form>
          </div>
        </div>

        <hr className="mt-12 mb-8 border-gray-200" />

        <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <div className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} PaieSimplifiée. Tous droits réservés.
          </div>
          <div className="flex space-x-6">
            <Link to="/mentions-legales" className="hover:text-blue-primary transition-colors">
              Mentions Légales
            </Link>
            <Link to="/confidentialite" className="hover:text-blue-primary transition-colors">
              Politique de Confidentialité
            </Link>
            <Link to="/cgv" className="hover:text-blue-primary transition-colors">
              CGV
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
