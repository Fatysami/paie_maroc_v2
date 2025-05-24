
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Building, CalendarCheck, Users, BarChart4,
  Clock, Settings, LogOut, Home
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { 
  Sidebar, SidebarContent, SidebarFooter,
  SidebarHeader, SidebarTrigger, SidebarProvider
} from '@/components/ui/sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { appUser, signOut } = useAuth();

  const navigation = [
    {
      name: 'Accueil',
      href: '/',
      icon: Home,
      current: location.pathname === '/'
    },
    {
      name: 'Entreprises',
      href: '/admin/companies',
      icon: Building,
      current: location.pathname.includes('/admin/companies')
    },
    {
      name: 'Abonnements',
      href: '/admin/subscriptions',
      icon: CalendarCheck,
      current: location.pathname === '/admin/subscriptions'
    },
    {
      name: 'Utilisateurs',
      href: '/admin/users',
      icon: Users,
      current: location.pathname === '/admin/users'
    },
    {
      name: 'Statistiques',
      href: '/admin/stats',
      icon: BarChart4,
      current: location.pathname === '/admin/stats'
    },
    {
      name: 'Historique',
      href: '/admin/history',
      icon: Clock,
      current: location.pathname === '/admin/history'
    },
    {
      name: 'Paramètres',
      href: '/admin/settings',
      icon: Settings,
      current: location.pathname === '/admin/settings'
    },
  ];

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <SidebarProvider defaultCollapsed={false}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar className="border-r bg-white">
          <SidebarHeader className="py-4 flex items-center justify-center mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-1 rounded">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">Admin Paie</h2>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-2">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  asChild
                  variant={item.current ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    item.current ? "bg-blue-50 text-blue-700 hover:bg-blue-100" : ""
                  )}
                >
                  <Link to={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </SidebarContent>
          
          <SidebarFooter>
            <div className="p-4">
              <div className="mb-2">
                <p className="text-xs font-medium text-gray-500">Connecté en tant que</p>
                <p className="font-medium">{appUser?.email || "..."}</p>
                <p className="text-xs text-gray-500 capitalize">{appUser?.role || "..."}</p>
              </div>
              <Separator className="my-2" />
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600" 
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 overflow-auto">
          <div className="bg-white shadow-sm border-b sticky top-0 z-10 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <SidebarTrigger />
              <h1 className="text-xl font-bold">Administration</h1>
            </div>
            
            {appUser && (
              <div className="flex items-center">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-sm font-medium">{appUser.email}</p>
                    <p className="text-xs text-gray-500 capitalize">{appUser.role}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="font-medium text-blue-600">
                      {appUser.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
