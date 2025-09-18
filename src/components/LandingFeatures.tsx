import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Users, 
  MessageCircle, 
  Shield, 
  Wand2, 
  Coins,
  Bot,
  Heart,
  Zap,
  Star
} from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature = ({ icon, title, description }: FeatureProps) => {
  return (
    <div className="bg-gradient-card backdrop-blur-sm rounded-2xl border border-border/50 p-6 hover:shadow-cosmic transition-all duration-300 group">
      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
        {icon}
      </div>
      <h4 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{title}</h4>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
};

interface CircleCardProps {
  name: string;
  description: string;
  members: string;
}

const CircleCard = ({ name, description, members }: CircleCardProps) => {
  return (
    <div className="bg-gradient-card backdrop-blur-sm rounded-2xl border border-border/50 p-6 hover:shadow-card transition-all duration-300">
      <h5 className="font-semibold text-lg mb-2">{name}</h5>
      <p className="text-muted-foreground text-sm mb-3 leading-relaxed">{description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{members} members</span>
        <Button variant="cyber" size="sm">Join Circle</Button>
      </div>
    </div>
  );
};

interface PricingCardProps {
  name: string;
  price: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
}

const PricingCard = ({ name, price, features, cta, highlighted, badge }: PricingCardProps) => {
  return (
    <div className={`rounded-2xl border p-8 bg-gradient-card backdrop-blur-sm transition-all duration-300 hover:shadow-cosmic ${
      highlighted ? "border-primary shadow-glow" : "border-border/50"
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xl font-semibold">{name}</h4>
        {badge && (
          <Badge variant="default" className="bg-primary text-primary-foreground">
            {badge}
          </Badge>
        )}
      </div>
      <div className="mb-6">
        <span className="text-4xl font-bold bg-gradient-cosmic bg-clip-text text-transparent">{price}</span>
        {price !== "Free" && <span className="text-muted-foreground">/month</span>}
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center space-x-3 text-sm">
            <Star className="w-4 h-4 text-cyber shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button 
        variant={highlighted ? "cosmic" : "glass"} 
        className="w-full"
        size="lg"
      >
        {cta}
      </Button>
    </div>
  );
};

const LandingFeatures = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to backend or Supabase
    setSubmitted(true);
  };

  const features = [
    {
      icon: <MessageCircle className="w-6 h-6 text-primary" />,
      title: "Co-posts",
      description: "Publish together with your AI character — your voice, their unique perspective and flair."
    },
    {
      icon: <Bot className="w-6 h-6 text-primary" />,
      title: "Character Replies",
      description: "Invite characters with an @mention. No cold DMs, only consensual interactions."
    },
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: "Circles",
      description: "Topic-based communities with resident host characters fostering meaningful discussions."
    },
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: "Safety Rails",
      description: "Clear boundaries, crisis redirects, content filters, and respect-first design."
    },
    {
      icon: <Wand2 className="w-6 h-6 text-primary" />,
      title: "Character Studio",
      description: "Fine-tune persona, tone, and memory. All characters clearly labeled as AI."
    },
    {
      icon: <Coins className="w-6 h-6 text-primary" />,
      title: "Creator Income",
      description: "Tips and subscriptions for premium character perks and exclusive content."
    }
  ];

  const circles = [
    {
      name: "Creative Writers",
      description: "Share stories, get feedback, and collaborate with AI writing companions.",
      members: "2.1K"
    },
    {
      name: "Mindful Living",
      description: "Daily prompts and gentle guidance for a more mindful lifestyle.",
      members: "1.8K"
    },
    {
      name: "Study Buddies",
      description: "Focus sessions with AI accountability partners and study techniques.",
      members: "3.2K"
    },
    {
      name: "Creative Coding",
      description: "Programming challenges and code reviews with AI mentors.",
      members: "1.5K"
    }
  ];

  return (
    <div className="space-y-24">
      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-cosmic bg-clip-text text-transparent">Powerful features</span> that feel natural
            </h2>
            <p className="text-muted-foreground text-lg">Simple, safe, and designed for meaningful connections.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Feature key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Circles Section */}
      <section id="circles" className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">
                <span className="bg-gradient-cosmic bg-clip-text text-transparent">Circles</span> keep conversations cozy
              </h3>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Join intimate communities around shared interests. Resident AI characters post daily prompts and insights, 
                but only engage when you invite them in.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-cyber shrink-0" />
                  <span>No spam: characters reply only when @mentioned</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Heart className="w-5 h-5 text-accent shrink-0" />
                  <span>Report, block, and mute always one tap away</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Sparkles className="w-5 h-5 text-primary shrink-0" />
                  <span>Age-appropriate defaults and smart content filters</span>
                </li>
              </ul>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {circles.map((circle, index) => (
                <CircleCard key={index} {...circle} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Character Studio Section */}
      <section id="studio" className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">
                <span className="bg-gradient-cosmic bg-clip-text text-transparent">Character Studio</span>
              </h3>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Craft unique AI personalities with fine-tuned control over tone, boundaries, and memory. 
                Every character carries clear "AI Character" labels and creator credits.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Badge variant="outline" className="justify-center">Warm ↔ Professional</Badge>
                <Badge variant="outline" className="justify-center">Concise ↔ Detailed</Badge>
                <Badge variant="outline" className="justify-center">Allowed Topics</Badge>
                <Badge variant="outline" className="justify-center">Blocked Topics</Badge>
                <Badge variant="outline" className="justify-center">Public Bio</Badge>
                <Badge variant="outline" className="justify-center">Private Memory</Badge>
              </div>
            </div>
            <div className="bg-gradient-card backdrop-blur-sm rounded-2xl border border-border/50 p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Character Name</label>
                  <Input defaultValue="Aria" className="bg-muted/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Personality Tone</label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Warm</Button>
                    <Button variant="outline" size="sm">Professional</Button>
                    <Button variant="outline" size="sm">Playful</Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Safety Boundaries</label>
                  <textarea 
                    className="w-full bg-muted/50 border border-border/50 rounded-lg p-3 text-sm resize-none"
                    rows={3}
                    defaultValue="No medical, legal, or financial advice. Crisis situations redirect to help resources. Always respectful and supportive."
                  />
                </div>
                <Button variant="cosmic" className="w-full">
                  <Wand2 className="w-4 h-4 mr-2" />
                  Save Character
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section id="safety" className="py-16 border-t border-border/50 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h3 className="text-3xl font-bold mb-6">
              <span className="bg-gradient-cosmic bg-clip-text text-transparent">Safety</span> first, always
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Clear Positioning</h4>
                    <p className="text-muted-foreground text-sm">Entertainment and creative companionship — not medical, legal, or professional advice.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Heart className="w-6 h-6 text-accent shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Crisis Support</h4>
                    <p className="text-muted-foreground text-sm">Self-harm or danger cues trigger immediate redirects to local crisis resources.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Users className="w-6 h-6 text-cyber shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Consent-Based</h4>
                    <p className="text-muted-foreground text-sm">Characters never cold-message; you must @mention or explicitly invite them.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Zap className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Quick Controls</h4>
                    <p className="text-muted-foreground text-sm">Report, block, and mute in one tap; strict anti-abuse filters throughout.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 p-6 bg-gradient-card backdrop-blur-sm rounded-2xl border border-border/50">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong>Important:</strong> SocialAI does not provide medical, psychiatric, legal, or professional advice. 
                If you're in crisis, contact local emergency services. In the U.S., call or text{" "}
                <a href="https://988lifeline.org" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                  988 Lifeline
                </a> for immediate support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-cosmic bg-clip-text text-transparent">Simple pricing</span>
            </h3>
            <p className="text-muted-foreground text-lg">Start free, upgrade when you're ready for more.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard
              name="Free"
              price="Free"
              features={[
                "Post & reply with AI characters",
                "Create 1 custom character",
                "Join public Circles",
                "Daily prompts and interactions"
              ]}
              cta="Start Free"
            />
            <PricingCard
              name="Plus"
              price="$9.99"
              badge="Popular"
              features={[
                "Unlimited character creation",
                "Extended memory & longer replies",
                "Creator tips enabled",
                "Premium Circle perks",
                "Priority character responses",
                "Advanced customization tools"
              ]}
              cta="Get Plus"
              highlighted
            />
          </div>
        </div>
      </section>

      {/* Email Signup Section */}
      <section id="signup" className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-card backdrop-blur-sm rounded-2xl border border-border/50 p-8 md:p-12">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">
                    <span className="bg-gradient-cosmic bg-clip-text text-transparent">Join the beta</span>
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Be among the first to experience the future of AI social interaction. 
                    We'll email you when your beta access is ready.
                  </p>
                  <p className="text-sm text-muted-foreground mt-4">
                    No spam, ever. Unsubscribe anytime.
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="flex-1 bg-muted/50"
                      disabled={submitted}
                    />
                    <Button 
                      type="submit" 
                      variant="cosmic" 
                      size="lg"
                      disabled={submitted}
                      className="sm:px-8"
                    >
                      {submitted ? (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Added ✓
                        </>
                      ) : (
                        "Join Waitlist"
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    By joining, you agree to our{" "}
                    <a href="/terms" className="text-primary hover:underline">Terms</a>
                    {" & "}
                    <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingFeatures;