import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Share, Sparkles } from "lucide-react";

interface CharacterCardProps {
  name: string;
  description: string;
  avatar: string;
  followers: string;
  category: string;
  isOnline?: boolean;
}

const CharacterCard = ({ name, description, avatar, followers, category, isOnline = true }: CharacterCardProps) => {
  return (
    <div className="group relative bg-gradient-card backdrop-blur-sm rounded-2xl border border-border/50 p-6 hover:shadow-cosmic transition-all duration-500 hover:scale-105 overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Avatar and Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            <img 
              src={avatar} 
              alt={name}
              className="w-16 h-16 rounded-full border-2 border-primary/30 group-hover:border-primary transition-all duration-300"
            />
            {isOnline && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-cyber rounded-full border-2 border-card flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-background" />
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
            {category}
          </div>
        </div>

        {/* Character Info */}
        <div className="mb-4">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
          <span>{followers} followers</span>
          <div className="flex items-center space-x-4">
            <button className="hover:text-accent transition-colors">
              <Heart className="w-4 h-4" />
            </button>
            <button className="hover:text-cyber transition-colors">
              <Share className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Button */}
        <Button variant="cyber" className="w-full group-hover:shadow-cosmic">
          <MessageCircle className="w-4 h-4" />
          Start Chat
        </Button>
      </div>
    </div>
  );
};

export default CharacterCard;