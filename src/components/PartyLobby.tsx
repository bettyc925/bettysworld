import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Users, 
  Lock, 
  Unlock,
  Music,
  Settings,
  PartyPopper,
  Calendar,
  Clock,
  Globe,
  Copy,
  Check
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface PartyLobbyProps {
  onJoinCall: (roomId: string) => void;
}

interface PartyRoom {
  id: string;
  name: string;
  description: string;
  host: string;
  participants: number;
  maxParticipants: number;
  isPrivate: boolean;
  musicGenre: string;
  createdAt: Date;
  roomCode?: string;
}

const PartyLobby = ({ onJoinCall }: PartyLobbyProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("join");
  const [rooms, setRooms] = useState<PartyRoom[]>([]);
  const [roomCode, setRoomCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Create room form state
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [isPrivateRoom, setIsPrivateRoom] = useState(false);
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [musicGenre, setMusicGenre] = useState('');

  // Media settings
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockRooms: PartyRoom[] = [
      {
        id: 'room-1',
        name: 'Lofi & Chill Party',
        description: 'Relaxing beats and good vibes',
        host: 'DJ_Luna',
        participants: 8,
        maxParticipants: 15,
        isPrivate: false,
        musicGenre: 'Lofi',
        createdAt: new Date(Date.now() - 30 * 60000),
        roomCode: 'LOFI123'
      },
      {
        id: 'room-2',
        name: 'Electronic Dance Night',
        description: 'High energy EDM session',
        host: 'ElectroMax',
        participants: 12,
        maxParticipants: 20,
        isPrivate: false,
        musicGenre: 'Electronic',
        createdAt: new Date(Date.now() - 45 * 60000),
        roomCode: 'EDM456'
      },
      {
        id: 'room-3',
        name: 'Private Jazz Lounge',
        description: 'Intimate jazz session',
        host: 'JazzMaster',
        participants: 5,
        maxParticipants: 8,
        isPrivate: true,
        musicGenre: 'Jazz',
        createdAt: new Date(Date.now() - 60 * 60000),
        roomCode: 'JAZZ789'
      }
    ];
    setRooms(mockRooms);
  }, []);

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createRoom = async () => {
    if (!user || !roomName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a room name",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    
    try {
      const newRoom: PartyRoom = {
        id: `room-${Date.now()}`,
        name: roomName,
        description: roomDescription,
        host: user.user_metadata?.display_name || user.email || 'Anonymous',
        participants: 0,
        maxParticipants: maxParticipants,
        isPrivate: isPrivateRoom,
        musicGenre: musicGenre,
        createdAt: new Date(),
        roomCode: generateRoomCode()
      };

      // In a real app, you'd save this to Supabase
      setRooms(prev => [newRoom, ...prev]);
      
      toast({
        title: "Room Created!",
        description: `Your room "${roomName}" has been created`,
      });

      // Auto-join the created room
      onJoinCall(newRoom.id);
      
    } catch (error) {
      console.error('Error creating room:', error);
      toast({
        title: "Error",
        description: "Failed to create room",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const joinRoomByCode = () => {
    if (!roomCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a room code",
        variant: "destructive",
      });
      return;
    }

    const room = rooms.find(r => r.roomCode === roomCode.toUpperCase());
    if (!room) {
      toast({
        title: "Room Not Found",
        description: "Invalid room code",
        variant: "destructive",
      });
      return;
    }

    onJoinCall(room.id);
  };

  const copyRoomCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Room code copied to clipboard",
    });
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <PartyPopper className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Music Party Lobby</h1>
        <p className="text-muted-foreground">Join or create live music parties with video chat</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="join">Join Party</TabsTrigger>
          <TabsTrigger value="create">Create Party</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Join Party Tab */}
        <TabsContent value="join" className="space-y-6">
          {/* Quick Join by Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="w-5 h-5" />
                Quick Join
              </CardTitle>
              <CardDescription>Enter a room code to join instantly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter room code (e.g., LOFI123)"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="flex-1"
                />
                <Button onClick={joinRoomByCode}>Join</Button>
              </div>
            </CardContent>
          </Card>

          {/* Available Rooms */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Available Parties</h3>
            <div className="grid gap-4">
              {rooms.filter(room => !room.isPrivate).map((room) => (
                <Card key={room.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{room.name}</h4>
                          <Badge variant="secondary">{room.musicGenre}</Badge>
                          {room.isPrivate && <Lock className="w-4 h-4 text-muted-foreground" />}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{room.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {room.participants}/{room.maxParticipants}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getTimeAgo(room.createdAt)}
                          </span>
                          <span>Host: {room.host}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyRoomCode(room.roomCode!)}
                          className="flex items-center gap-1"
                        >
                          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {room.roomCode}
                        </Button>
                        <Button 
                          onClick={() => onJoinCall(room.id)}
                          disabled={room.participants >= room.maxParticipants}
                        >
                          Join Party
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Create Party Tab */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Party</CardTitle>
              <CardDescription>Set up your own music party room</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="room-name">Party Name</Label>
                <Input
                  id="room-name"
                  placeholder="Enter party name"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="room-description">Description</Label>
                <Input
                  id="room-description"
                  placeholder="Describe your party"
                  value={roomDescription}
                  onChange={(e) => setRoomDescription(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="music-genre">Music Genre</Label>
                <Input
                  id="music-genre"
                  placeholder="e.g., Lofi, Electronic, Jazz"
                  value={musicGenre}
                  onChange={(e) => setMusicGenre(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="max-participants">Max Participants</Label>
                <Input
                  id="max-participants"
                  type="number"
                  min="2"
                  max="50"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(parseInt(e.target.value) || 10)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="private-room"
                  checked={isPrivateRoom}
                  onCheckedChange={setIsPrivateRoom}
                />
                <Label htmlFor="private-room" className="flex items-center gap-2">
                  {isPrivateRoom ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  Private Room
                </Label>
              </div>

              <Button 
                onClick={createRoom} 
                disabled={isCreating || !roomName.trim()}
                className="w-full"
              >
                {isCreating ? 'Creating...' : 'Create Party'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Media Settings
              </CardTitle>
              <CardDescription>Configure your camera and microphone settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  <Label>Camera</Label>
                </div>
                <Switch
                  checked={videoEnabled}
                  onCheckedChange={setVideoEnabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  <Label>Microphone</Label>
                </div>
                <Switch
                  checked={audioEnabled}
                  onCheckedChange={setAudioEnabled}
                />
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Preferences</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Auto-join with camera {videoEnabled ? 'on' : 'off'}</p>
                  <p>• Auto-join with microphone {audioEnabled ? 'on' : 'off'}</p>
                  <p>• Receive party invitations: Enabled</p>
                  <p>• Show online status: Enabled</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PartyLobby;