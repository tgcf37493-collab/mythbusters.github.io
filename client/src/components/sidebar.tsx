import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { BlogCategory } from "@shared/schema";

export function Sidebar() {
  const { data: categories = [] } = useQuery<BlogCategory[]>({
    queryKey: ["/api/categories"]
  });

  return (
    <aside className="lg:w-80 space-y-8">
      {/* AdSense Rectangle Ad - Sidebar */}
      <div className="bg-muted rounded-lg p-6 text-center border-2 border-dashed border-border">
        <div className="text-2xl text-muted-foreground mb-2">📢</div>
        <p className="text-muted-foreground">AdSense Rectangle (300x250)</p>
        <p className="text-xs text-muted-foreground/70">Sidebar Advertisement</p>
      </div>

      {/* Popular Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/category/${category.slug}`}
                className="flex items-center justify-between group"
                data-testid={`link-category-${category.slug}`}
              >
                <span className="text-muted-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </span>
                <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full" data-testid={`text-count-${category.slug}`}>
                  {category.postCount}
                </span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Newsletter Signup */}
      <Card className="bg-gradient-to-r from-primary to-secondary text-white border-0">
        <CardContent className="p-6">
          <h4 className="text-xl font-semibold mb-2">Stay Informed</h4>
          <p className="text-blue-100 mb-4">Get the latest myth-busting articles delivered to your inbox.</p>
          <div className="space-y-3">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-white text-gray-900 border-0"
              data-testid="input-newsletter-email"
            />
            <Button 
              className="w-full bg-white text-primary hover:bg-gray-100 font-semibold"
              data-testid="button-newsletter-subscribe"
            >
              Subscribe Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Comments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <p className="text-sm text-muted-foreground">
                "Great analysis on the water myth! Really eye-opening."
              </p>
              <div className="flex items-center mt-2 space-x-2">
                <div className="w-6 h-6 bg-muted rounded-full"></div>
                <span className="text-xs text-muted-foreground">Sarah M.</span>
              </div>
            </div>
            <div className="border-l-4 border-secondary pl-4">
              <p className="text-sm text-muted-foreground">
                "The medieval history article was fascinating!"
              </p>
              <div className="flex items-center mt-2 space-x-2">
                <div className="w-6 h-6 bg-muted rounded-full"></div>
                <span className="text-xs text-muted-foreground">John D.</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
