import { useState } from "react";
import Navigation from "@/components/Navigation";
import MessageInbox from "@/components/MessageInbox";
import DirectMessage from "@/components/DirectMessage";
import Footer from "@/components/Footer";

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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
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