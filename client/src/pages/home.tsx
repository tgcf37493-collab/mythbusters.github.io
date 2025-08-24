import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { BlogCard } from "@/components/blog-card";
import { Sidebar } from "@/components/sidebar";
import { SEOHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlogPost, BlogCategory } from "@shared/schema";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const { data: posts = [], isLoading: postsLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/posts"]
  });

  const { data: categories = [] } = useQuery<BlogCategory[]>({
    queryKey: ["/api/categories"]
  });

  const filteredPosts = selectedCategory === "all" 
    ? posts 
    : posts.filter(post => post.category.toLowerCase() === selectedCategory.toLowerCase());

  const categoryButtons = [
    { key: "all", label: "All" },
    ...categories.map(cat => ({ key: cat.name.toLowerCase(), label: cat.name }))
  ];

  return (
    <>
      <SEOHead
        title="Busting Myths with Science & Logic"
        description="Separating fact from fiction with evidence-based analysis and critical thinking. Join us in exploring the truth behind popular myths."
        type="website"
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        <HeroSection />
        
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-8" id="latest-articles">
                <h3 className="text-3xl font-bold">Latest Myth Busts</h3>
                <div className="flex flex-wrap gap-2">
                  {categoryButtons.map((category) => (
                    <Button
                      key={category.key}
                      variant={selectedCategory === category.key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.key)}
                      data-testid={`button-filter-${category.key}`}
                    >
                      {category.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              {postsLoading ? (
                <div className="grid md:grid-cols-2 gap-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="h-48 w-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-8">
                    {filteredPosts.map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>

                  {filteredPosts.length === 0 && (
                    <div className="text-center py-12">
                      <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                      <p className="text-muted-foreground">
                        {selectedCategory === "all" 
                          ? "No articles have been published yet." 
                          : `No articles found in the ${selectedCategory} category.`}
                      </p>
                    </div>
                  )}

                  {filteredPosts.length > 0 && (
                    <div className="text-center mt-12">
                      <Button variant="outline" size="lg" data-testid="button-load-more">
                        Load More Articles
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <Sidebar />
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
