import { Button } from "@/components/ui/button";

export function HeroSection() {
  const scrollToArticles = () => {
    const articlesSection = document.getElementById('latest-articles');
    articlesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
          Busting Myths with Science & Logic 🚀
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Separating fact from fiction with evidence-based analysis and critical thinking. Join us in exploring the truth behind popular myths.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={scrollToArticles}
            className="px-8 py-3"
            data-testid="button-latest-articles"
          >
            Latest Articles
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-3"
            data-testid="button-browse-categories"
          >
            Browse Categories
          </Button>
        </div>
      </div>
      
      {/* AdSense Banner Ad - Top */}
      <div className="mt-12 max-w-4xl mx-auto px-4">
        <div className="bg-muted rounded-lg p-8 text-center border-2 border-dashed border-border">
          <div className="text-3xl text-muted-foreground mb-2">📢</div>
          <p className="text-muted-foreground">AdSense Banner Ad (728x90)</p>
          <p className="text-sm text-muted-foreground/70">{/* AdSense code will be placed here */}</p>
        </div>
      </div>
    </section>
  );
}
