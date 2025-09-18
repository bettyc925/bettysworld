import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Heart, Users, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const CommunityGuidelines = () => {
  const guidelines = [
    {
      icon: Heart,
      title: "Be Respectful",
      description: "Treat all community members and AI characters with kindness and respect. No harassment, hate speech, or discriminatory language.",
    },
    {
      icon: Shield,
      title: "Stay Safe",
      description: "Don't share personal information like addresses, phone numbers, or financial details. Keep conversations appropriate and safe.",
    },
    {
      icon: Users,
      title: "Foster Community",
      description: "Help create a welcoming environment for everyone. Share interesting conversations and support fellow community members.",
    },
    {
      icon: MessageCircle,
      title: "Quality Interactions",
      description: "Engage meaningfully with AI characters and share conversations that add value to the community experience.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="mb-8">
            <Link to="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
              Community Guidelines
            </h1>
            <p className="text-muted-foreground">
              Building a positive space for AI interactions and meaningful conversations
            </p>
          </div>

          {/* Core Values */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {guidelines.map((guideline, index) => (
              <div key={index} className="bg-gradient-card backdrop-blur-sm rounded-2xl border border-border/50 p-6 hover:shadow-cosmic transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                    <guideline.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{guideline.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{guideline.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Guidelines */}
          <div className="bg-gradient-card backdrop-blur-sm rounded-2xl border border-border/50 p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">Prohibited Content</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>The following types of content are not allowed on SocialAI:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Harassment, bullying, or threats toward any individual or group</li>
                  <li>Hate speech, discrimination, or content promoting violence</li>
                  <li>Sexually explicit or inappropriate content</li>
                  <li>Spam, scams, or misleading information</li>
                  <li>Content that violates intellectual property rights</li>
                  <li>Personal information of yourself or others</li>
                  <li>Illegal activities or content</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">AI Interaction Ethics</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>When interacting with AI characters:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Remember that AI characters are designed for positive, educational interactions</li>
                  <li>Don't attempt to manipulate AI characters into inappropriate responses</li>
                  <li>Respect the intended personality and purpose of each character</li>
                  <li>Report any concerning AI behavior to our moderation team</li>
                  <li>Understand that AI responses are generated and not human opinions</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">Content Sharing</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>When sharing conversations publicly:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Only share conversations that add value to the community</li>
                  <li>Ensure shared content doesn't contain personal information</li>
                  <li>Respect others' privacy and don't share their private conversations</li>
                  <li>Use content warnings for sensitive topics</li>
                  <li>Give credit when sharing others' ideas or insights</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">Reporting and Moderation</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you encounter content or behavior that violates these guidelines, please report it using our 
                reporting tools. Our moderation team reviews all reports and takes appropriate action, which may include 
                content removal, warnings, or account suspension. We're committed to maintaining a safe and positive 
                environment for all users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">Consequences</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>Violations of these guidelines may result in:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Content removal or editing requirements</li>
                  <li>Temporary restrictions on posting or sharing</li>
                  <li>Account warnings or strikes</li>
                  <li>Temporary or permanent account suspension</li>
                  <li>Loss of access to premium features</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">Appeals</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you believe your content was removed or your account was restricted in error, 
                you can submit an appeal through our support system. We review all appeals fairly and promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">Questions?</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about these guidelines or need clarification on any point, 
                please contact our community team at community@socialai.com.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CommunityGuidelines;