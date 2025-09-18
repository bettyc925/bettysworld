import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Music, 
  Upload,
  Shuffle,
  Repeat
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
}

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([50]);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [customTracks, setCustomTracks] = useState<Track[]>([]);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default ambient tracks for the SocialAI experience
  const defaultTracks: Track[] = [
    {
      id: "1",
      title: "Cosmic Conversations",
      artist: "AI Ambient",
      url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
      duration: 180
    },
    {
      id: "2", 
      title: "Digital Dreams",
      artist: "Synthetic Symphony",
      url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
      duration: 220
    },
    {
      id: "3",
      title: "Neural Networks",
      artist: "Echo Chamber",
      url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
      duration: 195
    }
  ];

  const allTracks = [...defaultTracks, ...customTracks];
  const currentTrack = allTracks[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (isRepeating) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentTrackIndex, isRepeating]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = (value[0] / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    setVolume(value);
    audio.volume = value[0] / 100;
    setIsMuted(value[0] === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isMuted) {
      audio.volume = volume[0] / 100;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handlePrevious = () => {
    const newIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : allTracks.length - 1;
    setCurrentTrackIndex(newIndex);
  };

  const handleNext = () => {
    if (isShuffled) {
      const randomIndex = Math.floor(Math.random() * allTracks.length);
      setCurrentTrackIndex(randomIndex);
    } else {
      const newIndex = currentTrackIndex < allTracks.length - 1 ? currentTrackIndex + 1 : 0;
      setCurrentTrackIndex(newIndex);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an audio file",
        variant: "destructive"
      });
      return;
    }

    const url = URL.createObjectURL(file);
    const newTrack: Track = {
      id: Date.now().toString(),
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Custom Upload",
      url,
      duration: 0 // Will be set when metadata loads
    };

    setCustomTracks(prev => [...prev, newTrack]);
    toast({
      title: "Track uploaded",
      description: `${newTrack.title} has been added to your playlist`
    });
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 text-primary" />
              <span className="font-semibold">Music Player</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {currentTrack && (
            <>
              <audio ref={audioRef} src={currentTrack.url} />
              
              {/* Track Info */}
              <div className="text-center mb-4">
                <h3 className="font-semibold text-lg">{currentTrack.title}</h3>
                <p className="text-muted-foreground">{currentTrack.artist}</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 mb-4">
                <Slider
                  value={[duration ? (currentTime / duration) * 100 : 0]}
                  onValueChange={handleSeek}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <Button
                  variant={isShuffled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsShuffled(!isShuffled)}
                >
                  <Shuffle className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" size="sm" onClick={handlePrevious}>
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <Button size="lg" onClick={togglePlay}>
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </Button>
                
                <Button variant="outline" size="sm" onClick={handleNext}>
                  <SkipForward className="h-4 w-4" />
                </Button>
                
                <Button
                  variant={isRepeating ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsRepeating(!isRepeating)}
                >
                  <Repeat className="h-4 w-4" />
                </Button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={toggleMute}>
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <Slider
                  value={isMuted ? [0] : volume}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="flex-1"
                />
              </div>
            </>
          )}

          {/* Track Selection */}
          {allTracks.length > 0 && (
            <div className="mt-4">
              <Select
                value={currentTrackIndex.toString()}
                onValueChange={(value) => setCurrentTrackIndex(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a track" />
                </SelectTrigger>
                <SelectContent>
                  {allTracks.map((track, index) => (
                    <SelectItem key={track.id} value={index.toString()}>
                      {track.title} - {track.artist}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicPlayer;