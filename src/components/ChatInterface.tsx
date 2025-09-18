import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, MoreHorizontal, Sparkles, Heart, Coffee, BookOpen, Lightbulb, Music, MessageCircle } from "lucide-react";
import { useAIChat } from '@/hooks/useAIChat';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from "framer-motion";

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
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, sendMessage } = useAIChat();
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (message?: string) => {
    const messageToSend = message || inputMessage.trim();
    if (!messageToSend || isLoading) return;
    
    setInputMessage("");
    setShowSuggestions(false);
    await sendMessage(messageToSend, character);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Conversation starters based on character type
  const getConversationStarters = () => {
    const starters = [
      "Hi! What makes you unique?",
      "Tell me about your interests",
      "What's your favorite topic to discuss?",
      "Help me understand something",
      "What would you like to know about me?"
    ];

    if (character.description?.toLowerCase().includes('philosophy')) {
      return [
        "What's your perspective on consciousness?",
        "Tell me about the meaning of existence",
        "What fascinates you about human nature?",
        "Share a philosophical insight with me"
      ];
    } else if (character.description?.toLowerCase().includes('tech') || character.description?.toLowerCase().includes('code')) {
      return [
        "What's the coolest tech trend right now?",
        "Help me understand AI better",
        "What programming concept excites you?",
        "Share a tech tip with me"
      ];
    } else if (character.description?.toLowerCase().includes('creative') || character.description?.toLowerCase().includes('story')) {
      return [
        "Tell me a short story",
        "What inspires your creativity?",
        "Help me brainstorm ideas",
        "Share something magical with me"
      ];
    }
    
    return starters;
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
        {/* Welcome message and character intro */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-start">
              <div className="max-w-[80%] p-4 rounded-2xl bg-gradient-cosmic/10 border border-primary/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Your AI Companion</span>
                </div>
                <p className="text-sm leading-relaxed">
                  {character.greeting_message || 
                   `Hi! I'm ${character.name}, and I'm here to be your thoughtful companion. Think of me as a friend who's genuinely curious about you and loves having meaningful conversations. What would you like to explore together?`}
                </p>
                <div className="mt-3 flex items-center space-x-2 text-xs text-muted-foreground">
                  <MessageCircle className="w-3 h-3" />
                  <span>Ready to chat • Always here to help</span>
                </div>
              </div>
            </div>
            
            {/* Conversation starters */}
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <p className="text-xs text-muted-foreground text-center">
                  ✨ Try one of these to get started:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {getConversationStarters().slice(0, 3).map((starter, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSend(starter)}
                      className="text-xs h-8 bg-muted/50 hover:bg-primary/10 border border-border/50"
                    >
                      {starter}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Chat messages */}
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${message.is_user ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-2xl ${
                  message.is_user
                    ? "bg-gradient-cosmic text-white shadow-glow"
                    : "bg-card border border-border/50"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs opacity-70">
                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {!message.is_user && (
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-70 hover:opacity-100">
                        <Heart className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="max-w-[70%] p-3 rounded-2xl bg-card border border-border/50">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-muted-foreground">{character.name} is thinking...</span>
              </div>
            </div>
          </motion.div>
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
            onClick={() => handleSend()}
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