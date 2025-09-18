import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useNotifications } from "@/hooks/use-notifications";
import { 
  Bell, 
  Heart, 
  MessageCircle, 
  Users, 
  UserPlus,
  Star,
  Share,
  Sparkles,
  MoreHorizontal,
  X
} from "lucide-react";

interface NotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Notifications = ({ isOpen, onClose }: NotificationsProps) => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-accent" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-primary" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-cyber" />;
      case 'message':
        return <MessageCircle className="w-4 h-4 text-primary" />;
      case 'mention':
        return <Star className="w-4 h-4 text-accent" />;
      case 'character_interaction':
        return <Sparkles className="w-4 h-4 text-primary" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:relative md:inset-auto">
      {/* Mobile backdrop */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm md:hidden" onClick={onClose} />
      
      {/* Notifications panel */}
      <Card className="absolute top-4 right-4 w-[380px] max-h-[500px] bg-gradient-card backdrop-blur-md border border-border/50 shadow-cosmic overflow-hidden md:top-12 md:right-0">
        {/* Header */}
        <div className="p-4 border-b border-border/50 bg-card/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-lg">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="default" className="bg-accent text-accent-foreground">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications list */}
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="font-semibold mb-2">No notifications</h4>
              <p className="text-muted-foreground text-sm">
                You're all caught up! Check back later for updates.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/20 transition-colors cursor-pointer group ${
                    !notification.isRead ? "bg-primary/5" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10 border border-border/50">
                        <AvatarImage src={notification.userAvatar} alt={notification.user} />
                        <AvatarFallback>{notification.user[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-card rounded-full border border-border/50 flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">
                            <span className="font-semibold">{notification.user}</span>
                            {" "}
                            <span className={notification.isRead ? "text-muted-foreground" : "text-foreground"}>
                              {notification.content}
                            </span>
                            {notification.characterName && (
                              <span className="text-primary"> "{notification.characterName}"</span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.timestamp}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-border/50 bg-card/50">
            <Button variant="ghost" className="w-full text-sm">
              View all notifications
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Notifications;