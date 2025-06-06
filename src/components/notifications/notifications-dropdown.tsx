"use client";

import { useEffect, useState } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// Status colors mapping
const statusColors = {
  'Menunggu Pembayaran': 'text-yellow-600',
  'Diproses': 'text-blue-600',
  'Dalam Produksi': 'text-purple-600',
  'Selesai': 'text-green-600'
};

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const supabase = createClient();

  // Format message to highlight status
  const formatMessage = (message: string) => {
    // Find status text in the message
    const statusMatch = message.match(/(Menunggu Pembayaran|Diproses|Dalam Produksi|Selesai)/);
    if (!statusMatch) return message;

    const status = statusMatch[0];
    const parts = message.split(status);
    
    return (
      <>
        {parts[0]}
        <span className={`font-medium ${statusColors[status as keyof typeof statusColors]}`}>
          {status}
        </span>
        {parts[1]}
      </>
    );
  };

  // Load initial notifications and setup realtime subscription
  useEffect(() => {
    async function initialize() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get initial notifications
        const { data: initialNotifications, error: notificationsError } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);

        if (notificationsError) throw notificationsError;

        if (initialNotifications) {
          setNotifications(initialNotifications);
          const unreadCount = initialNotifications.filter(n => !n.is_read).length;
          setUnreadCount(unreadCount);
        }

        // Setup realtime subscription
        const channel = supabase
          .channel('public:notifications')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'notifications',
              filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
              const newNotification = payload.new as Notification;
              setNotifications(prev => [newNotification, ...prev]);
              setUnreadCount(prev => prev + 1);
              
              // Show toast notification
              toast(newNotification.title, {
                description: (
                  <div className="whitespace-pre-wrap">
                    {formatMessage(newNotification.message)}
                  </div>
                ),
              });
            }
          )
          .subscribe();

        // Cleanup subscription
        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    }

    initialize();
  }, [supabase]);

  // Mark notification as read
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      try {
        const { error } = await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', notification.id);

        if (error) throw error;

        setUnreadCount(prev => Math.max(0, prev - 1));
        setNotifications(prev =>
          prev.map(n =>
            n.id === notification.id ? { ...n, is_read: true } : n
          )
        );
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      setUnreadCount(0);
      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true }))
      );
      
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  // Delete all notifications
  const handleDeleteAll = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setNotifications([]);
      setUnreadCount(0);
      setShowDeleteDialog(false);
      
      toast.success('All notifications deleted');
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      toast.error('Failed to delete all notifications');
    }
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Notifications</span>
            {notifications.length > 0 && (
              <div className="flex gap-1">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="h-6 px-2 text-xs"
                    title="Mark all as read"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Read All
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="Delete all notifications"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete All
                </Button>
              </div>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <ScrollArea className="h-[400px]">
            {notifications.length === 0 ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  onSelect={() => handleNotificationClick(notification)}
                  className="flex flex-col items-start gap-1 p-4 cursor-pointer"
                >
                  <div className="flex items-center gap-2 w-full">
                    <span className="font-medium flex-1">{notification.title}</span>
                    {!notification.is_read && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatMessage(notification.message)}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
                </DropdownMenuItem>
              ))
            )}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete All Notifications</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete all notifications? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAll}
            >
              Delete All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}