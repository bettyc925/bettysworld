import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, MessageCircle, Users, Star } from "lucide-react";

interface MessageThread {
  id: string;
  user: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isOnline?: boolean;
}

interface MessageInboxProps {
  onSelectThread: (thread: MessageThread) => void;
}

const MessageInbox = ({ onSelectThread }: MessageInboxProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  const messageThreads: MessageThread[] = [
    {
      id: "1",
      user: "Sarah Kim",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=100&h=100&fit=crop&crop=face",
      lastMessage: "I'm using Procreate on iPad! Would love any tutorials...",
      timestamp: "2 min ago",
      unread: 2,
      isOnline: true
    },
    {
      id: "2", 
      user: "Mike Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      lastMessage: "Thanks for the feedback on my latest post!",
      timestamp: "1 hour ago",
      unread: 0,
      isOnline: false
    },
    {
      id: "3",
      user: "Luna Artist",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      lastMessage: "Would love to collaborate on a creative project",
      timestamp: "3 hours ago",
      unread: 1,
      isOnline: true
    },
    {
      id: "4",
      user: "Alex Rivera", 
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      lastMessage: "Your character creation tips were super helpful!",
      timestamp: "Yesterday",
      unread: 0,
      isOnline: false
    }
  ];

  const filteredThreads = messageThreads.filter(thread =>
    thread.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = messageThreads.reduce((sum, thread) => sum + thread.unread, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-cosmic bg-clip-text text-transparent">
            Messages
          </h2>
          <p className="text-muted-foreground">
            Connect with other users and their characters
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="default" className="bg-accent text-accent-foreground">
            {unreadCount} unread
          </Badge>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search conversations..."
          className="pl-10 bg-muted/50"
        />
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 border-b border-border/50">
        <button
          onClick={() => setSelectedTab("all")}
          className={`pb-2 text-sm font-medium transition-colors ${
            selectedTab === "all"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          All Messages
        </button>
        <button
          onClick={() => setSelectedTab("unread")}
          className={`pb-2 text-sm font-medium transition-colors ${
            selectedTab === "unread"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setSelectedTab("online")}
          className={`pb-2 text-sm font-medium transition-colors ${
            selectedTab === "online"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Online
        </button>
      </div>

      {/* Message Threads */}
      <div className="space-y-3">
        {filteredThreads.map((thread) => (
          <div
            key={thread.id}
            onClick={() => onSelectThread(thread)}
            className="p-4 bg-gradient-card backdrop-blur-sm rounded-xl border border-border/50 hover:shadow-card transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-start space-x-3">
              <div className="relative">
                <Avatar className="w-12 h-12 border border-border/50">
                  <AvatarImage src={thread.avatar} alt={thread.user} />
                  <AvatarFallback>{thread.user[0]}</AvatarFallback>
                </Avatar>
                {thread.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cyber rounded-full border-2 border-background"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                    {thread.user}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {thread.unread > 0 && (
                      <Badge variant="default" className="bg-accent text-accent-foreground text-xs px-2 py-0">
                        {thread.unread}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {thread.timestamp}
                    </span>
                  </div>
                </div>
                <p className={`text-sm leading-relaxed truncate ${
                  thread.unread > 0 
                    ? "text-foreground font-medium" 
                    : "text-muted-foreground"
                }`}>
                  {thread.lastMessage}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredThreads.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No conversations found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery 
              ? "Try adjusting your search terms"
              : "Start connecting with other users and their characters"
            }
          </p>
          <Button variant="cosmic">
            <Users className="w-4 h-4 mr-2" />
            Discover Users
          </Button>
        </div>
      )}
    </div>
  );
};

export default MessageInbox;