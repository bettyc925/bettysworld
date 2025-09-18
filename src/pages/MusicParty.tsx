import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Music, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  Heart, 
  Share2, 
  Users, 
  Radio,
  Headphones,
  Mic,
  PartyPopper,
  Clock,
  Star,
  MessageCircle,
  Plus,
  Video,
  Calendar,
  Search,
  Grid3X3,
  TrendingUp,
  Sparkles,
  Bot,
  ChevronRight,
  Download,
  MoreHorizontal,
  Shuffle,
  Repeat
} from "lucide-react";
import Footer from "@/components/Footer";
import VideoCall from "@/components/VideoCall";
import PartyLobby from "@/components/PartyLobby";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface MusicRecommendation {
  title: string;
  artist: string;
  genre: string;
  mood: string;
  description: string;
  duration: string;
  spotifyId: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  cover: string;
  tracks: number;
  duration: string;
  creator: string;
  isAiGenerated?: boolean;
}

interface Genre {
  id: string;
  name: string;
  color: string;
  description: string;
  tracks: number;
}

const MusicParty = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState("Midnight Vibes");
  const [activeRoom, setActiveRoom] = useState("lofi-chill");
  const [inCall, setInCall] = useState(false);
  const [currentCallRoom, setCurrentCallRoom] = useState<string | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<MusicRecommendation[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for music parties
  const musicRooms = [
    {
      id: "lofi-chill",
      name: "Lofi & Chill",
      description: "Relaxing beats for late night vibes",
      listeners: 234,
      host: "DJ_Luna",
      currentSong: "Midnight Vibes",
      tags: ["lofi", "chill", "study"],
      avatar: "/placeholder.svg"
    },
    {
      id: "electronic-night",
      name: "Electronic Night",
      description: "High energy electronic dance music",
      listeners: 187,
      host: "ElectroMax",
      currentSong: "Neon Dreams",
      tags: ["electronic", "dance", "upbeat"],
      avatar: "/placeholder.svg"
    }
  ];

  // Spotify-like genres
  const genres: Genre[] = [
    { id: "pop", name: "Pop", color: "bg-gradient-to-br from-pink-500 to-rose-500", description: "Chart-topping hits", tracks: 1234 },
    { id: "rock", name: "Rock", color: "bg-gradient-to-br from-red-600 to-orange-600", description: "Classic and modern rock", tracks: 2156 },
    { id: "hiphop", name: "Hip Hop", color: "bg-gradient-to-br from-purple-600 to-indigo-600", description: "Beats and rhymes", tracks: 1876 },
    { id: "electronic", name: "Electronic", color: "bg-gradient-to-br from-cyan-500 to-blue-500", description: "Electronic dance music", tracks: 987 },
    { id: "jazz", name: "Jazz", color: "bg-gradient-to-br from-amber-600 to-yellow-600", description: "Smooth jazz classics", tracks: 654 },
    { id: "classical", name: "Classical", color: "bg-gradient-to-br from-emerald-600 to-green-600", description: "Orchestral masterpieces", tracks: 432 },
    { id: "indie", name: "Indie", color: "bg-gradient-to-br from-violet-600 to-purple-600", description: "Independent artists", tracks: 1543 },
    { id: "ambient", name: "Ambient", color: "bg-gradient-to-br from-slate-600 to-gray-600", description: "Atmospheric soundscapes", tracks: 321 }
  ];

  // Featured playlists
  const featuredPlaylists: Playlist[] = [
    {
      id: "ai-daily-mix",
      name: "AI Daily Mix",
      description: "Your personalized daily playlist powered by AI",
      cover: "bg-gradient-to-br from-primary to-purple-500",
      tracks: 50,
      duration: "3h 24m",
      creator: "AI Curator",
      isAiGenerated: true
    },
    {
      id: "trending-now",
      name: "Trending Now",
      description: "What everyone's listening to right now",
      cover: "bg-gradient-to-br from-orange-500 to-red-500",
      tracks: 30,
      duration: "2h 12m",
      creator: "SocialAI"
    },
    {
      id: "chill-vibes",
      name: "Chill Vibes",
      description: "Perfect for relaxing and unwinding",
      cover: "bg-gradient-to-br from-blue-400 to-cyan-400",
      tracks: 25,
      duration: "1h 45m",
      creator: "Community"
    },
    {
      id: "focus-flow",
      name: "Focus Flow",
      description: "Music to help you concentrate and be productive",
      cover: "bg-gradient-to-br from-green-500 to-emerald-500",
      tracks: 40,
      duration: "2h 56m",
      creator: "AI Curator",
      isAiGenerated: true
    },
    {
      id: "workout-energy",
      name: "Workout Energy",
      description: "High-energy tracks to fuel your workout",
      cover: "bg-gradient-to-br from-yellow-500 to-orange-500",
      tracks: 35,
      duration: "2h 18m",
      creator: "Fitness Pro"
    },
    {
      id: "night-moods",
      name: "Night Moods",
      description: "Late night listening for deep thoughts",
      cover: "bg-gradient-to-br from-indigo-600 to-purple-600",
      tracks: 28,
      duration: "1h 58m",
      creator: "AI Curator",
      isAiGenerated: true
    }
  ];

  const recentActivity = [
    { user: "MusicLover23", action: "liked", song: "Midnight Vibes", time: "2m ago" },
    { user: "VibeMaster", action: "added to playlist", song: "Ocean Waves", time: "5m ago" },
    { user: "ChillSeeker", action: "shared", song: "Forest Echoes", time: "8m ago" },
    { user: "BeatDrop", action: "discovered", song: "Cosmic Journey", time: "12m ago" }
  ];

  const currentPlaylist = [
    { title: "Midnight Vibes", artist: "Chill Collective", duration: "3:24", isPlaying: true },
    { title: "Neon Dreams", artist: "SynthWave", duration: "4:12", isPlaying: false },
    { title: "Forest Echoes", artist: "Nature Sounds", duration: "2:58", isPlaying: false },
    { title: "City Lights", artist: "Urban Beats", duration: "3:45", isPlaying: false },
    { title: "Cosmic Journey", artist: "Space Ambient", duration: "5:33", isPlaying: false }
  ];

  const generateAIRecommendations = async (mood?: string, selectedGenres?: string[]) => {
    setLoadingRecommendations(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-music-recommendations', {
        body: {
          mood: mood || "relaxed",
          genres: selectedGenres || ["ambient", "electronic"],
          currentlyPlaying: currentSong,
          preferences: "SocialAI user looking for unique and engaging music"
        }
      });

      if (error) {
        console.error('Error getting AI recommendations:', error);
        // Still show fallback recommendations
        setAiRecommendations([]);
        toast({
          title: "Using Curated Recommendations",
          description: "AI service temporarily unavailable, showing curated picks",
        });
        return;
      }

      setAiRecommendations(data.recommendations || []);
      
      // Show different messages based on whether it's fallback or AI-generated
      if (data.fallback) {
        toast({
          title: "Curated Recommendations Ready",
          description: data.message || "Showing hand-picked recommendations while AI is unavailable"
        });
      } else {
        toast({
          title: "AI Recommendations Generated",
          description: `Found ${data.recommendations?.length || 0} perfect tracks for you!`
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setAiRecommendations([]);
      toast({
        title: "Recommendations Available",
        description: "Showing curated music picks for you",
      });
    } finally {
      setLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    // Generate initial AI recommendations
    generateAIRecommendations();
  }, []);

  const joinCall = (roomId: string) => {
    setCurrentCallRoom(roomId);
    setInCall(true);
  };

  const leaveCall = () => {
    setInCall(false);
    setCurrentCallRoom(null);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Show video call interface if in a call
  if (inCall && currentCallRoom) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-16">
          <VideoCall roomId={currentCallRoom} onLeave={leaveCall} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/20 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Music Studio
                </span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover, create, and share music with AI-powered recommendations
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="cosmic" size="lg" onClick={() => generateAIRecommendations()}>
                <Sparkles className="w-4 h-4 mr-2" />
                AI Discover
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search for songs, artists, or playlists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/80 backdrop-blur-sm"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="home" className="space-y-8">
            <TabsList className="grid w-full grid-cols-5 max-w-2xl mx-auto">
              <TabsTrigger value="home" className="flex items-center gap-2">
                <Music className="w-4 h-4" />
                Home
              </TabsTrigger>
              <TabsTrigger value="genres" className="flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" />
                Genres
              </TabsTrigger>
              <TabsTrigger value="ai-studio" className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                AI Studio
              </TabsTrigger>
              <TabsTrigger value="party" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Live Party
              </TabsTrigger>
              <TabsTrigger value="player" className="flex items-center gap-2">
                <Headphones className="w-4 h-4" />
                Now Playing
              </TabsTrigger>
            </TabsList>

            {/* Home Tab - Spotify-like Dashboard */}
            <TabsContent value="home" className="space-y-8">
              {/* Quick Actions */}
              <div className="flex gap-4 mb-8">
                <Button variant="outline" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Trending
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Favorites
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Recently Played
                </Button>
              </div>

              {/* Featured Playlists */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Featured Playlists</h2>
                  <Button variant="ghost" className="flex items-center gap-1">
                    Show all <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <ScrollArea className="w-full">
                  <div className="flex space-x-4 pb-4">
                    {featuredPlaylists.map((playlist) => (
                      <Card key={playlist.id} className="min-w-[280px] group hover:shadow-lg transition-all duration-300 cursor-pointer">
                        <CardContent className="p-0">
                          <div className={`aspect-square ${playlist.cover} rounded-t-lg relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button size="lg" className="rounded-full w-12 h-12">
                                <Play className="w-6 h-6" />
                              </Button>
                            </div>
                            {playlist.isAiGenerated && (
                              <Badge className="absolute top-2 right-2 bg-primary/90 backdrop-blur-sm">
                                <Bot className="w-3 h-3 mr-1" />
                                AI
                              </Badge>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold mb-1">{playlist.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{playlist.description}</p>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{playlist.tracks} tracks</span>
                              <span>{playlist.duration}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* AI Recommendations */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">AI Recommendations</h2>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Powered by AI
                    </Badge>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => generateAIRecommendations()}
                    disabled={loadingRecommendations}
                  >
                    {loadingRecommendations ? "Generating..." : "Refresh"}
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {aiRecommendations.map((rec, index) => (
                    <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm mb-1">{rec.title}</h3>
                            <p className="text-xs text-muted-foreground mb-1">{rec.artist}</p>
                            <Badge variant="outline" className="text-xs">{rec.genre}</Badge>
                          </div>
                          <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{rec.description}</p>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>{rec.duration}</span>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="w-6 h-6 p-0">
                              <Heart className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="w-6 h-6 p-0">
                              <MoreHorizontal className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Genres Tab */}
            <TabsContent value="genres" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Browse by Genre</h2>
                <p className="text-muted-foreground">Discover music across different styles and moods</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {genres.map((genre) => (
                  <Card key={genre.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
                    <CardContent className="p-0">
                      <div className={`aspect-square ${genre.color} relative flex items-end p-4`}>
                        <div className="text-white">
                          <h3 className="font-bold text-lg mb-1">{genre.name}</h3>
                          <p className="text-xs opacity-90">{genre.tracks} tracks</p>
                        </div>
                        <div className="absolute top-4 right-4 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Music className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* AI Studio Tab */}
            <TabsContent value="ai-studio" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">AI Music Studio</h2>
                <p className="text-muted-foreground">Let AI curate the perfect music experience for you</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="w-5 h-5" />
                      Mood-Based Recommendations
                    </CardTitle>
                    <CardDescription>Tell AI your current mood and get personalized music</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      {["Happy", "Sad", "Energetic", "Relaxed", "Focused", "Creative"].map((mood) => (
                        <Button
                          key={mood}
                          variant="outline"
                          size="sm"
                          onClick={() => generateAIRecommendations(mood.toLowerCase())}
                          disabled={loadingRecommendations}
                        >
                          {mood}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      AI Playlist Generator
                    </CardTitle>
                    <CardDescription>Create custom playlists based on your preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full" disabled={loadingRecommendations}>
                      <Plus className="w-4 h-4 mr-2" />
                      Generate New Playlist
                    </Button>
                    <div className="text-center text-sm text-muted-foreground">
                      AI will analyze your listening history and create a unique playlist
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Party Lobby Tab */}
            <TabsContent value="party">
              <PartyLobby onJoinCall={joinCall} />
            </TabsContent>

            {/* Now Playing Tab */}
            <TabsContent value="player" className="space-y-6">
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Now Playing Card */}
                  <Card className="md:col-span-2">
                    <CardHeader className="text-center">
                      <div className="w-64 h-64 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <Music className="w-24 h-24 text-primary" />
                      </div>
                      <CardTitle className="text-2xl">{currentSong}</CardTitle>
                      <CardDescription className="text-lg">by Chill Collective</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Progress Bar */}
                      <div className="w-full bg-muted h-2 rounded-full mb-4">
                        <div className="bg-primary h-2 rounded-full w-1/3 transition-all duration-300"></div>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground mb-6">
                        <span>1:24</span>
                        <span>3:24</span>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-center gap-6 mb-6">
                        <Button variant="ghost" size="sm">
                          <Shuffle className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <SkipBack className="w-6 h-6" />
                        </Button>
                        <Button 
                          onClick={togglePlay} 
                          size="lg" 
                          className="w-16 h-16 rounded-full"
                        >
                          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <SkipForward className="w-6 h-6" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Repeat className="w-5 h-5" />
                        </Button>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-center gap-4">
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          Like
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Save
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                          <Share2 className="w-4 h-4" />
                          Share
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Volume2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Queue */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Music className="w-5 h-5" />
                        Up Next
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[400px]">
                        <div className="space-y-3">
                          {currentPlaylist.map((song, index) => (
                            <div 
                              key={index}
                              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                                song.isPlaying ? 'bg-muted' : ''
                              }`}
                            >
                              <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                                {song.isPlaying ? (
                                  <Play className="w-3 h-3 text-primary" />
                                ) : (
                                  <Music className="w-3 h-3" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{song.title}</p>
                                <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                              </div>
                              <span className="text-xs text-muted-foreground">{song.duration}</span>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MusicParty;