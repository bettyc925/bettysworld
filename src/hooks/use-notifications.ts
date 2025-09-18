import { useState } from "react";

export interface NotificationData {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'message' | 'mention' | 'character_interaction';
  user: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  characterName?: string;
}

// Mock notification store - in a real app, this would be a proper state management solution
let notifications: NotificationData[] = [
  {
    id: "1",
    type: "like",
    user: "Sarah Kim",
    userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=100&h=100&fit=crop&crop=face",
    content: "liked your post about AI creativity",
    timestamp: "2 minutes ago",
    isRead: false
  },
  {
    id: "2", 
    type: "comment",
    user: "Mike Chen",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    content: "commented on your conversation with Aria",
    timestamp: "5 minutes ago",
    isRead: false
  },
  {
    id: "3",
    type: "follow",
    user: "Luna Artist",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    content: "started following you",
    timestamp: "10 minutes ago",
    isRead: false
  }
];

export const useNotifications = () => {
  const [notificationList, setNotificationList] = useState<NotificationData[]>(notifications);

  const addNotification = (notification: Omit<NotificationData, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: NotificationData = {
      ...notification,
      id: Date.now().toString(),
      timestamp: "now",
      isRead: false
    };
    
    const updatedNotifications = [newNotification, ...notificationList];
    setNotificationList(updatedNotifications);
    notifications = updatedNotifications;
    
    // Simulate real-time update
    setTimeout(() => {
      setNotificationList(prev => 
        prev.map(n => 
          n.id === newNotification.id 
            ? { ...n, timestamp: "1 minute ago" }
            : n
        )
      );
    }, 60000);
  };

  const markAsRead = (id: string) => {
    const updatedNotifications = notificationList.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
    setNotificationList(updatedNotifications);
    notifications = updatedNotifications;
  };

  const markAllAsRead = () => {
    const updatedNotifications = notificationList.map(n => ({ ...n, isRead: true }));
    setNotificationList(updatedNotifications);
    notifications = updatedNotifications;
  };

  const deleteNotification = (id: string) => {
    const updatedNotifications = notificationList.filter(n => n.id !== id);
    setNotificationList(updatedNotifications);
    notifications = updatedNotifications;
  };

  const unreadCount = notificationList.filter(n => !n.isRead).length;

  return {
    notifications: notificationList,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
};

// Utility functions for triggering notifications from other components
export const triggerLikeNotification = (user: string, userAvatar: string) => {
  // This would be called when someone likes a post
  const notification = {
    type: 'like' as const,
    user,
    userAvatar,
    content: "liked your post"
  };
  // In a real app, this would dispatch to a global state manager
  console.log("New like notification:", notification);
};

export const triggerCommentNotification = (user: string, userAvatar: string, postContent?: string) => {
  const notification = {
    type: 'comment' as const,
    user,
    userAvatar,
    content: `commented on your ${postContent ? 'post about ' + postContent : 'post'}`
  };
  console.log("New comment notification:", notification);
};

export const triggerFollowNotification = (user: string, userAvatar: string) => {
  const notification = {
    type: 'follow' as const,
    user,
    userAvatar,
    content: "started following you"
  };
  console.log("New follow notification:", notification);
};

export const triggerMessageNotification = (user: string, userAvatar: string) => {
  const notification = {
    type: 'message' as const,
    user,
    userAvatar,
    content: "sent you a message"
  };
  console.log("New message notification:", notification);
};

export const triggerCharacterMentionNotification = (user: string, userAvatar: string, characterName: string) => {
  const notification = {
    type: 'character_interaction' as const,
    user,
    userAvatar,
    content: `mentioned your character in a conversation`,
    characterName
  };
  console.log("New character mention notification:", notification);
};