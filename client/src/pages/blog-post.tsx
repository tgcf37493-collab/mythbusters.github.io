import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SocialShare } from "@/components/social-share";
import { SEOHead } from "@/components/seo-head";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ArrowRight, Calendar, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { BlogPost } from "@shared/schema";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ["/api/posts", slug]
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-64 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/">
            <Button data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const postUrl = `${window.location.origin}/post/${post.slug}`;
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      'health-myths': 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
      'science-myths': 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300',
      'history-myths': 'bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300',
      'default': 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300'
    };
    return colors[category.toLowerCase() as keyof typeof colors] || colors.default;
  };

  return (
    <>
      <SEOHead
        title={post.title}
        description={post.excerpt}
        url={postUrl}
        image={post.featuredImage || undefined}
        type="article"
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 py-12">
          <article className="space-y-8">
            {/* Header */}
            <div className="space-y-6">
              <Link href="/">
                <Button variant="ghost" className="mb-4" data-testid="button-back">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Articles
                </Button>
              </Link>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className={getCategoryColor(post.category)} data-testid="badge-category">
                    {post.category}
                  </Badge>
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs" data-testid={`badge-tag-${tag}`}>
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold leading-tight" data-testid="heading-title">
                  {post.title}
                </h1>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span data-testid="text-author">YBY Research Team</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span data-testid="text-date">{formattedDate}</span>
                  </div>
                  <span data-testid="text-reading-time">8 min read</span>
                </div>

                <SocialShare title={post.title} url={postUrl} />
              </div>

              {post.featuredImage && (
                <div className="aspect-video overflow-hidden rounded-lg">
                  <img 
                    src={post.featuredImage} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                    data-testid="image-featured"
                  />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none" data-testid="content-body">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            {/* AdSense In-Article Ad */}
            <div className="my-8 bg-muted rounded-lg p-6 text-center border-2 border-dashed border-border">
              <div className="text-2xl text-muted-foreground mb-2">📢</div>
              <p className="text-muted-foreground">AdSense In-Article Ad (728x90)</p>
              <p className="text-xs text-muted-foreground/70">Placed naturally within content flow</p>
            </div>

            {/* Navigation */}
            <div className="pt-8 border-t border-border">
              <div className="flex justify-between">
                <Button variant="ghost" className="flex items-center gap-2" data-testid="button-prev-article">
                  <ArrowLeft className="w-4 h-4" />
                  Previous Article
                </Button>
                <Button variant="ghost" className="flex items-center gap-2" data-testid="button-next-article">
                  Next Article
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </article>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
