import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Heart,
  MoreHorizontal,
  Download,
  Share2,
  Plus,
  Music,
  Clock
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  cover: string;
  lyrics?: string;
  genre: string;
  releaseYear: number;
  isLiked: boolean;
  playCount: number;
  audioUrl?: string;
}

interface PlaylistInterfaceProps {
  tracks: Track[];
  title: string;
  description?: string;
  cover?: string;
  onTrackSelect?: (track: Track) => void;
}

const PlaylistInterface = ({ tracks, title, description, cover, onTrackSelect }: PlaylistInterfaceProps) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(tracks[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.audioUrl) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => playNext();

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentTrack]);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    onTrackSelect?.(track);
    
    // Simulate audio playback since we don't have real audio URLs
    toast({
      title: "Now Playing",
      description: `${track.title} by ${track.artist}`
    });
  };

  const togglePlay = () => {
    if (!currentTrack) return;
    
    const audio = audioRef.current;
    if (audio && currentTrack.audioUrl) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (!currentTrack) return;
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    playTrack(tracks[nextIndex]);
  };

  const playPrevious = () => {
    if (!currentTrack) return;
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : tracks.length - 1;
    playTrack(tracks[prevIndex]);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = (value[0] / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleLike = (trackId: string) => {
    // In a real app, this would update the backend
    toast({
      title: "Added to Liked Songs",
      description: "Track saved to your library"
    });
  };

  return (
    <div className="space-y-6">
      {/* Playlist Header */}
      <Card className="bg-gradient-to-r from-primary/20 to-purple-500/20 border-border/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className={`w-48 h-48 rounded-lg ${cover || 'bg-gradient-to-br from-primary to-purple-500'} flex items-center justify-center`}>
              <Music className="w-16 h-16 text-white/80" />
            </div>
            <div className="flex-1">
              <Badge variant="secondary" className="mb-2">Playlist</Badge>
              <h1 className="text-4xl font-bold mb-2">{title}</h1>
              {description && (
                <p className="text-muted-foreground mb-4">{description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{tracks.length} songs</span>
                <span>•</span>
                <span>{tracks.reduce((acc, track) => {
                  const [min, sec] = track.duration.split(':').map(Number);
                  return acc + min * 60 + sec;
                }, 0) / 60 | 0} min</span>
              </div>
              <div className="flex items-center gap-4 mt-6">
                <Button size="lg" onClick={() => currentTrack && togglePlay()}>
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="w-5 h-5 mr-2" />
                  Like
                </Button>
                <Button variant="outline" size="lg">
                  <Download className="w-5 h-5 mr-2" />
                  Download
                </Button>
                <Button variant="ghost" size="lg">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Track List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              Tracks
            </CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add to Queue
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="space-y-1">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-2 text-sm text-muted-foreground border-b">
                <div className="col-span-1">#</div>
                <div className="col-span-4">Title</div>
                <div className="col-span-3">Album</div>
                <div className="col-span-2">Date Added</div>
                <div className="col-span-1">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="col-span-1"></div>
              </div>

              {/* Tracks */}
              {tracks.map((track, index) => (
                <div 
                  key={track.id}
                  className={`grid grid-cols-12 gap-4 px-6 py-3 hover:bg-accent/50 cursor-pointer group transition-colors ${
                    currentTrack?.id === track.id ? 'bg-accent/30' : ''
                  }`}
                  onClick={() => playTrack(track)}
                >
                  <div className="col-span-1 flex items-center">
                    {currentTrack?.id === track.id && isPlaying ? (
                      <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                        <Pause className="w-4 h-4" />
                      </Button>
                    ) : (
                      <div className="group-hover:hidden text-muted-foreground">
                        {index + 1}
                      </div>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-8 h-8 p-0 hidden group-hover:flex"
                      onClick={(e) => {
                        e.stopPropagation();
                        playTrack(track);
                      }}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="col-span-4 flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={track.cover} />
                      <AvatarFallback>
                        <Music className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className={`font-medium ${currentTrack?.id === track.id ? 'text-primary' : ''}`}>
                        {track.title}
                      </div>
                      <div className="text-sm text-muted-foreground">{track.artist}</div>
                    </div>
                  </div>
                  
                  <div className="col-span-3 flex items-center text-sm text-muted-foreground">
                    {track.album}
                  </div>
                  
                  <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                    {track.releaseYear}
                  </div>
                  
                  <div className="col-span-1 flex items-center text-sm text-muted-foreground">
                    {track.duration}
                  </div>
                  
                  <div className="col-span-1 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-8 h-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(track.id);
                      }}
                    >
                      <Heart className={`w-4 h-4 ${track.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-8 h-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTrack(track);
                      }}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Now Playing Bar */}
      {currentTrack && (
        <Card className="fixed bottom-0 left-0 right-0 z-50 rounded-none border-t border-border/50 bg-background/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              {/* Track Info */}
              <div className="flex items-center gap-3 flex-1">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={currentTrack.cover} />
                  <AvatarFallback>
                    <Music className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{currentTrack.title}</div>
                  <div className="text-sm text-muted-foreground">{currentTrack.artist}</div>
                </div>
                <Button variant="ghost" size="sm" className="ml-2">
                  <Heart className={`w-4 h-4 ${currentTrack.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>

              {/* Controls */}
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" onClick={playPrevious}>
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button size="sm" onClick={togglePlay}>
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={playNext}>
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 w-full max-w-md">
                  <span className="text-xs text-muted-foreground w-10 text-right">
                    {formatTime(currentTime)}
                  </span>
                  <Slider
                    value={[duration ? (currentTime / duration) * 100 : 0]}
                    onValueChange={handleSeek}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-10">
                    {currentTrack.duration}
                  </span>
                </div>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-2 flex-1 justify-end">
                <Button variant="ghost" size="sm" onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                <Slider
                  value={isMuted ? [0] : volume}
                  onValueChange={(value) => {
                    setVolume(value);
                    setIsMuted(value[0] === 0);
                  }}
                  max={100}
                  step={1}
                  className="w-24"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden audio element for actual playback */}
      {currentTrack?.audioUrl && (
        <audio ref={audioRef} src={currentTrack.audioUrl} />
      )}
    </div>
  );
};

export default PlaylistInterface;