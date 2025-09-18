import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock, Eye, Shield, Database } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  const dataTypes = [
    {
      icon: Eye,
      title: "Information You Provide",
      description: "Account details, profile information, and content you create or share on our platform.",
    },
    {
      icon: Database,
      title: "Usage Data",
      description: "How you interact with our service, including conversation patterns and feature usage.",
    },
    {
      icon: Shield,
      title: "Technical Information",
      description: "Device information, IP address, and browser data to ensure security and functionality.",
    },
    {
      icon: Lock,
      title: "AI Conversation Data",
      description: "Messages exchanged with AI characters to improve our service and your experience.",
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
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()} • Effective: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Data Types Overview */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {dataTypes.map((dataType, index) => (
              <div key={index} className="bg-gradient-card backdrop-blur-sm rounded-2xl border border-border/50 p-6 hover:shadow-cosmic transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                    <dataType.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{dataType.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{dataType.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Policy */}
          <div className="bg-gradient-card backdrop-blur-sm rounded-2xl border border-border/50 p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">Information We Collect</h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Account Information</h3>
                  <p>When you create an account, we collect your email address, username, and any profile information you choose to provide.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Conversation Data</h3>
                  <p>We store your conversations with AI characters to provide personalized experiences and improve our AI models. This includes message content, timestamps, and interaction patterns.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Usage Analytics</h3>
                  <p>We collect data about how you use our service, including features accessed, time spent, and general usage patterns to improve our platform.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Technical Data</h3>
                  <p>We automatically collect certain technical information including IP address, device type, browser information, and operating system for security and functionality purposes.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">How We Use Your Information</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p className="mb-4">We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide and maintain our AI conversation service</li>
                  <li>Personalize your experience with AI characters</li>
                  <li>Improve our AI models and conversation quality</li>
                  <li>Ensure platform security and prevent abuse</li>
                  <li>Communicate with you about updates and features</li>
                  <li>Analyze usage patterns to enhance our service</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">Information Sharing</h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>We do not sell your personal information. We may share information in these limited circumstances:</p>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Public Sharing</h3>
                  <p>When you choose to share conversations publicly, that content becomes visible to other users as intended.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Service Providers</h3>
                  <p>We may share data with trusted service providers who help us operate our platform, under strict confidentiality agreements.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Legal Requirements</h3>
                  <p>We may disclose information when required by law or to protect our rights, your safety, or the safety of others.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement industry-standard security measures to protect your data, including encryption in transit and at rest, 
                regular security audits, and access controls. However, no method of transmission over the internet is 100% secure, 
                and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">Your Rights and Choices</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p className="mb-4">You have the following rights regarding your personal information:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                  <li><strong>Portability:</strong> Request your data in a machine-readable format</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong>Account deletion:</strong> Delete your account and associated data</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">AI and Machine Learning</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use your conversation data to train and improve our AI models. This helps create better, more engaging AI characters. 
                Your individual conversations are not used to train models that serve other users without anonymization. 
                You can opt out of having your data used for model training in your account settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our service is not intended for children under 13 years of age. We do not knowingly collect personal information 
                from children under 13. If you are a parent and believe your child has provided us with personal information, 
                please contact us to have it removed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">International Users</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you are accessing our service from outside the United States, please note that your information may be 
                transferred to, stored, and processed in the United States where our servers are located. 
                By using our service, you consent to this transfer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "Last updated" date. Significant changes will be communicated 
                via email or prominent notice on our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">Contact Us</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p className="mb-4">If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                <ul className="space-y-2">
                  <li><strong>Email:</strong> privacy@socialai.com</li>
                  <li><strong>Address:</strong> SocialAI Privacy Team, 123 Tech Street, San Francisco, CA 94102</li>
                  <li><strong>Data Protection Officer:</strong> dpo@socialai.com</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;