import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import type { BlogPost } from "@shared/schema";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
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
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden" data-testid={`card-post-${post.id}`}>
      {post.featuredImage && (
        <div className="aspect-video overflow-hidden">
          <img 
            src={post.featuredImage} 
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={getCategoryColor(post.category)}>
            {post.category}
          </Badge>
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <Link href={`/post/${post.slug}`}>
          <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors cursor-pointer" data-testid={`text-title-${post.id}`}>
            {post.title}
          </h3>
        </Link>
        
        <p className="text-muted-foreground mb-4 line-clamp-3" data-testid={`text-excerpt-${post.id}`}>
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span data-testid={`text-date-${post.id}`}>{formattedDate}</span>
          </div>
          <Link href={`/post/${post.slug}`}>
            <Button variant="ghost" className="text-primary hover:text-primary/80 p-0" data-testid={`button-read-more-${post.id}`}>
              Read More <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
