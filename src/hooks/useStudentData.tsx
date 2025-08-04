import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Course {
  id: string;
  title: string;
  description: string | null;
  difficulty_level: string | null;
  is_active: boolean;
  student_count: number | null;
  created_at: string;
}

interface ErrorChallenge {
  id: string;
  title: string;
  description: string | null;
  error_type: string;
  difficulty_level: string | null;
  completion_count: number | null;
  total_attempts: number | null;
  created_at: string;
}

interface StudentData {
  courses: Course[];
  errorChallenges: ErrorChallenge[];
  totalCourses: number;
  totalChallenges: number;
  isLoading: boolean;
}

export const useStudentData = () => {
  const [data, setData] = useState<StudentData>({
    courses: [],
    errorChallenges: [],
    totalCourses: 0,
    totalChallenges: 0,
    isLoading: true
  });

  const fetchStudentData = async () => {
    try {
      // Fetch courses
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      // Fetch error challenges
      const { data: challenges, error: challengesError } = await supabase
        .from('error_challenges')
        .select('*')
        .order('created_at', { ascending: false });

      if (coursesError) throw coursesError;
      if (challengesError) throw challengesError;

      setData({
        courses: courses || [],
        errorChallenges: challenges || [],
        totalCourses: courses?.length || 0,
        totalChallenges: challenges?.length || 0,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching student data:', error);
      setData(prev => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  return { ...data, refetch: fetchStudentData };
};