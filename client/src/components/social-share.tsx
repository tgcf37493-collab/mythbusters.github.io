import { Button } from "@/components/ui/button";
import { Share2, Twitter, Facebook, MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface SocialShareProps {
  title: string;
  url: string;
}

export function SocialShare({ title, url }: SocialShareProps) {
  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    trackEvent('share', 'social', 'twitter');
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
    trackEvent('share', 'social', 'facebook');
  };

  const shareOnWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
    window.open(whatsappUrl, '_blank');
    trackEvent('share', 'social', 'whatsapp');
  };

  const shareNative = () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      navigator.share({
        title,
        url,
      });
      trackEvent('share', 'social', 'native');
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">Share:</span>
      
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <Button
          variant="outline"
          size="sm"
          onClick={shareNative}
          data-testid="button-share-native"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={shareOnTwitter}
        className="text-blue-500 hover:text-blue-600"
        data-testid="button-share-twitter"
      >
        <Twitter className="w-4 h-4 mr-2" />
        Twitter
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={shareOnFacebook}
        className="text-blue-600 hover:text-blue-700"
        data-testid="button-share-facebook"
      >
        <Facebook className="w-4 h-4 mr-2" />
        Facebook
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={shareOnWhatsApp}
        className="text-green-600 hover:text-green-700"
        data-testid="button-share-whatsapp"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        WhatsApp
      </Button>
    </div>
  );
}
