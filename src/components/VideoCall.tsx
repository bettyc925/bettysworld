import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  ScreenShare, 
  ScreenShareOff,
  MessageCircle,
  Users,
  Settings,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useVideoBackground, type BackgroundMode } from '@/utils/VideoBackgroundProcessor';
import BackgroundSettings from '@/components/BackgroundSettings';

interface VideoCallProps {
  roomId: string;
  onLeave: () => void;
}

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  avatar?: string;
}

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isVideoOn: boolean;
  isAudioOn: boolean;
  isHost: boolean;
}

const VideoCall = ({ roomId, onLeave }: VideoCallProps) => {
  const { user } = useAuth();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showBackgroundSettings, setShowBackgroundSettings] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>('none');
  const [blurAmount, setBlurAmount] = useState(15);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const processedVideoRef = useRef<HTMLVideoElement>(null);
  const chatChannelRef = useRef<any>(null);
  const presenceChannelRef = useRef<any>(null);
  const animationFrameRef = useRef<number>();

  const {
    setBackgroundMode: setProcessorBackgroundMode,
    setBlurAmount: setProcessorBlurAmount,
    setBackgroundImage: setProcessorBackgroundImage,
    processFrame,
    isProcessing
  } = useVideoBackground();

  // Initialize local media
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: true
        });
        
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        toast({
          title: "Camera/Microphone Error",
          description: "Please allow camera and microphone access to join the call",
          variant: "destructive",
        });
      }
    };

    initializeMedia();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Video processing loop for background effects
  useEffect(() => {
    if (!isProcessing || !localVideoRef.current) return;

    const processVideoFrame = () => {
      if (localVideoRef.current && localVideoRef.current.readyState >= 2) {
        const processedCanvas = processFrame(localVideoRef.current);
        
        if (processedCanvas && processedVideoRef.current) {
          // Create a new video stream from the processed canvas
          const canvasStream = processedCanvas.captureStream(30);
          processedVideoRef.current.srcObject = canvasStream;
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(processVideoFrame);
    };

    processVideoFrame();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isProcessing, processFrame]);

  // Set up real-time chat
  useEffect(() => {
    if (!user) return;

    const chatChannel = supabase
      .channel(`video-chat-${roomId}`)
      .on('broadcast', { event: 'message' }, (payload) => {
        const message: ChatMessage = {
          id: payload.payload.id,
          user: payload.payload.user,
          message: payload.payload.message,
          timestamp: new Date(payload.payload.timestamp),
          avatar: payload.payload.avatar
        };
        setChatMessages(prev => [...prev, message]);
      })
      .subscribe();

    chatChannelRef.current = chatChannel;

    return () => {
      supabase.removeChannel(chatChannel);
    };
  }, [roomId, user]);

  // Set up presence tracking
  useEffect(() => {
    if (!user) return;

    const presenceChannel = supabase
      .channel(`video-presence-${roomId}`)
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const participantList: Participant[] = [];
        
        Object.values(state).forEach((presences: any) => {
          presences.forEach((presence: any) => {
            participantList.push({
              id: presence.user_id,
              name: presence.name,
              avatar: presence.avatar,
              isVideoOn: presence.isVideoOn,
              isAudioOn: presence.isAudioOn,
              isHost: presence.isHost
            });
          });
        });
        
        setParticipants(participantList);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('New user joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User left:', leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            user_id: user.id,
            name: user.user_metadata?.display_name || user.email,
            avatar: user.user_metadata?.avatar_url,
            isVideoOn: isVideoOn,
            isAudioOn: isAudioOn,
            isHost: participants.length === 0, // First person is host
            online_at: new Date().toISOString(),
          });
        }
      });

    presenceChannelRef.current = presenceChannel;

    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, [roomId, user, isVideoOn, isAudioOn]);

  const sendChatMessage = async () => {
    if (!newMessage.trim() || !user || !chatChannelRef.current) return;

    const message = {
      id: Date.now().toString(),
      user: user.user_metadata?.display_name || user.email,
      message: newMessage,
      timestamp: new Date().toISOString(),
      avatar: user.user_metadata?.avatar_url
    };

    await chatChannelRef.current.send({
      type: 'broadcast',
      event: 'message',
      payload: message
    });

    setNewMessage('');
  };

  const toggleVideo = async () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
        
        // Update presence
        if (presenceChannelRef.current) {
          await presenceChannelRef.current.track({
            user_id: user?.id,
            name: user?.user_metadata?.display_name || user?.email,
            avatar: user?.user_metadata?.avatar_url,
            isVideoOn: !isVideoOn,
            isAudioOn: isAudioOn,
            isHost: participants.find(p => p.id === user?.id)?.isHost || false,
            online_at: new Date().toISOString(),
          });
        }
      }
    }
  };

  const toggleAudio = async () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
        setIsAudioOn(!isAudioOn);
        
        // Update presence
        if (presenceChannelRef.current) {
          await presenceChannelRef.current.track({
            user_id: user?.id,
            name: user?.user_metadata?.display_name || user?.email,
            avatar: user?.user_metadata?.avatar_url,
            isVideoOn: isVideoOn,
            isAudioOn: !isAudioOn,
            isHost: participants.find(p => p.id === user?.id)?.isHost || false,
            online_at: new Date().toISOString(),
          });
        }
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        // Replace video track with screen share
        if (localStream && localVideoRef.current) {
          const videoTrack = localStream.getVideoTracks()[0];
          if (videoTrack) {
            localStream.removeTrack(videoTrack);
            localStream.addTrack(screenStream.getVideoTracks()[0]);
            localVideoRef.current.srcObject = localStream;
          }
        }
        
        setIsScreenSharing(true);
        
        // Stop screen sharing when user stops it
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          // Switch back to camera
          navigator.mediaDevices.getUserMedia({ video: true })
            .then(cameraStream => {
              if (localStream) {
                const screenTrack = localStream.getVideoTracks()[0];
                localStream.removeTrack(screenTrack);
                localStream.addTrack(cameraStream.getVideoTracks()[0]);
                if (localVideoRef.current) {
                  localVideoRef.current.srcObject = localStream;
                }
              }
            });
        };
      } else {
        // Stop screen sharing manually
        if (localStream) {
          const videoTrack = localStream.getVideoTracks()[0];
          if (videoTrack) {
            videoTrack.stop();
            
            // Switch back to camera
            const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
            localStream.removeTrack(videoTrack);
            localStream.addTrack(cameraStream.getVideoTracks()[0]);
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = localStream;
            }
          }
        }
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
      toast({
        title: "Screen Share Error",
        description: "Unable to start screen sharing",
        variant: "destructive",
      });
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleBackgroundModeChange = (mode: BackgroundMode) => {
    setBackgroundMode(mode);
    setProcessorBackgroundMode(mode);
  };

  const handleBlurAmountChange = (amount: number) => {
    setBlurAmount(amount);
    setProcessorBlurAmount(amount);
  };

  const handleBackgroundImageChange = (imageUrl: string) => {
    setProcessorBackgroundImage(imageUrl);
  };

  const leaveCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    if (presenceChannelRef.current) {
      presenceChannelRef.current.untrack();
    }
    
    onLeave();
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'relative'} bg-gray-900 rounded-lg overflow-hidden`}>
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-white font-semibold">Music Party Call</h3>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {participants.length}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBackgroundSettings(true)}
            className="text-white hover:bg-gray-700"
          >
            <Sparkles className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="text-white hover:bg-gray-700"
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="text-white hover:bg-gray-700"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-700"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex h-96">
        {/* Video Grid */}
        <div className={`${isChatOpen ? 'flex-1' : 'w-full'} relative`}>
          {/* Main Video */}
          <div className="relative h-full bg-gray-800">
            {/* Hidden original video for processing */}
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="hidden"
            />
            
            {/* Processed video (with background effects) */}
            {isProcessing ? (
              <video
                ref={processedVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            )}
            
            {!isVideoOn && (
              <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback>{user?.user_metadata?.display_name?.[0] || user?.email?.[0]}</AvatarFallback>
                </Avatar>
              </div>
            )}
            
            {/* Local Video Label */}
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm flex items-center gap-2">
              You 
              {!isAudioOn && <MicOff className="w-3 h-3" />}
              {backgroundMode !== 'none' && (
                <Badge variant="secondary" className="text-xs">
                  {backgroundMode === 'blur' ? 'Blur' : 'Virtual BG'}
                </Badge>
              )}
            </div>
            
            {isScreenSharing && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                Screen Sharing
              </div>
            )}
          </div>

          {/* Participants Grid */}
          {participants.length > 1 && (
            <div className="absolute top-2 right-2 flex flex-col gap-2 max-w-48">
              {participants
                .filter(p => p.id !== user?.id)
                .slice(0, 3)
                .map((participant) => (
                <div key={participant.id} className="bg-gray-800 rounded-lg overflow-hidden w-32 h-24">
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center relative">
                    {participant.isVideoOn ? (
                      <div className="text-white text-xs">Video</div>
                    ) : (
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback>{participant.name[0]}</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className="absolute bottom-1 left-1 text-white text-xs bg-black/50 px-1 rounded">
                      {participant.name.split(' ')[0]}
                      {!participant.isAudioOn && <MicOff className="w-2 h-2 inline ml-1" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat Sidebar */}
        {isChatOpen && (
          <Card className="w-80 m-0 rounded-none border-l border-t-0 border-b-0 border-r-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Chat</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-full">
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-3">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="flex gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={msg.avatar} />
                        <AvatarFallback>{msg.user[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">{msg.user}</span>
                          <span className="text-xs text-muted-foreground">
                            {msg.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={sendChatMessage}>
                    Send
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Control Bar */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-center gap-3">
        <Button
          variant={isAudioOn ? "secondary" : "destructive"}
          size="sm"
          onClick={toggleAudio}
          className="rounded-full w-10 h-10"
        >
          {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </Button>
        
        <Button
          variant={isVideoOn ? "secondary" : "destructive"}
          size="sm"
          onClick={toggleVideo}
          className="rounded-full w-10 h-10"
        >
          {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
        </Button>
        
        <Button
          variant={isScreenSharing ? "default" : "secondary"}
          size="sm"
          onClick={toggleScreenShare}
          className="rounded-full w-10 h-10"
        >
          {isScreenSharing ? <ScreenShareOff className="w-4 h-4" /> : <ScreenShare className="w-4 h-4" />}
        </Button>
        
        <Button
          variant="destructive"
          size="sm"
          onClick={leaveCall}
          className="rounded-full w-10 h-10 ml-4"
        >
          <PhoneOff className="w-4 h-4" />
        </Button>
      </div>

      {/* Background Settings Modal */}
      <BackgroundSettings
        isOpen={showBackgroundSettings}
        onClose={() => setShowBackgroundSettings(false)}
        currentMode={backgroundMode}
        onModeChange={handleBackgroundModeChange}
        onBlurAmountChange={handleBlurAmountChange}
        onBackgroundImageChange={handleBackgroundImageChange}
        blurAmount={blurAmount}
      />
    </div>
  );
};

export default VideoCall;