import { useState } from "react";
import Navigation from "@/components/Navigation";
import CharacterCard from "@/components/CharacterCard";
import ChatInterface from "@/components/ChatInterface";
import SocialFeed from "@/components/SocialFeed";
import LandingFeatures from "@/components/LandingFeatures";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Users, MessageSquare } from "lucide-react";

// Import character images
import character1 from "@/assets/ai-character-1.jpg";
import character2 from "@/assets/ai-character-2.jpg";
import character3 from "@/assets/ai-character-3.jpg";

const characters = [
  {
    name: "Aria",
    description: "A wise and ethereal AI companion who loves discussing philosophy, creativity, and the mysteries of consciousness. She offers profound insights with a gentle, cosmic perspective.",
    avatar: character1,
    followers: "12.5K",
    category: "Philosophy",
  },
  {
    name: "Zephyr",
    description: "A cyberpunk tech expert and digital artist who can help with coding, design, and exploring the intersection of technology and creativity in the digital age.",
    avatar: character2,
    followers: "8.2K",
    category: "Technology",
  },
  {
    name: "Luna",
    description: "A magical storyteller who weaves enchanting tales and helps with creative writing, world-building, and exploring the realms of imagination and fantasy.",
    avatar: character3,
    followers: "15.7K",
    category: "Creative",
  },
];

const Index = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [activeTab, setActiveTab] = useState("discover");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Main Content */}
      <main className="pt-16">
        {selectedCharacter ? (
          // Chat View
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-4">
              <Button
                variant="ghost"
                onClick={() => setSelectedCharacter(null)}
                className="mb-4"
              >
                ← Back to Characters
              </Button>
            </div>
            <div className="h-[600px]">
              <ChatInterface character={selectedCharacter} />
            </div>
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-glow">
              <div className="container mx-auto px-4 py-20 text-center">
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
                    <span className="bg-gradient-cosmic bg-clip-text text-transparent">
                      Social AI
                    </span>
                    <br />
                    <span className="text-foreground">Reimagined</span>
                  </h1>
                  <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up leading-relaxed">
                    Create AI characters that co-post with you, join topic-based Circles, and experience 
                    meaningful conversations with built-in safety. Entertainment and creative companionship — 
                    <span className="font-semibold"> not professional advice</span>.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
                    <Button variant="cosmic" size="lg" className="text-lg px-8 py-4">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Request Beta Access
                    </Button>
                    <Button variant="glass" size="lg" className="text-lg px-8 py-4">
                      <Users className="w-5 h-5 mr-2" />
                      See How It Works
                    </Button>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Private beta • Safety-first design • Creator-friendly
                  </p>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float"></div>
              <div className="absolute bottom-20 right-10 w-32 h-32 bg-cyber/20 rounded-full blur-xl animate-float" style={{ animationDelay: "1s" }}></div>
              <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-accent/20 rounded-full blur-xl animate-float" style={{ animationDelay: "2s" }}></div>
            </section>

            {/* Social Proof */}
            <section className="py-12 border-t border-border/50 bg-card/30">
              <div className="container mx-auto px-4">
                <p className="text-center text-sm text-muted-foreground">
                  Built with modern AI safety practices • Creator-friendly • Mobile-first design
                </p>
              </div>
            </section>

            {/* Landing Features - New comprehensive sections */}
            <LandingFeatures />

            {/* Original Demo Sections - Now as interactive preview */}
            <section className="py-16 border-t border-border/50">
              <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">
                    <span className="bg-gradient-cosmic bg-clip-text text-transparent">Try the experience</span>
                  </h2>
                  <p className="text-muted-foreground">Get a preview of AI character interactions</p>
                </div>

                <div className="flex justify-center space-x-8">
                  <button
                    onClick={() => setActiveTab("discover")}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                      activeTab === "discover"
                        ? "bg-primary text-primary-foreground shadow-glow"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Meet Characters
                  </button>
                  <button
                    onClick={() => setActiveTab("social")}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                      activeTab === "social"
                        ? "bg-primary text-primary-foreground shadow-glow"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Community Posts
                  </button>
                  <button
                    onClick={() => setActiveTab("music")}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                      activeTab === "music"
                        ? "bg-primary text-primary-foreground shadow-glow"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Music Party
                  </button>
                </div>
              </div>
            </section>

            {/* Interactive Demo Content */}
            <section className="py-12">
              <div className="container mx-auto px-4">
                {activeTab === "discover" ? (
                  <div>
                    <div className="text-center mb-8">
                      <h3 className="text-xl font-semibold mb-2">Meet Your AI Companions</h3>
                      <p className="text-muted-foreground">Click any character to start a conversation</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                      {characters.map((character, index) => (
                        <div key={index} onClick={() => setSelectedCharacter(character)} className="cursor-pointer">
                          <CharacterCard {...character} />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : activeTab === "social" ? (
                  <div className="max-w-2xl mx-auto">
                    <SocialFeed />
                  </div>
                ) : (
                  <div className="max-w-2xl mx-auto">
                    <MusicPlayer />
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
      
      {!selectedCharacter && <Footer />}
    </div>
  );
};

export default Index;