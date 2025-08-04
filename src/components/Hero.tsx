import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Code, Zap } from "lucide-react";
import heroImage from "@/assets/hero-coding.jpg";

const Hero = () => {
  return (
    <section className="pt-20 pb-16 lg:pt-32 lg:pb-24">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                <Zap className="h-4 w-4 mr-2" />
                Real-time Learning Platform
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Learn Coding by{" "}
                <span className="bg-gradient-accent bg-clip-text text-transparent">
                  Embracing Errors
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                Master programming through interactive debugging challenges, real-time error feedback, 
                and hands-on projects. Build confidence by turning mistakes into learning opportunities.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="group">
                <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Start Learning Now
              </Button>
              <Button variant="outline" size="lg">
                <Code className="h-5 w-5 mr-2" />
                Try Demo Challenge
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">500+</div>
                <div className="text-sm text-muted-foreground">Error Challenges</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">95%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-card">
              <img 
                src={heroImage} 
                alt="Coding education platform interface"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-hero opacity-20"></div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-success p-3 rounded-xl shadow-success animate-pulse">
              <Code className="h-6 w-6 text-success-foreground" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-primary p-3 rounded-xl shadow-glow">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;