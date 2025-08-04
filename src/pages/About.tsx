
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Users, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                About This Project
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Learn with{" "}
                <span className="bg-gradient-accent bg-clip-text text-transparent">
                  Errors
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Empowering developers to embrace their mistakes and transform them into learning opportunities
              </p>
            </div>

            {/* Project Description */}
            <Card className="mb-12">
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-2 bg-gradient-primary rounded-lg">
                    <Code2 className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">Project Overview</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Learn from Errors</strong> is an innovative educational platform designed specifically for developers 
                  who want to improve their coding skills through interactive debugging challenges and real-world error scenarios.
                </p>
                
                <p className="text-muted-foreground leading-relaxed">
                  Our platform recognizes that making mistakes is a natural and valuable part of the learning process. 
                  Instead of avoiding errors, we encourage developers to embrace them as powerful learning opportunities. 
                  Through carefully crafted error challenges, real-time feedback systems, and hands-on debugging exercises, 
                  students learn to identify, understand, and fix common programming issues.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  The platform features comprehensive courses in Python, Web Development, and Data Structures, 
                  complemented by live classes, community support, and mentorship programs. Our unique approach 
                  helps developers build confidence, improve problem-solving skills, and develop a growth mindset 
                  that turns every bug into a stepping stone toward mastery.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-success mb-2">500+</div>
                    <div className="text-sm text-muted-foreground">Error Challenges</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-2">50K+</div>
                    <div className="text-sm text-muted-foreground">Students</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-warning mb-2">95%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Creators Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-2 bg-gradient-primary rounded-lg">
                    <Users className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">Project Creators</CardTitle>
                </div>
                <CardDescription>
                  Meet the developers behind this innovative learning platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-muted/30 rounded-lg">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                      <img 
                        src="/lovable-uploads/fc5669fc-3c6d-4776-ad57-5d445d28f446.png" 
                        alt="VC - Developer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">VC</h3>
                    <p className="text-muted-foreground">Developer</p>
                  </div>
                  
                  <div className="text-center p-6 bg-muted/30 rounded-lg">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                      <img 
                        src="/lovable-uploads/d9a01def-a858-4804-a5d8-a15b4f8fe2d8.png" 
                        alt="RDM - Developer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">RDM</h3>
                    <p className="text-muted-foreground">Developer</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center mt-8 pt-6 border-t border-border">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span>Made with passion for developer education</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
