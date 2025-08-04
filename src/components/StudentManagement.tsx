import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Eye, EyeOff, UserX, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Student {
  id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  avatar_url: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

const StudentManagement = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    email: '',
    password: '',
    full_name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
    
    // Set up real-time subscription for students table
    console.log('Setting up real-time subscription for students...');
    
    const studentsChannel = supabase
      .channel('students-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'students'
      }, (payload) => {
        console.log('Students table changed in real-time:', payload);
        
        // Handle different events
        if (payload.eventType === 'INSERT') {
          const newStudent = payload.new as Student;
          setStudents(prev => [newStudent, ...prev]);
          
          // Show toast for new student (but not if it's the current user adding)
          toast({
            title: "New Student Added",
            description: `${newStudent.full_name || newStudent.email} has been added`,
          });
        } else if (payload.eventType === 'UPDATE') {
          const updatedStudent = payload.new as Student;
          setStudents(prev => prev.map(student => 
            student.id === updatedStudent.id ? updatedStudent : student
          ));
        } else if (payload.eventType === 'DELETE') {
          const deletedStudent = payload.old as Student;
          setStudents(prev => prev.filter(student => student.id !== deletedStudent.id));
        }
      })
      .subscribe((status) => {
        console.log('Students real-time subscription status:', status);
      });

    // Cleanup subscription
    return () => {
      console.log('Cleaning up students real-time subscription...');
      supabase.removeChannel(studentsChannel);
    };
  }, [toast]);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to load students",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewStudent(prev => ({ ...prev, password }));
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newStudent.email || !newStudent.password) {
      toast({
        title: "Error",
        description: "Email and password are required",
        variant: "destructive"
      });
      return;
    }

    try {
      // For demo purposes, we'll store the password temporarily
      // In production, use proper password hashing

      // Insert new student (for demo, we'll just store email and name)
      const { error: insertError } = await supabase
        .from('students')
        .insert({
          email: newStudent.email,
          full_name: newStudent.full_name || null,
          is_active: true
        });

      if (insertError) {
        if (insertError.code === '23505') {
          toast({
            title: "Error",
            description: "A student with this email already exists",
            variant: "destructive"
          });
          return;
        }
        throw insertError;
      }

      toast({
        title: "Success",
        description: "Student added successfully",
      });

      // Reset form and close dialog
      setNewStudent({ email: '', password: '', full_name: '' });
      setIsDialogOpen(false);
      
      // No need to manually refresh - real-time subscription will handle it
    } catch (error) {
      console.error('Error adding student:', error);
      toast({
        title: "Error",
        description: "Failed to add student",
        variant: "destructive"
      });
    }
  };

  const toggleStudentStatus = async (studentId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('students')
        .update({ 
          is_active: !currentStatus
        })
        .eq('id', studentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Student ${currentStatus ? 'deactivated' : 'activated'} successfully`,
      });

      // No need to manually refresh - real-time subscription will handle it
    } catch (error) {
      console.error('Error updating student status:', error);
      toast({
        title: "Error",
        description: "Failed to update student status",
        variant: "destructive"
      });
    }
  };

  const terminateSession = async (studentId: string) => {
    try {
      // Clear last login to effectively "log them out"
      const { error } = await supabase
        .from('students')
        .update({ last_login_at: null })
        .eq('id', studentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student session cleared successfully",
      });

      // No need to manually refresh - real-time subscription will handle it
    } catch (error) {
      console.error('Error clearing session:', error);
      toast({
        title: "Error",
        description: "Failed to clear session",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-elegant border-0 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="text-center">Loading students...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-elegant border-0 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Student Management
            </CardTitle>
            <CardDescription>
              Manage student accounts and sessions
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-glow">
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  Create login credentials for a new student
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student-email">Email</Label>
                  <Input
                    id="student-email"
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="student@example.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="student-name">Full Name (Optional)</Label>
                  <Input
                    id="student-name"
                    value={newStudent.full_name}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Student Name"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="student-password">Password</Label>
                    <Button type="button" variant="outline" size="sm" onClick={generatePassword}>
                      Generate
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      id="student-password"
                      type={showPassword ? "text" : "password"}
                      value={newStudent.password}
                      onChange={(e) => setNewStudent(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Student</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {students.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No students added yet</p>
              <p className="text-sm text-muted-foreground">Click "Add Student" to create the first account</p>
            </div>
          ) : (
            students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{student.full_name || student.email}</h4>
                    <Badge variant={student.is_active ? "default" : "secondary"}>
                      {student.is_active ? "Active" : "Inactive"}
                    </Badge>
                    {student.last_login_at && new Date(student.last_login_at) > new Date(Date.now() - 8 * 60 * 60 * 1000) && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Recently Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{student.email}</p>
                  {student.last_login_at && (
                    <p className="text-xs text-muted-foreground">
                      Last login: {new Date(student.last_login_at).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  {student.last_login_at && new Date(student.last_login_at) > new Date(Date.now() - 8 * 60 * 60 * 1000) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => terminateSession(student.id)}
                      className="text-orange-600 hover:text-orange-700"
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Clear Session
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleStudentStatus(student.id, student.is_active)}
                    className={student.is_active ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                  >
                    <Shield className="h-4 w-4 mr-1" />
                    {student.is_active ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentManagement;