import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Message sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
      category: ""
    });
    setIsSubmitting(false);
  };

  return (
    <>
      <SEOHead
        title="Contact YBYMythBust"
        description="Get in touch with the YBYMythBust team. Send us your questions, myth suggestions, or feedback."
        type="website"
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="space-y-12">
            {/* Header */}
            <div className="text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold gradient-text" data-testid="heading-contact-title">
                Contact Us
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-contact-intro">
                Have a myth you'd like us to investigate? Questions about our research? We'd love to hear from you.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Send us a message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Your name"
                            required
                            data-testid="input-contact-name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="your@email.com"
                            required
                            data-testid="input-contact-email"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                          <SelectTrigger data-testid="select-contact-category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="myth-suggestion">Myth Suggestion</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="press">Press Inquiry</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="Brief description of your message"
                          required
                          data-testid="input-contact-subject"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Tell us more about your inquiry..."
                          rows={6}
                          required
                          data-testid="textarea-contact-message"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isSubmitting}
                        data-testid="button-contact-submit"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-sm text-muted-foreground" data-testid="text-contact-email">
                            contact@ybymythbust.com
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">Phone</p>
                          <p className="text-sm text-muted-foreground" data-testid="text-contact-phone">
                            +1 (555) 123-4567
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">Address</p>
                          <p className="text-sm text-muted-foreground" data-testid="text-contact-address">
                            123 Research Ave<br />
                            Science City, SC 12345
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">Myth Submission Guidelines</h3>
                    <ul className="text-sm text-muted-foreground space-y-2" data-testid="list-submission-guidelines">
                      <li>• Provide the myth or claim you'd like investigated</li>
                      <li>• Include any sources where you encountered the claim</li>
                      <li>• Explain why you think it's worth investigating</li>
                      <li>• Be as specific as possible with details</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">Response Time</h3>
                    <p className="text-sm text-muted-foreground" data-testid="text-response-time">
                      We typically respond to inquiries within 24-48 hours. 
                      Myth investigations may take several weeks depending on 
                      the complexity of the research required.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
