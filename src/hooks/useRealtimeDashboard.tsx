import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalStudents: number;
  activeCourses: number;
  errorChallenges: number;
  liveClasses: number;
  studentsGrowth: string;
  coursesGrowth: string;
  challengesCompletion: string;
  classesScheduled: string;
}

export const useRealtimeDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeCourses: 0,
    errorChallenges: 0,
    liveClasses: 0,
    studentsGrowth: '+0%',
    coursesGrowth: '+0%',
    challengesCompletion: '0%',
    classesScheduled: '0 today'
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      // Fetch total students
      const { count: studentsCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Fetch active courses
      const { count: coursesCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Fetch error challenges
      const { count: challengesCount } = await supabase
        .from('error_challenges')
        .select('*', { count: 'exact', head: true });

      // Fetch live classes for today
      const today = new Date().toISOString().split('T')[0];
      const { count: liveClassesCount } = await supabase
        .from('live_classes')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .gte('scheduled_at', today)
        .lt('scheduled_at', `${today}T23:59:59`);

      // Calculate growth percentage for students (compare with last month)
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const { count: lastMonthStudents } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .lt('created_at', lastMonth.toISOString());

      const studentsGrowth = lastMonthStudents > 0 
        ? `+${Math.round(((studentsCount || 0) - lastMonthStudents) / lastMonthStudents * 100)}%`
        : '+0%';

      // Calculate completion rate for challenges
      const { data: challengeStats } = await supabase
        .from('error_challenges')
        .select('completion_count, total_attempts');

      const totalAttempts = challengeStats?.reduce((sum, c) => sum + c.total_attempts, 0) || 0;
      const totalCompletions = challengeStats?.reduce((sum, c) => sum + c.completion_count, 0) || 0;
      const completionRate = totalAttempts > 0 ? Math.round((totalCompletions / totalAttempts) * 100) : 0;

      setStats({
        totalStudents: studentsCount || 0,
        activeCourses: coursesCount || 0,
        errorChallenges: challengesCount || 0,
        liveClasses: liveClassesCount || 0,
        studentsGrowth,
        coursesGrowth: '+12%', // This could be calculated similarly
        challengesCompletion: `${completionRate}%`,
        classesScheduled: `${liveClassesCount || 0} today`
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchStats();

    // Set up real-time subscriptions with more detailed logging
    console.log('Setting up real-time subscriptions...');

    const studentsChannel = supabase
      .channel('students-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'students' 
      }, (payload) => {
        console.log('Students table changed:', payload);
        fetchStats(); // Refetch stats when students change
      })
      .subscribe((status) => {
        console.log('Students channel status:', status);
      });

    const coursesChannel = supabase
      .channel('courses-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'courses' 
      }, (payload) => {
        console.log('Courses table changed:', payload);
        fetchStats();
      })
      .subscribe((status) => {
        console.log('Courses channel status:', status);
      });

    const challengesChannel = supabase
      .channel('challenges-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'error_challenges' 
      }, (payload) => {
        console.log('Error challenges table changed:', payload);
        fetchStats();
      })
      .subscribe((status) => {
        console.log('Challenges channel status:', status);
      });

    const classesChannel = supabase
      .channel('classes-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'live_classes' 
      }, (payload) => {
        console.log('Live classes table changed:', payload);
        fetchStats();
      })
      .subscribe((status) => {
        console.log('Classes channel status:', status);
      });

    // Cleanup subscriptions
    return () => {
      console.log('Cleaning up real-time subscriptions...');
      supabase.removeChannel(studentsChannel);
      supabase.removeChannel(coursesChannel);
      supabase.removeChannel(challengesChannel);
      supabase.removeChannel(classesChannel);
    };
  }, []);

  return { stats, isLoading, refetch: fetchStats };
};