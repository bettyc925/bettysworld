import { useState, useEffect } from "react";
import MessageInbox from "@/components/MessageInbox";
import DirectMessage from "@/components/DirectMessage";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface MessageThread {
  id: string;
  user: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isOnline?: boolean;
}

const Messages = () => {
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchConversations();
  }, [user, navigate]);

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          characters(name, avatar_url),
          messages(content, created_at, is_user)
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {selectedThread ? (
            <div className="max-w-4xl mx-auto">
              <button
                onClick={() => setSelectedThread(null)}
                className="mb-4 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ← Back to messages
              </button>
              <div className="h-[600px]">
                <DirectMessage 
                  user={{
                    name: selectedThread.user,
                    avatar: selectedThread.avatar,
                    isOnline: selectedThread.isOnline
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <MessageInbox onSelectThread={setSelectedThread} />
            </div>
          )}
        </div>
      </main>
      {!selectedThread && <Footer />}
    </div>
  );
};

export default Messages;