import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, Trophy, ArrowRight } from "lucide-react";

const courses = [
  {
    title: "Python Debugging Mastery",
    description: "Learn Python by fixing common errors and debugging complex programs. Perfect for beginners.",
    level: "Beginner",
    duration: "6 weeks",
    students: "12.5K",
    progress: 85,
    errors: 150,
    category: "Python",
    image: "🐍"
  },
  {
    title: "Web Development Error Hunt",
    description: "Debug HTML, CSS, and JavaScript issues while building real-world web applications.",
    level: "Intermediate",
    duration: "8 weeks", 
    students: "8.3K",
    progress: 92,
    errors: 200,
    category: "Web Dev",
    image: "🌐"
  },
  {
    title: "Data Structures & Algorithms",
    description: "Master DSA concepts by solving algorithmic errors and optimization challenges.",
    level: "Advanced",
    duration: "12 weeks",
    students: "5.7K", 
    progress: 78,
    errors: 300,
    category: "DSA",
    image: "📊"
  }
];

const getLevelColor = (level: string) => {
  switch (level) {
    case "Beginner": return "bg-success text-success-foreground";
    case "Intermediate": return "bg-warning text-warning-foreground";
    case "Advanced": return "bg-destructive text-destructive-foreground";
    default: return "bg-primary text-primary-foreground";
  }
};

const CoursePreview = () => {
  return (
    <section id="courses" className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Featured Courses
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Start Your{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Learning Journey
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our carefully crafted courses designed to help you learn through hands-on debugging and error resolution.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <Card key={index} className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-4xl">{course.image}</div>
                  <Badge className={getLevelColor(course.level)}>
                    {course.level}
                  </Badge>
                </div>
                
                <div>
                  <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {course.description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Course Stats */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    {course.students}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Trophy className="h-4 w-4 mr-1" />
                    {course.errors} errors
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>

                {/* CTA */}
                <Button className="w-full group/btn" variant="outline">
                  Start Course
                  <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="hero" size="lg">
            View All Courses
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CoursePreview;