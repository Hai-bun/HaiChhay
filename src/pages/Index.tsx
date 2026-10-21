import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SignInModal from "@/components/SignInModal";
import { Button } from "@/components/ui/button";
import { FloatingPetals } from "@/components/ui/FloatingPetals";
import { t } from "@/lib/i18n";
import { OrnamentDivider } from "@/components/ui/OrnamentDivider";
import { Heart, Sparkles, Settings, Users, Palette } from "lucide-react";
import heroBackground from "@/assets/wedding-hero-bg.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [showSignIn, setShowSignIn] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-romantic-gradient relative overflow-hidden">
      <FloatingPetals />

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}>
          <div className="absolute inset-0 bg-hero-gradient" />
        </div>
        <div className="text-center max-w-3xl mx-auto">
          {/* Logo */}
          <div className="mb-8 animate-fade-in-up">
            <div className="w-24 h-24 mx-auto bg-gold-gradient rounded-full shadow-elevated flex items-center justify-center animate-float">
              <Heart
                className="w-12 h-12 text-primary-foreground"
                fill="currentColor"
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="font-script text-5xl sm:text-7xl text-foreground mb-4 animate-fade-in-up delay-100">
            {t("welcomeTitle")}
          </h1>
          <h2 className="font-serif text-xl sm:text-2xl text-muted-foreground mb-8 animate-fade-in-up delay-200">
            {t("weInviteYou")}
          </h2>

          <OrnamentDivider className="animate-fade-in-up delay-300" />

          <p className="text-muted-foreground max-w-lg mx-auto mb-12 animate-fade-in-up delay-300">
            Design elegant, personalized wedding invitations with a luxury
            Southeast Asian aesthetic. Share unique invitation links with your
            guests and manage everything from one beautiful dashboard.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-500">
            <Button
              size="lg"
              onClick={async () => {
                const { data } = await supabase.auth.getSession();
                if (data?.session) navigate("/admin");
                else {
                  setPendingRedirect("/admin");
                  setShowSignIn(true);
                }
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg shadow-elevated">
              <Settings className="w-5 h-5 mr-2" />
              Admin Dashboard
            </Button>
          </div>
        </div>
      </section>

      <SignInModal
        open={showSignIn}
        onOpenChange={(open) => {
          setShowSignIn(open);
          if (!open) setPendingRedirect(null);
        }}
        onSuccess={() => {
          if (pendingRedirect) {
            navigate(pendingRedirect);
            setPendingRedirect(null);
          }
        }}
      />

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              A complete wedding invitation solution with elegant design and
              powerful features
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-background p-8 rounded-xl shadow-card text-center hover:shadow-elevated transition-shadow">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                Personalized Invites
              </h3>
              <p className="text-muted-foreground">
                Generate unique invitation links for each guest with
                personalized greetings
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-background p-8 rounded-xl shadow-card text-center hover:shadow-elevated transition-shadow">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Palette className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                Luxury Themes
              </h3>
              <p className="text-muted-foreground">
                Beautiful Southeast Asian inspired designs with customizable
                colors and fonts
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-background p-8 rounded-xl shadow-card text-center hover:shadow-elevated transition-shadow">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                RSVP & Blessings
              </h3>
              <p className="text-muted-foreground">
                Collect RSVPs and heartfelt messages from your guests in one
                place
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 text-center border-t border-border bg-background">
        <Heart
          className="w-6 h-6 text-primary mx-auto mb-2"
          fill="currentColor"
        />
      </footer>
    </div>
  );
};

export default Index;
