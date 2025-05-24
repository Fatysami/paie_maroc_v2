
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Bell, 
  Menu, 
  X, 
  LogOut, 
  User, 
  Settings, 
  ChevronDown,
  LayoutDashboard,
  Users,
  FileText,
  FileSignature,
  Wrench,
  History
} from "lucide-react";

import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  user: {
    name: string;
    avatar: string;
    role: string;
  };
  onLogout: () => void;
  onSidebarToggle?: () => void; // Make this optional
  isSidebarOpen?: boolean; // Make this optional
  rightContent?: React.ReactNode; // Add this prop to accept custom content on the right side
}

const DashboardNavbar = ({ user, onLogout, onSidebarToggle, isSidebarOpen, rightContent }: NavbarProps) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    console.log("Déconnexion depuis la navbar");
    // Appelle la fonction de déconnexion passée en prop
    onLogout();
  };

  const notifications = [
    {
      id: 1,
      title: "Nouveau bulletin disponible",
      message: "Votre bulletin de paie d'Août 2023 est disponible",
      time: "Il y a 2 heures",
      read: false
    },
    {
      id: 2,
      title: "Rappel: Déclaration CNSS",
      message: "N'oubliez pas de soumettre la déclaration CNSS avant le 15/09",
      time: "Il y a 1 jour",
      read: true
    },
    {
      id: 3,
      title: "Mise à jour du système",
      message: "Une mise à jour importante sera déployée ce week-end",
      time: "Il y a 2 jours",
      read: true
    }
  ];

  const links = [
    {
      href: "/dashboard",
      label: "Tableau de bord",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
    },
    {
      href: "/employes",
      label: "Employés",
      icon: <Users className="h-4 w-4 mr-2" />,
    },
    {
      href: "/generation-bulletins",
      label: "Bulletins",
      icon: <FileText className="h-4 w-4 mr-2" />,
    },
    {
      href: "/declarations",
      label: "Déclarations",
      icon: <FileSignature className="h-4 w-4 mr-2" />,
    },
    {
      href: "/parametres",
      label: "Paramètres",
      icon: <Wrench className="h-4 w-4 mr-2" />,
    },
    {
      href: "/historique",
      label: "Historique",
      icon: <History className="h-4 w-4 mr-2" />,
    }
  ];

  return (
    <header className="fixed w-full bg-background/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-primary">PaieSimplifiée</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link 
                key={link.href} 
                to={link.href} 
                className="text-foreground hover:text-blue-primary transition-colors flex items-center gap-1.5"
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            
            {rightContent}
            
            {!rightContent && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {hasNotifications && (
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 border-b">
                    <div className="font-medium">Notifications</div>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-4 border-b last:border-0 hover:bg-muted/50 transition-colors ${notification.read ? '' : 'bg-blue-50 dark:bg-blue-900/10'}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          {!notification.read && (
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                              Nouveau
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t">
                    <Button variant="ghost" className="w-full justify-center text-sm">
                      Voir toutes les notifications
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.role}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Mon profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/parametres" className="cursor-pointer flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center md:hidden space-x-4">
            {rightContent}
            
            {!rightContent && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {hasNotifications && (
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="grid gap-4">
                    <div className="font-medium">Notifications</div>
                    {notifications.map((notification) => (
                      <div key={notification.id} className="grid gap-1">
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-sm">{notification.message}</div>
                        <div className="text-xs text-muted-foreground">{notification.time}</div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            <ThemeToggle />
            
            <Avatar 
              onClick={toggleMobileMenu}
              className="cursor-pointer"
            >
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <div className="container px-4 py-4 space-y-4">
            <div className="flex flex-col space-y-3 pb-4 border-b">
              <span className="font-medium">{user.name}</span>
              <span className="text-sm text-muted-foreground">{user.role}</span>
            </div>
            
            <nav className="flex flex-col space-y-4">
              {links.map((link) => (
                <Link 
                  key={link.href} 
                  to={link.href} 
                  className="text-foreground hover:text-blue-primary transition-colors flex items-center gap-1.5" 
                  onClick={toggleMobileMenu}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>
            
            <div className="pt-4 border-t">
              <Button 
                onClick={() => {
                  toggleMobileMenu();
                  handleLogout();
                }} 
                variant="destructive" 
                className="w-full"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const notifications = [
  {
    id: 1,
    title: "Nouveau bulletin disponible",
    message: "Votre bulletin de paie d'Août 2023 est disponible",
    time: "Il y a 2 heures",
    read: false
  },
  {
    id: 2,
    title: "Rappel: Déclaration CNSS",
    message: "N'oubliez pas de soumettre la déclaration CNSS avant le 15/09",
    time: "Il y a 1 jour",
    read: true
  },
  {
    id: 3,
    title: "Mise à jour du système",
    message: "Une mise à jour importante sera déployée ce week-end",
    time: "Il y a 2 jours",
    read: true
  }
];

const links = [
  {
    href: "/dashboard",
    label: "Tableau de bord",
    icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
  },
  {
    href: "/employes",
    label: "Employés",
    icon: <Users className="h-4 w-4 mr-2" />,
  },
  {
    href: "/generation-bulletins",
    label: "Bulletins",
    icon: <FileText className="h-4 w-4 mr-2" />,
  },
  {
    href: "/declarations",
    label: "Déclarations",
    icon: <FileSignature className="h-4 w-4 mr-2" />,
  },
  {
    href: "/parametres",
    label: "Paramètres",
    icon: <Wrench className="h-4 w-4 mr-2" />,
  },
  {
    href: "/historique",
    label: "Historique",
    icon: <History className="h-4 w-4 mr-2" />,
  }
];

const hasNotifications = true;

export default DashboardNavbar;
