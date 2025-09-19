import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle, Star, Heart, Share2, Eye, Sparkles } from "lucide-react";

interface CharacterCardProps {
  name: string;
  description: string;
  avatar: string;
  followers: string;
  category: string;
  isOnline?: boolean;
  rating?: number;
  totalChats?: number;
  totalViews?: number;
}

const CharacterCard = ({ 
  name, 
  description, 
  avatar, 
  followers, 
  category, 
  isOnline = false, 
  rating = 0, 
  totalChats = 0, 
  totalViews = 0 
}: CharacterCardProps) => {
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
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
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

        {/* Enhanced Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {followers}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {totalChats.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            {rating.toFixed(1)}
          </span>
        </div>
        
        <div className="text-xs text-muted-foreground mb-4 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {totalViews.toLocaleString()} views
          </span>
          <div className="flex gap-2">
            <button className="hover:text-accent transition-colors">
              <Heart className="w-3 h-3" />
            </button>
            <button className="hover:text-cyber transition-colors">
              <Share2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Action Button */}
        <Button variant="cyber" className="w-full group-hover:shadow-cosmic">
          <MessageCircle className="w-4 h-4 mr-2" />
          Start Chat
        </Button>
      </div>
    </div>
  );
};

export default CharacterCard;