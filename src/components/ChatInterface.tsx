import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Send, Bot, MoreHorizontal } from "lucide-react";
import { useAIChat } from '@/hooks/useAIChat';
import { useAuth } from '@/hooks/useAuth';

interface Character {
  id: string;
  name: string;
  description?: string;
  avatar_url?: string;
  greeting_message?: string;
}

interface ChatInterfaceProps {
  character: Character;
}

const ChatInterface = ({ character }: ChatInterfaceProps) => {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, sendMessage } = useAIChat();
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    const message = inputMessage.trim();
    setInputMessage("");
    await sendMessage(message, character);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!user) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">Sign in to Chat</h3>
        <p className="text-muted-foreground">Please sign in to start chatting with {character.name}</p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-card backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card/50">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={character.avatar_url} alt={character.name} />
            <AvatarFallback>
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{character.name}</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyber rounded-full animate-glow"></div>
              <span className="text-xs text-muted-foreground">AI Character</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Greeting message */}
        {character.greeting_message && messages.length === 0 && (
          <div className="flex justify-start">
            <div className="max-w-[70%] p-3 rounded-2xl bg-card border border-border/50 animate-slide-up">
              <p className="text-sm">{character.greeting_message}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        )}

        {/* Chat messages */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.is_user ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-2xl ${
                message.is_user
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border/50"
              } animate-slide-up`}
            >
              <p className="text-sm">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[70%] p-3 rounded-2xl bg-card border border-border/50">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/50 bg-card/30">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${character.name}...`}
              disabled={isLoading}
              className="w-full bg-muted/50 border border-border/50 rounded-lg"
            />
          </div>
          <Button 
            onClick={handleSend}
            variant="cosmic" 
            size="icon"
            disabled={!inputMessage.trim() || isLoading}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;