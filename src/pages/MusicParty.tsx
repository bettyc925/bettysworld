import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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
  Plus
} from "lucide-react";
import Footer from "@/components/Footer";

const MusicParty = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState("Midnight Vibes");
  const [activeRoom, setActiveRoom] = useState("lofi-chill");

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
    },
    {
      id: "indie-acoustic",
      name: "Indie Acoustic",
      description: "Indie folk and acoustic sessions",
      listeners: 156,
      host: "AcousticSoul",
      currentSong: "Forest Echoes",
      tags: ["indie", "acoustic", "folk"],
      avatar: "/placeholder.svg"
    },
    {
      id: "jazz-lounge",
      name: "Jazz Lounge",
      description: "Smooth jazz for sophisticated evenings",
      listeners: 98,
      host: "JazzMaster",
      currentSong: "Blue Note Serenade",
      tags: ["jazz", "smooth", "lounge"],
      avatar: "/placeholder.svg"
    }
  ];

  const recentActivity = [
    { user: "MusicLover23", action: "joined", room: "Lofi & Chill", time: "2m ago" },
    { user: "VibeMaster", action: "liked", song: "Midnight Vibes", time: "5m ago" },
    { user: "ChillSeeker", action: "requested", song: "Ocean Waves", time: "8m ago" },
    { user: "BeatDrop", action: "joined", room: "Electronic Night", time: "12m ago" }
  ];

  const playlist = [
    { title: "Midnight Vibes", artist: "Chill Collective", duration: "3:24", isPlaying: true },
    { title: "Neon Dreams", artist: "SynthWave", duration: "4:12", isPlaying: false },
    { title: "Forest Echoes", artist: "Nature Sounds", duration: "2:58", isPlaying: false },
    { title: "City Lights", artist: "Urban Beats", duration: "3:45", isPlaying: false },
    { title: "Cosmic Journey", artist: "Space Ambient", duration: "5:33", isPlaying: false }
  ];

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/20 pt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center">
                <PartyPopper className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Music Party
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join live music rooms, discover new tracks, and vibe with the community in real-time
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="rooms" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
              <TabsTrigger value="rooms" className="flex items-center gap-2">
                <Radio className="w-4 h-4" />
                Live Rooms
              </TabsTrigger>
              <TabsTrigger value="player" className="flex items-center gap-2">
                <Headphones className="w-4 h-4" />
                Player
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Activity
              </TabsTrigger>
            </TabsList>

            {/* Live Rooms Tab */}
            <TabsContent value="rooms" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Live Music Rooms</h2>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Room
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {musicRooms.map((room) => (
                  <Card key={room.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{room.name}</CardTitle>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {room.listeners}
                        </Badge>
                      </div>
                      <CardDescription>{room.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Host Info */}
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={room.avatar} />
                            <AvatarFallback><Mic className="w-3 h-3" /></AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">Hosted by {room.host}</span>
                        </div>

                        {/* Current Song */}
                        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                          <Music className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">{room.currentSong}</span>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {room.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Join Button */}
                        <Button 
                          className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                          variant={activeRoom === room.id ? "default" : "outline"}
                          onClick={() => setActiveRoom(room.id)}
                        >
                          {activeRoom === room.id ? "Listening" : "Join Room"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Music Player Tab */}
            <TabsContent value="player" className="space-y-6">
              <div className="max-w-2xl mx-auto">
                {/* Now Playing Card */}
                <Card className="mb-6">
                  <CardHeader className="text-center">
                    <div className="w-48 h-48 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <Music className="w-16 h-16 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{currentSong}</CardTitle>
                    <CardDescription>by Chill Collective</CardDescription>
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
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <Button variant="ghost" size="sm">
                        <SkipBack className="w-5 h-5" />
                      </Button>
                      <Button 
                        onClick={togglePlay} 
                        size="lg" 
                        className="w-12 h-12 rounded-full"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <SkipForward className="w-5 h-5" />
                      </Button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Playlist */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Music className="w-5 h-5" />
                      Up Next
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {playlist.map((song, index) => (
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
                          <div className="flex-1">
                            <p className="font-medium text-sm">{song.title}</p>
                            <p className="text-xs text-muted-foreground">{song.artist}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{song.duration}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <div className="max-w-2xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>What's happening in the music community</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center gap-3 p-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-medium">{activity.user}</span>
                              <span className="text-muted-foreground"> {activity.action} </span>
                              <span className="font-medium">
                                {activity.room || activity.song}
                              </span>
                            </p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <div className="flex items-center gap-2 mb-4">
                        <MessageCircle className="w-4 h-4" />
                        <span className="font-medium">Quick Chat</span>
                      </div>
                      <div className="flex gap-2">
                        <Input placeholder="Share your thoughts about the music..." className="flex-1" />
                        <Button size="sm">Send</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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