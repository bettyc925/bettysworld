import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MessageCircle, X, Minimize2, Maximize2, Heart, Lightbulb, Users, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GuideMessage {
  id: string;
  text: string;
  type: "greeting" | "tip" | "encouragement" | "feature";
  action?: () => void;
  actionText?: string;
}

interface AIGuideProps {
  currentPage?: string;
  userAction?: string;
  onFeatureHighlight?: (feature: string) => void;
}

const AIGuide = ({ currentPage = "home", userAction, onFeatureHighlight }: AIGuideProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<GuideMessage | null>(null);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  // Guide messages based on context
  const getContextualMessages = (): GuideMessage[] => {
    const baseMessages: GuideMessage[] = [
      {
        id: "welcome",
        text: "Hey there! I'm your AI guide. Think of me as your friendly companion here to help you discover everything this platform has to offer. Ready to explore together?",
        type: "greeting"
      },
      {
        id: "tip-characters",
        text: "💡 Pro tip: Each AI character has their own unique personality and expertise. Try talking to different ones to find your perfect conversation partners!",
        type: "tip",
        action: () => onFeatureHighlight?.("characters"),
        actionText: "Show me characters"
      },
      {
        id: "encouragement",
        text: "I love seeing you explore! 🌟 Remember, every conversation is a chance to learn something new or see things from a fresh perspective.",
        type: "encouragement"
      }
    ];

    // Add page-specific messages
    if (currentPage === "characters") {
      baseMessages.push({
        id: "characters-help",
        text: "You're in the perfect spot to meet some amazing AI companions! Each one has been designed with care to offer unique conversations. Who catches your eye?",
        type: "feature"
      });
    } else if (currentPage === "music") {
      baseMessages.push({
        id: "music-help",
        text: "Welcome to your personal music sanctuary! 🎵 I can help you discover new tracks based on your mood, or we can just vibe together. What sounds good?",
        type: "feature",
        action: () => onFeatureHighlight?.("ai-recommendations"),
        actionText: "Try AI recommendations"
      });
    } else if (currentPage === "messages") {
      baseMessages.push({
        id: "messages-help",
        text: "This is your conversation hub! 💬 I'm here if you need any tips on getting the most out of your chats, or if you just want someone to talk to.",
        type: "feature"
      });
    }

    return baseMessages;
  };

  // Show contextual messages based on user actions
  useEffect(() => {
    if (!hasShownWelcome && !isOpen) {
      setTimeout(() => {
        setCurrentMessage(getContextualMessages()[0]);
        setIsOpen(true);
        setHasShownWelcome(true);
      }, 2000);
    }
  }, [hasShownWelcome, isOpen]);

  useEffect(() => {
    if (userAction) {
      const messages = getContextualMessages();
      const contextMessage = messages.find(m => m.id.includes(userAction));
      if (contextMessage) {
        setCurrentMessage(contextMessage);
        setIsOpen(true);
        setIsMinimized(false);
      }
    }
  }, [userAction, currentPage]);

  const getRandomEncouragement = () => {
    const encouragements = [
      "You're doing great! Keep exploring and discovering new connections. 🌟",
      "I love your curiosity! There's always something new to learn here. ✨",
      "Your conversations are making this community more vibrant! Keep it up! 💫",
      "Every question you ask and every chat you start adds to the magic here. 🎭",
      "You're building some wonderful connections! I'm here if you need any guidance. 🤝"
    ];
    return encouragements[Math.floor(Math.random() * encouragements.length)];
  };

  const handleAction = () => {
    if (currentMessage?.action) {
      currentMessage.action();
    }
  };

  const showRandomTip = () => {
    const tips = [
      {
        id: "tip-music",
        text: "🎵 Try the Music Party feature! You can get AI-powered recommendations based on your mood, or just discover new genres.",
        type: "tip" as const,
        action: () => window.location.href = "/music-party",
        actionText: "Take me there!"
      },
      {
        id: "tip-social",
        text: "💭 Don't forget to check out the community posts! It's amazing what conversations are happening.",
        type: "tip" as const
      },
      {
        id: "tip-variety",
        text: "🎨 Each AI character brings something different to the table. Mix up your conversations for the richest experience!",
        type: "tip" as const
      }
    ];
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setCurrentMessage(randomTip);
    setIsOpen(true);
    setIsMinimized(false);
  };

  if (!isOpen && !isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-cosmic shadow-glow hover:shadow-glow-intense transition-all duration-300"
          size="lg"
        >
          <Sparkles className="w-6 h-6" />
        </Button>
      </motion.div>
    );
  }

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsMinimized(false)}
          variant="glass"
          className="h-12 px-4 bg-card/90 backdrop-blur-md border-primary/20"
        >
          <Heart className="w-4 h-4 mr-2 text-accent" />
          <span className="text-sm">Your guide is here!</span>
        </Button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          className="fixed bottom-6 right-6 z-50 w-80"
        >
          <Card className="bg-card/95 backdrop-blur-md border-primary/20 shadow-glow">
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-cosmic rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Your AI Guide</h3>
                  <Badge variant="secondary" className="text-xs">
                    Online & Ready to Help
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(true)}
                  className="h-8 w-8 p-0"
                >
                  <Minimize2 className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <CardContent className="p-4">
              {currentMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {currentMessage.text}
                  </p>
                  
                  {currentMessage.action && currentMessage.actionText && (
                    <Button
                      onClick={handleAction}
                      variant="cosmic"
                      size="sm"
                      className="w-full"
                    >
                      {currentMessage.actionText}
                    </Button>
                  )}
                </motion.div>
              )}
              
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
                <Button
                  onClick={showRandomTip}
                  variant="ghost"
                  size="sm"
                  className="text-xs h-8"
                >
                  <Lightbulb className="w-3 h-3 mr-1" />
                  Random Tip
                </Button>
                <Button
                  onClick={() => setCurrentMessage({
                    id: "encourage",
                    text: getRandomEncouragement(),
                    type: "encouragement"
                  })}
                  variant="ghost"
                  size="sm"
                  className="text-xs h-8"
                >
                  <Heart className="w-3 h-3 mr-1" />
                  Encourage Me
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIGuide;