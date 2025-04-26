
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'project_invite' | 'team_join' | 'message' | 'reminder' | 'system';
  read: boolean;
  related_id?: string; // ID of related object (project, team, etc.)
  created_at: string;
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();
  
  // Fetch notifications for the current user
  const fetchNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setNotifications(data || []);
      updateUnreadCount(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Mark a notification as read
  const markAsRead = async (notificationId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      updateUnreadCount(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notifications as read",
        variant: "destructive"
      });
    }
  };
  
  // Delete a notification
  const deleteNotification = async (notificationId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      const updatedNotifications = notifications.filter(n => n.id !== notificationId);
      setNotifications(updatedNotifications);
      updateUnreadCount(updatedNotifications);
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive"
      });
    }
  };
  
  // Update unread count
  const updateUnreadCount = (notifs: Notification[]) => {
    const count = notifs.filter(n => !n.read).length;
    setUnreadCount(count);
  };
  
  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;
    
    // Initial fetch
    fetchNotifications();
    
    // Subscribe to changes
    const subscription = supabase
      .channel('notifications-channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${user.id}` 
      }, payload => {
        if (payload.eventType === 'INSERT') {
          // Add new notification to the list
          setNotifications(prev => [payload.new as Notification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Show toast for new notifications
          toast({
            title: (payload.new as Notification).title,
            description: (payload.new as Notification).message,
          });
        } else if (payload.eventType === 'UPDATE') {
          // Update existing notification
          setNotifications(prev => 
            prev.map(n => 
              n.id === payload.new.id ? payload.new as Notification : n
            )
          );
          updateUnreadCount(notifications.map(n => 
            n.id === payload.new.id ? payload.new as Notification : n
          ));
        } else if (payload.eventType === 'DELETE') {
          // Remove deleted notification
          setNotifications(prev => 
            prev.filter(n => n.id !== payload.old.id)
          );
          updateUnreadCount(notifications.filter(n => 
            n.id !== payload.old.id
          ));
        }
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [user]);
  
  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
}
