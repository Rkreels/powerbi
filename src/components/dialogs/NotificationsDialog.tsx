import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Check, X, Info, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";
import { dataService, Notification } from '@/services/dataService';
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface NotificationsDialogProps {
  trigger?: React.ReactNode;
  notificationCount: number;
  onCountChange: (count: number) => void;
}

export const NotificationsDialog: React.FC<NotificationsDialogProps> = ({ 
  trigger, 
  notificationCount, 
  onCountChange 
}) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (open) {
      loadNotifications();
    }
  }, [open]);

  const loadNotifications = () => {
    const allNotifications = dataService.getNotifications();
    setNotifications(allNotifications);
  };

  const markAsRead = (id: string) => {
    const success = dataService.markNotificationAsRead(id);
    if (success) {
      loadNotifications();
      const newCount = dataService.getUnreadNotificationCount();
      onCountChange(newCount);
      toast({
        title: "Notification marked as read",
        duration: 1000
      });
    }
  };

  const markAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        dataService.markNotificationAsRead(notification.id);
      }
    });
    loadNotifications();
    onCountChange(0);
    toast({
      title: "All notifications marked as read",
      duration: 1000
    });
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return <Info size={16} className="text-blue-500" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-500" />;
      case 'success':
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return <Info size={16} className="text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const defaultTrigger = (
    <Button variant="ghost" size="sm" className="relative p-2">
      <Bell size={16} />
      {notificationCount > 0 && (
        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white">
          {notificationCount}
        </Badge>
      )}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>Notifications</DialogTitle>
            {notifications.some(n => !n.read) && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell size={48} className="mx-auto mb-4 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 rounded-lg border transition-colors cursor-pointer",
                    notification.read 
                      ? "bg-gray-50 border-gray-200" 
                      : "bg-white border-blue-200 shadow-sm"
                  )}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className={cn(
                          "text-sm font-medium",
                          notification.read ? "text-gray-600" : "text-gray-900"
                        )}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                          >
                            <Check size={14} />
                          </Button>
                        )}
                      </div>
                      <p className={cn(
                        "text-sm mt-1",
                        notification.read ? "text-gray-500" : "text-gray-700"
                      )}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {formatDate(notification.created)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};