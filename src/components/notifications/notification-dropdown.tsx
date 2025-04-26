
import { useEffect, useState } from 'react';
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
import { useNotifications } from '@/hooks/use-notifications';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function NotificationDropdown() {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  
  // Refresh notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);
  
  // Format notification time
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return format(date, 'MMM d, h:mm a');
    } catch (error) {
      return 'Unknown time';
    }
  };
  
  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'project_invite':
        return '👥';
      case 'team_join':
        return '🤝';
      case 'message':
        return '💬';
      case 'reminder':
        return '⏰';
      default:
        return '🔔';
    }
  };
  
  // Handle notification click
  const handleNotificationClick = async (id: string) => {
    await markAsRead(id);
  };
  
  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            >
              {unreadCount}
            </motion.span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {notifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.preventDefault();
                markAllAsRead();
              }}
              className="text-xs h-7"
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="max-h-80 overflow-y-auto">
          <DropdownMenuGroup>
            {loading ? (
              // Loading skeleton
              Array(3).fill(0).map((_, i) => (
                <DropdownMenuItem key={i} className="flex-col items-start p-3 cursor-default">
                  <div className="flex items-center w-full mb-2">
                    <Skeleton className="h-6 w-6 rounded-full mr-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-3 w-full my-1" />
                  <Skeleton className="h-3 w-2/3 my-1" />
                </DropdownMenuItem>
              ))
            ) : notifications.length > 0 ? (
              <AnimatePresence>
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DropdownMenuItem 
                      className={cn(
                        "flex-col items-start p-3 cursor-pointer",
                        notification.read ? "bg-background" : "bg-muted"
                      )}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex items-center w-full">
                        <span className="text-lg mr-2">{getNotificationIcon(notification.type)}</span>
                        <span className="font-medium flex-1">{notification.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <span className="text-xs text-muted-foreground mt-2">
                        {formatTime(notification.created_at)}
                      </span>
                    </DropdownMenuItem>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div className="py-6 text-center text-muted-foreground">
                <p>No notifications yet</p>
              </div>
            )}
          </DropdownMenuGroup>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
