import { useState, useEffect } from "react";
import { Bell, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ExpirationNotification {
  id: string;
  message: string;
  daysRemaining: number;
  read: boolean;
  createdAt: string;
}

const NOTIFICATIONS_KEY = "streamtv_expiration_notifications";

interface NotificationBellProps {
  userEmail: string;
  daysRemaining?: number | null;
}

const NotificationBell = ({ userEmail, daysRemaining }: NotificationBellProps) => {
  const [notifications, setNotifications] = useState<ExpirationNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    checkExpirationWarning();
  }, [userEmail, daysRemaining]);

  const checkExpirationWarning = () => {
    if (daysRemaining === null || daysRemaining === undefined) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    // Only show notification if 7 days or less remaining
    if (daysRemaining <= 7 && daysRemaining > 0) {
      const notificationId = `expiration-${daysRemaining}`;
      const stored = localStorage.getItem(`${NOTIFICATIONS_KEY}_${userEmail}`);
      const existingNotifications: ExpirationNotification[] = stored ? JSON.parse(stored) : [];
      
      // Remove old expiration notifications and add current one
      const filteredNotifications = existingNotifications.filter(n => !n.id.startsWith('expiration-'));
      
      const newNotification: ExpirationNotification = {
        id: notificationId,
        message: daysRemaining === 1 
          ? "Seu acesso expira amanhã! Renove para continuar assistindo."
          : `Seu acesso expira em ${daysRemaining} dias. Renove para continuar assistindo.`,
        daysRemaining: daysRemaining,
        read: false,
        createdAt: new Date().toISOString()
      };
      
      const updatedNotifications = [newNotification, ...filteredNotifications];
      setNotifications(updatedNotifications);
      setUnreadCount(updatedNotifications.filter(n => !n.read).length);
      localStorage.setItem(`${NOTIFICATIONS_KEY}_${userEmail}`, JSON.stringify(updatedNotifications));
    } else {
      // Clear expiration notifications if more than 7 days or expired
      const stored = localStorage.getItem(`${NOTIFICATIONS_KEY}_${userEmail}`);
      if (stored) {
        const existingNotifications: ExpirationNotification[] = JSON.parse(stored);
        const filtered = existingNotifications.filter(n => !n.id.startsWith('expiration-'));
        setNotifications(filtered);
        setUnreadCount(filtered.filter(n => !n.read).length);
        localStorage.setItem(`${NOTIFICATIONS_KEY}_${userEmail}`, JSON.stringify(filtered));
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    }
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    setUnreadCount(0);
    localStorage.setItem(`${NOTIFICATIONS_KEY}_${userEmail}`, JSON.stringify(updated));
  };

  const handleNotificationClick = (notification: ExpirationNotification) => {
    const updated = notifications.map((n) =>
      n.id === notification.id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    setUnreadCount(updated.filter((n) => !n.read).length);
    localStorage.setItem(`${NOTIFICATIONS_KEY}_${userEmail}`, JSON.stringify(updated));
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 1) return "text-destructive";
    if (days <= 3) return "text-orange-500";
    return "text-yellow-500";
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="lg" className="tv-focus relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-card border-border" align="end">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Notificações</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>Nenhuma notificação</p>
              <p className="text-xs mt-1">
                Você será avisado quando seu acesso estiver próximo de expirar
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`w-full text-left p-4 border-b border-border/50 hover:bg-secondary/50 transition-colors ${
                  !notification.read ? "bg-destructive/5" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${getUrgencyColor(notification.daysRemaining)}`} />
                  <div>
                    <p className="text-sm text-foreground">{notification.message}</p>
                    <p className={`text-xs mt-1 font-medium ${getUrgencyColor(notification.daysRemaining)}`}>
                      {notification.daysRemaining <= 1 ? "Urgente!" : `${notification.daysRemaining} dias restantes`}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
