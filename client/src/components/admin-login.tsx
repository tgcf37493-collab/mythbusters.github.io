import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AdminLoginProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (token: string) => void;
}

export function AdminLogin({ open, onOpenChange, onSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/admin/login", { password });
      const data = await response.json();
      
      if (data.success) {
        onSuccess(data.token);
        onOpenChange(false);
        setPassword("");
        toast({
          title: "Login successful",
          description: "Welcome to the admin panel",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center space-y-2">
            <Lock className="w-8 h-8 text-primary" />
            <DialogTitle>Admin Login</DialogTitle>
            <p className="text-sm text-muted-foreground text-center">
              Enter your password to access the admin panel
            </p>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              data-testid="input-admin-password"
            />
          </div>
          
          <div className="flex space-x-4">
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={isLoading}
              data-testid="button-admin-login"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => onOpenChange(false)}
              data-testid="button-admin-cancel"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
