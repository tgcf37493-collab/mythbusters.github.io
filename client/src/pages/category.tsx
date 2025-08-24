import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BlogCard } from "@/components/blog-card";
import { Sidebar } from "@/components/sidebar";
import { SEOHead } from "@/components/seo-head";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlogPost, BlogCategory } from "@shared/schema";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: posts = [], isLoading: postsLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/categories", slug, "posts"]
  });

  const { data: categories = [] } = useQuery<BlogCategory[]>({
    queryKey: ["/api/categories"]
  });

  const category = categories.find(cat => cat.slug === slug);
  const categoryName = category?.name || slug?.replace('-', ' ') || 'Category';

  return (
    <>
      <SEOHead
        title={`${categoryName} - YBYMythBust`}
        description={`Explore ${categoryName} articles and debunk common myths with science and logic.`}
        type="website"
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4" data-testid="heading-category-title">
                  {categoryName}
                </h1>
                {category?.description && (
                  <p className="text-lg text-muted-foreground" data-testid="text-category-description">
                    {category.description}
                  </p>
                )}
                <p className="text-sm text-muted-foreground mt-2" data-testid="text-post-count">
                  {posts.length} article{posts.length !== 1 ? 's' : ''} in this category
                </p>
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
                  {posts.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-8">
                      {posts.map((post) => (
                        <BlogCard key={post.id} post={post} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                      <p className="text-muted-foreground">
                        No articles have been published in this category yet.
                      </p>
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
