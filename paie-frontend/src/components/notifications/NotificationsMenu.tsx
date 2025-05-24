
import React, { useState } from 'react';
import { Bell, X, Check, Clock, Calendar, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type NotificationType = 'conge' | 'absence' | 'document' | 'info' | 'paie';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

interface NotificationsMenuProps {
  className?: string;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'conge',
    title: 'Demande de congé validée',
    message: 'Votre demande de congés du 10/08 au 20/08 a été validée par le service RH.',
    date: new Date(2024, 6, 30, 14, 30),
    read: false,
    actionUrl: '/espace-employe/conges',
    actionLabel: 'Voir mes congés'
  },
  {
    id: '2',
    type: 'absence',
    title: 'Justificatif manquant',
    message: 'Un justificatif est requis pour votre absence du 25/07. Veuillez le fournir avant le 05/08.',
    date: new Date(2024, 6, 28, 9, 45),
    read: false,
    actionUrl: '/espace-employe/conges',
    actionLabel: 'Télécharger'
  },
  {
    id: '3',
    type: 'document',
    title: 'Nouveau document disponible',
    message: 'Votre bulletin de salaire du mois de Juillet est disponible.',
    date: new Date(2024, 6, 25, 16, 20),
    read: true,
    actionUrl: '/espace-employe/bulletins',
    actionLabel: 'Télécharger'
  },
  {
    id: '4',
    type: 'paie',
    title: 'Paie impactée par absence',
    message: 'Votre salaire du mois d\'août sera impacté par une absence non rémunérée de 2 jours.',
    date: new Date(2024, 6, 20, 11, 10),
    read: true,
    actionUrl: '/espace-employe/profil',
    actionLabel: 'Voir détails'
  },
  {
    id: '5',
    type: 'info',
    title: 'Solde de congés mis à jour',
    message: 'Votre solde annuel de congés a été mis à jour. Vous disposez de 22 jours restants.',
    date: new Date(2024, 6, 15, 8, 55),
    read: true
  }
];

const NotificationsMenu: React.FC<NotificationsMenuProps> = ({ className }) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'conge':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'absence':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'document':
        return <Info className="h-5 w-5 text-purple-500" />;
      case 'paie':
        return <Info className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Aujourd'hui";
    } else if (diffDays === 1) {
      return "Hier";
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("relative", className)}
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 bg-red-500 text-white px-1.5 h-5 min-w-5 flex items-center justify-center rounded-full text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7 px-2" 
              onClick={markAllAsRead}
            >
              Tout marquer comme lu
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[400px]">
          {notifications.length > 0 ? (
            <div className="py-2">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={cn(
                    "px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors",
                    !notification.read && "bg-blue-50"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={cn(
                          "text-sm",
                          !notification.read && "font-semibold"
                        )}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatDate(notification.date)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      {notification.actionUrl && (
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="h-6 px-0 text-xs text-blue-600 mt-1" 
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = notification.actionUrl!;
                          }}
                        >
                          {notification.actionLabel}
                        </Button>
                      )}
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[200px] text-gray-500">
              <Bell className="h-12 w-12 text-gray-300 mb-2" />
              <p>Aucune notification</p>
            </div>
          )}
        </ScrollArea>
        
        <div className="border-t p-2 flex justify-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs w-full" 
            onClick={() => {
              setOpen(false);
              // Navigate to notifications history page
            }}
          >
            Voir toutes les notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsMenu;
