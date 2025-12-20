import { useState, useEffect } from "react";
import { Bell, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const READ_STATE_KEY = "streamtv_expiration_read";

interface NotificationBellProps {
  userEmail: string;
  daysRemaining?: number | null;
}

const NotificationBell = ({ userEmail, daysRemaining }: NotificationBellProps) => {
  const [isRead, setIsRead] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Always check fresh on every render
    checkExpirationWarning();
  }, [userEmail, daysRemaining]);

  const checkExpirationWarning = () => {
    if (daysRemaining === null || daysRemaining === undefined) {
      setShowNotification(false);
      return;
    }

    // Show notification if 7 days or less remaining
    if (daysRemaining <= 7 && daysRemaining > 0) {
      setShowNotification(true);
      
      // Check if user has read the notification for this specific day count
      const readState = localStorage.getItem(`${READ_STATE_KEY}_${userEmail}`);
      if (readState) {
        const parsed = JSON.parse(readState);
        // Reset read state if days changed (new day = new notification)
        if (parsed.daysRemaining !== daysRemaining) {
          setIsRead(false);
          localStorage.removeItem(`${READ_STATE_KEY}_${userEmail}`);
        } else {
          setIsRead(parsed.read);
        }
      } else {
        setIsRead(false);
      }
    } else {
      setShowNotification(false);
      // Clear read state when not in warning period
      localStorage.removeItem(`${READ_STATE_KEY}_${userEmail}`);
    }
  };

  const markAsRead = () => {
    setIsRead(true);
    localStorage.setItem(
      `${READ_STATE_KEY}_${userEmail}`,
      JSON.stringify({ daysRemaining, read: true })
    );
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 1) return "text-destructive";
    if (days <= 3) return "text-orange-500";
    return "text-yellow-500";
  };

  const getMessage = () => {
    if (daysRemaining === 1) {
      return "Seu acesso expira amanhã! Renove para continuar assistindo.";
    }
    return `Seu acesso expira em ${daysRemaining} dias. Renove para continuar assistindo.`;
  };

  const unreadCount = showNotification && !isRead ? 1 : 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="lg" className="tv-focus relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              1
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
              onClick={markAsRead}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Marcar como lida
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {!showNotification ? (
            <div className="p-6 text-center text-muted-foreground">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>Nenhuma notificação</p>
              <p className="text-xs mt-1">
                Você será avisado quando seu acesso estiver próximo de expirar
              </p>
            </div>
          ) : (
            <button
              onClick={markAsRead}
              className={`w-full text-left p-4 border-b border-border/50 hover:bg-secondary/50 transition-colors ${
                !isRead ? "bg-destructive/5" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle 
                  className={`w-5 h-5 mt-0.5 flex-shrink-0 ${getUrgencyColor(daysRemaining!)}`} 
                />
                <div>
                  <p className="text-sm text-foreground">{getMessage()}</p>
                  <p className={`text-xs mt-1 font-medium ${getUrgencyColor(daysRemaining!)}`}>
                    {daysRemaining! <= 1 ? "Urgente!" : `${daysRemaining} dias restantes`}
                  </p>
                </div>
              </div>
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
