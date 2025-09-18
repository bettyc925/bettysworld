import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
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
              Terms of Service
            </h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="bg-gradient-card backdrop-blur-sm rounded-2xl border border-border/50 p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using SocialAI, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">2. Use License</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Permission is granted to temporarily use SocialAI for personal, non-commercial transitory viewing only. 
                This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">3. AI Interactions</h2>
              <p className="text-muted-foreground leading-relaxed">
                SocialAI provides AI character interactions for entertainment and educational purposes. 
                Users understand that AI responses are generated and do not constitute professional advice. 
                Users are responsible for their own interactions and should not share sensitive personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">4. User Content</h2>
              <p className="text-muted-foreground leading-relaxed">
                Users retain ownership of content they create but grant SocialAI a license to use, 
                modify, and display such content as necessary to provide the service. 
                Users must not post content that is illegal, harmful, or infringes on others' rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">5. Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your privacy is important to us. Please review our Privacy Policy, 
                which also governs your use of the service, to understand our practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">6. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                In no event shall SocialAI or its suppliers be liable for any damages 
                (including, without limitation, damages for loss of data or profit, or due to business interruption) 
                arising out of the use or inability to use SocialAI, even if SocialAI or an authorized representative 
                has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">7. Modifications</h2>
              <p className="text-muted-foreground leading-relaxed">
                SocialAI may revise these terms of service at any time without notice. 
                By using this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">8. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at legal@socialai.com.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;