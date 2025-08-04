import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateMeetingModal } from "./CreateMeetingModal";
import { EditMeetingModal } from "./EditMeetingModal";
import { Plus, Calendar, Clock, Users, ExternalLink, Trash2, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, isAfter, isBefore, addMinutes } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Meeting {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  meet_link: string;
  scheduled_at: string;
  is_active: boolean;
  created_at: string;
}

export const MeetingManagement = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const { toast } = useToast();

  const fetchMeetings = async () => {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .order('scheduled_at', { ascending: false });

      if (error) {
        console.error('Error fetching meetings:', error);
        toast({
          title: "Error loading meetings",
          description: "Could not load meetings. Please try again.",
          variant: "destructive",
        });
      } else {
        setMeetings(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('meetings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meetings'
        },
        (payload) => {
          console.log('Meeting change detected:', payload);
          fetchMeetings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDeleteMeeting = async (meetingId: string) => {
    try {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', meetingId);

      if (error) {
        console.error('Error deleting meeting:', error);
        toast({
          title: "Error deleting meeting",
          description: "Could not delete the meeting. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Meeting deleted",
          description: "The meeting has been successfully deleted.",
        });
        fetchMeetings();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const handleToggleActive = async (meetingId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('meetings')
        .update({ is_active: !currentStatus })
        .eq('id', meetingId);

      if (error) {
        console.error('Error updating meeting:', error);
        toast({
          title: "Error updating meeting",
          description: "Could not update the meeting status. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Meeting updated",
          description: `Meeting ${!currentStatus ? 'activated' : 'deactivated'} successfully.`,
        });
        fetchMeetings();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const getMeetingStatus = (scheduledAt: string) => {
    const now = new Date();
    const meetingTime = new Date(scheduledAt);
    const meetingEnd = addMinutes(meetingTime, 60); // Assume 1 hour duration

    if (isBefore(now, meetingTime)) {
      return { status: "upcoming", label: "Upcoming", variant: "secondary" as const };
    } else if (isAfter(now, meetingTime) && isBefore(now, meetingEnd)) {
      return { status: "live", label: "Live Now", variant: "destructive" as const };
    } else {
      return { status: "ended", label: "Ended", variant: "outline" as const };
    }
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setSelectedMeeting(null);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Loading meetings...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Meeting Management</h2>
          <p className="text-muted-foreground">Create and manage live learning sessions</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Meeting
        </Button>
      </div>

      {meetings.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No meetings yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first meeting to get started with live learning sessions.
            </p>
            <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create First Meeting
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {meetings.map((meeting) => {
            const meetingStatus = getMeetingStatus(meeting.scheduled_at);
            return (
              <Card key={meeting.id} className="overflow-hidden">
                <div className="flex">
                  {meeting.image_url && (
                    <div className="w-32 h-32 flex-shrink-0">
                      <img 
                        src={meeting.image_url} 
                        alt={meeting.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{meeting.title}</CardTitle>
                          {meeting.description && (
                            <p className="text-sm text-muted-foreground">{meeting.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={meetingStatus.variant}>
                            {meetingStatus.label}
                          </Badge>
                          {!meeting.is_active && (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(meeting.scheduled_at), "PPP")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {format(new Date(meeting.scheduled_at), "p")}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(meeting.meet_link, '_blank')}
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Join Meeting
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditMeeting(meeting)}
                          className="flex items-center gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleActive(meeting.id, meeting.is_active)}
                        >
                          {meeting.is_active ? 'Deactivate' : 'Activate'}
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-destructive">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Meeting</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{meeting.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteMeeting(meeting.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <CreateMeetingModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onMeetingCreated={fetchMeetings}
      />

      <EditMeetingModal
        open={showEditModal}
        onOpenChange={handleEditModalClose}
        onMeetingUpdated={fetchMeetings}
        meeting={selectedMeeting}
      />
    </div>
  );
};
