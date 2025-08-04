import { Shield, Users, BookOpen, Bug, LogOut, RefreshCw, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useRealtimeDashboard } from "@/hooks/useRealtimeDashboard";
import StudentManagement from "@/components/StudentManagement";
import { MeetingManagement } from "@/components/MeetingManagement";

const AdminDashboard = () => {
  const { adminSession, signOut } = useAdminAuth();
  const { stats, isLoading: statsLoading, refetch } = useRealtimeDashboard();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="text-center space-y-4 flex-1">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Welcome back, {adminSession?.full_name || adminSession?.email}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={signOut} className="ml-4">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
          <Button variant="ghost" onClick={refetch} className="ml-2" disabled={statsLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${statsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-elegant border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? (
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                ) : (
                  stats.totalStudents.toLocaleString()
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {statsLoading ? (
                  <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                ) : (
                  `${stats.studentsGrowth} from last month`
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? (
                  <div className="h-8 w-12 bg-muted animate-pulse rounded" />
                ) : (
                  stats.activeCourses
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {statsLoading ? (
                  <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                ) : (
                  `${stats.coursesGrowth} new this week`
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Error Challenges</CardTitle>
              <Bug className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? (
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                ) : (
                  stats.errorChallenges
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {statsLoading ? (
                  <div className="h-3 w-28 bg-muted animate-pulse rounded" />
                ) : (
                  `${stats.challengesCompletion} completion rate`
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Live Classes</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? (
                  <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                ) : (
                  stats.liveClasses
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {statsLoading ? (
                  <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                ) : (
                  stats.classesScheduled
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Student Management */}
        <StudentManagement />

        {/* Meeting Management */}
        <MeetingManagement />

        {/* Welcome Message */}
        <Card className="shadow-elegant border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Dashboard Overview
              {statsLoading && (
                <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </CardTitle>
            <CardDescription>
              Real-time analytics and metrics for the Learn From Errors platform. Data updates automatically as changes occur.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-muted-foreground">
                🔄 <strong>Real-time Updates:</strong> All metrics update automatically when data changes
              </p>
              <p className="text-muted-foreground">
                📊 <strong>Live Analytics:</strong> Student enrollments, course completions, and class schedules are tracked in real-time
              </p>
              <p className="text-muted-foreground">
                🎯 <strong>Performance Metrics:</strong> Error challenge completion rates and learning progress are continuously monitored
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
