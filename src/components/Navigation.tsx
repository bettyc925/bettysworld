import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Users, MessageCircle, Search, User, Settings, Bell, LogOut, Music } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Notifications from "./Notifications";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

const Navigation = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

  const handleJoinNow = () => {
    navigate('/register');
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "See you next time!",
      });
      navigate('/');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-cosmic rounded-full animate-glow"></div>
          <span className="text-xl font-bold bg-gradient-cosmic bg-clip-text text-transparent">
            SocialAI
          </span>
        </div>

        {/* Main Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <Home className="w-4 h-4" />
              Home
            </Button>
          </Link>
          <Link to="/characters">
            <Button variant="ghost" size="sm">
              <Users className="w-4 h-4" />
              Characters
            </Button>
          </Link>
          <Link to="/messages">
            <Button variant="ghost" size="sm" className="relative">
              <MessageCircle className="w-4 h-4" />
              Messages
              <Badge variant="default" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-accent text-accent-foreground">
                3
              </Badge>
            </Button>
          </Link>
          <Link to="/discover">
            <Button variant="ghost" size="sm">
              <Search className="w-4 h-4" />
              Discover
            </Button>
          </Link>
          <Link to="/music-party">
            <Button variant="ghost" size="sm">
              <Music className="w-4 h-4" />
              Music Party
            </Button>
          </Link>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4 relative">
          {!loading && (
            <>
              {user ? (
                <>
                  {/* Notifications */}
                  <div className="relative">
                    <Button 
                      variant="glass" 
                      size="sm"
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative"
                    >
                      <Bell className="w-4 h-4" />
                      <Badge variant="default" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-accent text-accent-foreground">
                        3
                      </Badge>
                    </Button>
                    <Notifications 
                      isOpen={showNotifications} 
                      onClose={() => setShowNotifications(false)} 
                    />
                  </div>

                  <Link to="/profile">
                    <Button variant="glass" size="sm">
                      <User className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button variant="glass" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button variant="glass" size="sm" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Button onClick={handleJoinNow}>Join Now</Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;