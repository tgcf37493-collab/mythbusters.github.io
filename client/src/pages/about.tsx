import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Target, Users, Award } from "lucide-react";

export default function About() {
  return (
    <>
      <SEOHead
        title="About YBYMythBust"
        description="Learn about our mission to separate fact from fiction through evidence-based analysis and critical thinking."
        type="website"
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold gradient-text" data-testid="heading-about-title">
                About YBYMythBust
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-about-intro">
                We're dedicated to separating fact from fiction through rigorous evidence-based analysis and critical thinking.
              </p>
            </div>

            {/* Mission Statement */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <Target className="w-8 h-8 text-primary mt-1" />
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                    <p className="text-muted-foreground leading-7" data-testid="text-mission">
                      In an age of information overload and viral misinformation, YBYMythBust serves as a beacon of truth. 
                      Our mission is to combat myths, misconceptions, and false beliefs by providing well-researched, 
                      scientifically-backed analysis. We believe that critical thinking and evidence-based reasoning 
                      are essential tools for navigating our complex world.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What We Do */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <Search className="w-8 h-8 text-primary mt-1" />
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
                    <div className="space-y-4 text-muted-foreground" data-testid="text-what-we-do">
                      <p>
                        We investigate popular myths across various domains including health, science, history, 
                        and technology. Each article is meticulously researched using peer-reviewed sources, 
                        scientific studies, and expert opinions.
                      </p>
                      <p>
                        Our team examines claims with an open but skeptical mind, following the evidence wherever 
                        it leads. We're not afraid to challenge widely-held beliefs when the science doesn't support them.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Our Approach */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <Award className="w-8 h-8 text-primary mt-1" />
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Our Approach</h2>
                    <ul className="space-y-3 text-muted-foreground" data-testid="list-approach">
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                        <span><strong>Evidence-Based:</strong> Every claim is backed by credible sources and scientific research</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                        <span><strong>Transparent:</strong> We cite all sources and explain our methodology</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                        <span><strong>Unbiased:</strong> We follow the evidence regardless of popular opinion</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                        <span><strong>Accessible:</strong> Complex topics are explained in clear, understandable language</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <Users className="w-8 h-8 text-primary mt-1" />
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
                    <p className="text-muted-foreground leading-7" data-testid="text-team">
                      YBYMythBust is powered by a diverse team of researchers, scientists, and writers who share 
                      a passion for truth and accuracy. Our contributors include experts in various fields such as 
                      medicine, physics, history, psychology, and more. Together, we work to ensure that every 
                      article meets the highest standards of scientific rigor and journalistic integrity.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <div className="text-center space-y-6 pt-8">
              <h2 className="text-3xl font-bold">Join Our Mission</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-cta">
                Help us spread accurate information and combat misinformation. Share our articles, 
                engage in thoughtful discussions, and always remember to question claims with a critical mind.
              </p>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
