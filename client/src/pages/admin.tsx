import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AdminLogin } from "@/components/admin-login";
import { AdminPanel } from "@/components/admin-panel";
import { SEOHead } from "@/components/seo-head";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export default function Admin() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const handleLoginSuccess = (token: string) => {
    setAuthToken(token);
  };

  const handleLogout = () => {
    setAuthToken(null);
  };

  if (authToken) {
    return (
      <>
        <SEOHead
          title="Admin Panel - YBYMythBust"
          description="Manage blog posts and content for YBYMythBust"
          type="website"
        />
        
        <div className="min-h-screen bg-background">
          <Header />
          
          <div className="flex justify-between items-center max-w-6xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
              Logout
            </Button>
          </div>
          
          <AdminPanel token={authToken} />
          
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Admin Login - YBYMythBust"
        description="Login to the admin panel"
        type="website"
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="max-w-md mx-auto px-4 py-24">
          <Card>
            <CardContent className="p-8 text-center space-y-6">
              <Lock className="w-16 h-16 text-primary mx-auto" />
              <div>
                <h1 className="text-2xl font-bold mb-2">Admin Access</h1>
                <p className="text-muted-foreground">
                  You need to authenticate to access the admin panel.
                </p>
              </div>
              <Button 
                className="w-full" 
                onClick={() => setIsLoginOpen(true)}
                data-testid="button-admin-access"
              >
                Admin Login
              </Button>
            </CardContent>
          </Card>
        </main>
        
        <AdminLogin
          open={isLoginOpen}
          onOpenChange={setIsLoginOpen}
          onSuccess={handleLoginSuccess}
        />
        
        <Footer />
      </div>
    </>
  );
}
