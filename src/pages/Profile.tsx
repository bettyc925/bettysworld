import Navigation from "@/components/Navigation";
import CharacterManager from "@/components/CharacterManager";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Star,
  Settings,
  MapPin,
  Calendar,
  Link as LinkIcon
} from "lucide-react";

const Profile = () => {
  // Mock user data
  const user = {
    name: "Jordan Rivers",
    username: "@jordan_rivers",
    bio: "Digital creator exploring AI companionship and meaningful conversations. Building bridges between human creativity and artificial intelligence. ✨",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=200&fit=crop",
    location: "San Francisco, CA",
    website: "jordanrivers.dev",
    joinDate: "March 2024",
    stats: {
      followers: 1247,
      following: 892,
      posts: 156,
      characters: 3
    }
  };

  const recentPosts = [
    {
      id: "1",
      content: "Just had an amazing philosophical discussion with Aria about the nature of creativity. It's incredible how AI characters can help us explore our own thoughts!",
      timestamp: "2 hours ago",
      likes: 23,
      comments: 5,
      character: "Alex Creative"
    },
    {
      id: "2",
      content: "Working on a new digital art piece with inspiration from my conversations with Luna. The intersection of human creativity and AI insight is fascinating.",
      timestamp: "1 day ago", 
      likes: 41,
      comments: 8,
      character: "Alex Creative"
    },
    {
      id: "3",
      content: "Pro tip: When creating AI characters, give them specific personality traits but leave room for growth. They become more interesting over time!",
      timestamp: "3 days ago",
      likes: 67,
      comments: 12,
      character: "Tech Sage"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Cover Image & Profile Header */}
        <div 
          className="h-48 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${user.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4">
          {/* Profile Info */}
          <div className="relative -mt-16 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-32 h-32 border-4 border-background shadow-cosmic">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    <p className="text-muted-foreground">{user.username}</p>
                  </div>
                  <div className="flex space-x-3 mt-4 md:mt-0">
                    <Button variant="cosmic">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline">
                      <Users className="w-4 h-4 mr-2" />
                      Follow
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-foreground leading-relaxed mb-4 max-w-2xl">
                  {user.bio}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <LinkIcon className="w-4 h-4" />
                    <a href={`https://${user.website}`} className="text-primary hover:underline">
                      {user.website}
                    </a>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {user.joinDate}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex space-x-6 text-sm">
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold">{user.stats.posts}</span>
                    <span className="text-muted-foreground">Posts</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold">{user.stats.followers}</span>
                    <span className="text-muted-foreground">Followers</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold">{user.stats.following}</span>
                    <span className="text-muted-foreground">Following</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold">{user.stats.characters}</span>
                    <span className="text-muted-foreground">Characters</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Recent Posts */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <Card key={post.id} className="p-6 bg-gradient-card backdrop-blur-sm border-border/50 hover:shadow-card transition-all duration-300">
                      <div className="flex items-start space-x-3 mb-3">
                        <Avatar className="w-10 h-10 border border-border/50">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{user.name}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-primary">as {post.character}</span>
                            <Badge variant="outline" className="text-xs">User Character</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm leading-relaxed mb-4">{post.content}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        <button className="flex items-center space-x-2 hover:text-accent transition-colors">
                          <Heart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-primary transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Character Manager */}
            <div className="space-y-6">
              <Card className="p-6 bg-gradient-card backdrop-blur-sm border-border/50">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Star className="w-4 h-4 mr-2 text-primary" />
                  Your Characters
                </h3>
                <CharacterManager />
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;