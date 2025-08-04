import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Bug, Clock, LogOut, GraduationCap, Target, TrendingUp } from 'lucide-react';
import { useStudentAuth } from '@/hooks/useStudentAuth';
import { useStudentData } from '@/hooks/useStudentData';
import { StudentMeetings } from '@/components/StudentMeetings';

const StudentDashboard = () => {
  const { studentSession, isAuthenticated, isLoading, signOut } = useStudentAuth();
  const { courses, errorChallenges, totalCourses, totalChallenges, isLoading: dataLoading } = useStudentData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/student/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-gradient-primary rounded-full inline-block mb-4">
            <GraduationCap className="h-8 w-8 text-primary-foreground animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="text-center space-y-4 flex-1">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <GraduationCap className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Student Dashboard
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Welcome back, {studentSession?.full_name || studentSession?.email}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={signOut} className="ml-4">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-elegant border-0 bg-card/80 backdrop-blur-sm hover:shadow-glow transition-all duration-300 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dataLoading ? '...' : totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                Ready to learn
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0 bg-card/80 backdrop-blur-sm hover:shadow-glow transition-all duration-300 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Error Challenges</CardTitle>
              <Bug className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dataLoading ? '...' : totalChallenges}</div>
              <p className="text-xs text-muted-foreground">
                Practice challenges available
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0 bg-card/80 backdrop-blur-sm hover:shadow-glow transition-all duration-300 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
              <p className="text-xs text-muted-foreground">
                Start your learning journey
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Student Meetings */}
        <StudentMeetings />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Courses */}
          <Card className="shadow-elegant border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Available Courses</CardTitle>
              <CardDescription>
                Explore courses and start your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dataLoading ? (
                <div className="text-center py-8">
                  <div className="animate-pulse text-muted-foreground">Loading courses...</div>
                </div>
              ) : courses.length > 0 ? (
                courses.slice(0, 3).map((course) => (
                  <div key={course.id} className="flex items-start space-x-4 p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{course.title}</p>
                        <Badge variant="secondary" className="text-xs">
                          {course.difficulty_level || 'beginner'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {course.description || 'No description available'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No courses available yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Error Challenges */}
          <Card className="shadow-elegant border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Error Challenges</CardTitle>
              <CardDescription>
                Practice with real coding errors and debugging
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dataLoading ? (
                <div className="text-center py-8">
                  <div className="animate-pulse text-muted-foreground">Loading challenges...</div>
                </div>
              ) : errorChallenges.length > 0 ? (
                errorChallenges.slice(0, 3).map((challenge) => (
                  <div key={challenge.id} className="flex items-start space-x-4 p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Bug className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{challenge.title}</p>
                        <Badge variant="outline" className="text-xs">
                          {challenge.error_type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {challenge.description || 'Practice debugging this error'}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Attempts: {challenge.total_attempts || 0}</span>
                        <span>Completed: {challenge.completion_count || 0}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Bug className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No challenges available yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Session Info */}
        <Card className="shadow-elegant border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-sm">Session Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Logged in as:</span>
                <p className="font-medium">{studentSession?.email}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Session ID:</span>
                <p className="font-mono text-xs">{studentSession?.sessionId}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Login time:</span>
                <p className="font-medium">
                  {studentSession?.loginTime && new Date(studentSession.loginTime).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;