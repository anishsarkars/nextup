
import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/hooks/use-notifications';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationDropdown() {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  // Format the date to be more readable
  const formatNotificationDate = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (e) {
      return 'recently';
    }
  };

  // Handle notification click
  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
    
    // Handle navigation based on notification type
    // For demo, just close the dropdown
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1 right-1 h-4 w-4 rounded-full bg-destructive flex items-center justify-center text-[10px] text-white"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[340px] max-h-[80vh] overflow-auto">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {notifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead} 
              className="text-xs h-7"
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <AnimatePresence>
            {loading ? (
              <DropdownMenuItem className="flex justify-center items-center h-32 cursor-default">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="animate-pulse text-muted-foreground text-sm"
                >
                  Loading notifications...
                </motion.div>
              </DropdownMenuItem>
            ) : notifications.length === 0 ? (
              <DropdownMenuItem className="flex justify-center items-center h-32 cursor-default">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-muted-foreground text-sm"
                >
                  No notifications yet
                </motion.div>
              </DropdownMenuItem>
            ) : (
              notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <DropdownMenuItem
                    className={`flex flex-col items-start p-3 cursor-pointer hover:bg-accent ${
                      !notification.read ? 'bg-muted/50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex justify-between w-full">
                      <span className="font-medium">{notification.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatNotificationDate(notification.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full absolute right-4 top-3"></div>
                    )}
                  </DropdownMenuItem>
                  {notifications.indexOf(notification) < notifications.length - 1 && (
                    <DropdownMenuSeparator />
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
