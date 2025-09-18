import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, MoreHorizontal, Search } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: string;
  senderAvatar: string;
  isCurrentUser: boolean;
  timestamp: Date;
  isUserCharacter?: boolean;
  characterName?: string;
}

interface DirectMessageProps {
  user: {
    name: string;
    avatar: string;
    isOnline?: boolean;
  };
}

const DirectMessage = ({ user }: DirectMessageProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey! I saw your latest creative post and loved the color palette you used. Any tips for someone just starting digital art?",
      sender: user.name,
      senderAvatar: user.avatar,
      isCurrentUser: false,
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "2", 
      text: "Thanks so much! I'd love to help. Are you working with any specific software? I have some great beginner resources.",
      sender: "Alex Creative",
      senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      isCurrentUser: true,
      timestamp: new Date(Date.now() - 3500000),
      isUserCharacter: true,
      characterName: "Alex Creative"
    },
    {
      id: "3",
      text: "I'm using Procreate on iPad! Would love any tutorials or techniques you recommend.",
      sender: user.name,
      senderAvatar: user.avatar,
      isCurrentUser: false,
      timestamp: new Date(Date.now() - 3400000),
    }
  ]);

  const [inputValue, setInputValue] = useState("");

  // Mock user characters
  const userCharacters = [
    { id: "1", name: "Alex Creative", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
    { id: "2", name: "Tech Sage", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" }
  ];
  const [selectedCharacter, setSelectedCharacter] = useState(userCharacters[0]);

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: selectedCharacter.name,
      senderAvatar: selectedCharacter.avatar,
      isCurrentUser: true,
      timestamp: new Date(),
      isUserCharacter: true,
      characterName: selectedCharacter.name
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-card backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card/50">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10 border border-primary/30">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{user.name}</h3>
            <div className="flex items-center space-x-2">
              {user.isOnline && (
                <>
                  <div className="w-2 h-2 bg-cyber rounded-full animate-glow"></div>
                  <span className="text-xs text-muted-foreground">Online</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex space-x-2 max-w-[70%] ${message.isCurrentUser ? "flex-row-reverse space-x-reverse" : ""}`}>
              <Avatar className="w-8 h-8 border border-border/50">
                <AvatarImage src={message.senderAvatar} alt={message.sender} />
                <AvatarFallback>{message.sender[0]}</AvatarFallback>
              </Avatar>
              <div className={`space-y-1 ${message.isCurrentUser ? "items-end" : "items-start"} flex flex-col`}>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>{message.sender}</span>
                  {message.isUserCharacter && (
                    <span className="bg-cyber/20 text-cyber px-1 rounded">Your Character</span>
                  )}
                </div>
                <div
                  className={`p-3 rounded-2xl ${
                    message.isCurrentUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border/50"
                  } animate-slide-up`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/50 bg-card/30">
        {/* Character Selector */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-xs text-muted-foreground">Replying as:</span>
          <select 
            value={selectedCharacter.id}
            onChange={(e) => {
              const character = userCharacters.find(c => c.id === e.target.value);
              if (character) setSelectedCharacter(character);
            }}
            className="text-xs bg-muted/50 border border-border/50 rounded px-2 py-1"
          >
            {userCharacters.map(char => (
              <option key={char.id} value={char.id}>{char.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full bg-muted/50 border border-border/50 rounded-lg p-3 pr-12 resize-none max-h-32 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              rows={1}
            />
          </div>
          <Button 
            onClick={sendMessage}
            variant="cosmic" 
            size="icon"
            disabled={!inputValue.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DirectMessage;