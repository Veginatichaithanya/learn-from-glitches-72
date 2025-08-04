import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bug, 
  Code2, 
  Smartphone, 
  Video, 
  Award, 
  MessageCircle,
  Zap,
  BookOpen,
  Users
} from "lucide-react";

const features = [
  {
    icon: Bug,
    title: "Error Challenges",
    description: "Learn by fixing real-world coding errors and debugging exercises designed to build your problem-solving skills.",
    badge: "Core Feature",
    badgeVariant: "default" as const
  },
  {
    icon: Zap,
    title: "Real-time Feedback",
    description: "Get instant error feedback and suggestions as you code, helping you learn from mistakes immediately.",
    badge: "Live",
    badgeVariant: "secondary" as const
  },
  {
    icon: Smartphone,
    title: "Mobile Responsive",
    description: "Learn anywhere with our fully responsive design. Code and debug on desktop, tablet, or mobile.",
    badge: "Cross-platform",
    badgeVariant: "outline" as const
  },
  {
    icon: BookOpen,
    title: "Structured Courses",
    description: "Progress through beginner to advanced courses in Python, Web Development, and Data Structures.",
    badge: "Curriculum",
    badgeVariant: "secondary" as const
  },
  {
    icon: Video,
    title: "Live Classes & Recordings",
    description: "Join live coding sessions with instructors or catch up with recorded lessons and comprehensive notes.",
    badge: "Interactive",
    badgeVariant: "outline" as const
  },
  {
    icon: Award,
    title: "Project Showcase",
    description: "Build a portfolio by showcasing your projects and earn certifications for completed courses.",
    badge: "Achievement",
    badgeVariant: "default" as const
  },
  {
    icon: MessageCircle,
    title: "Q&A Community",
    description: "Get help from mentors and peers in our active discussion areas and community support.",
    badge: "Community",
    badgeVariant: "secondary" as const
  },
  {
    icon: Users,
    title: "Mentorship Support",
    description: "Connect with experienced developers for personalized guidance and career advice.",
    badge: "1-on-1",
    badgeVariant: "outline" as const
  },
  {
    icon: Code2,
    title: "Code Execution",
    description: "Run and test your code directly in the browser with our integrated development environment.",
    badge: "In-browser",
    badgeVariant: "default" as const
  }
];

const Features = () => {
  return (
    <section id="features" className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Platform Features
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              Master Coding
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive platform combines interactive learning, real-time feedback, 
            and community support to accelerate your coding journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-gradient-primary rounded-lg group-hover:shadow-glow transition-all duration-300">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <Badge variant={feature.badgeVariant}>
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;