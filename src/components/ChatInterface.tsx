import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Mic, Image, MoreHorizontal } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  character: {
    name: string;
    avatar: string;
  };
}

const ChatInterface = ({ character }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Hello! I'm ${character.name}. I'm excited to chat with you! What would you like to talk about?`,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "That's fascinating! I'd love to explore that topic further with you. What aspects interest you most?",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
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
          <img 
            src={character.avatar} 
            alt={character.name}
            className="w-10 h-10 rounded-full border border-primary/30"
          />
          <div>
            <h3 className="font-semibold">{character.name}</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyber rounded-full animate-glow"></div>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-2xl ${
                message.isUser
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border/50"
              } animate-slide-up`}
            >
              <p className="text-sm">{message.text}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/50 bg-card/30">
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
            <div className="absolute right-2 bottom-2 flex space-x-1">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Image className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Mic className="w-3 h-3" />
              </Button>
            </div>
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

export default ChatInterface;