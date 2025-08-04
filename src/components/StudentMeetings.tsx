import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ExternalLink, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format, isAfter, isBefore, addMinutes } from "date-fns";

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

export const StudentMeetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMeetings = async () => {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('is_active', true)
        .gte('scheduled_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Show meetings from last 24 hours
        .order('scheduled_at', { ascending: true });

      if (error) {
        console.error('Error fetching meetings:', error);
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
      .channel('student-meetings-changes')
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

  const canJoinMeeting = (scheduledAt: string) => {
    const now = new Date();
    const meetingTime = new Date(scheduledAt);
    const meetingEnd = addMinutes(meetingTime, 60);
    const joinWindowStart = addMinutes(meetingTime, -15); // Allow joining 15 minutes early

    return isAfter(now, joinWindowStart) && isBefore(now, meetingEnd);
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

  if (meetings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Meetings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No meetings scheduled</h3>
            <p className="text-muted-foreground">
              Check back later for upcoming live learning sessions.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Live Learning Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {meetings.map((meeting) => {
            const meetingStatus = getMeetingStatus(meeting.scheduled_at);
            const canJoin = canJoinMeeting(meeting.scheduled_at);
            
            return (
              <div key={meeting.id} className="border rounded-lg overflow-hidden">
                <div className="flex">
                  {meeting.image_url && (
                    <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                      <img 
                        src={meeting.image_url} 
                        alt={meeting.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{meeting.title}</h3>
                        {meeting.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {meeting.description}
                          </p>
                        )}
                      </div>
                      <Badge variant={meetingStatus.variant}>
                        {meetingStatus.label}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(meeting.scheduled_at), "MMM d, yyyy")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {format(new Date(meeting.scheduled_at), "h:mm a")}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {canJoin ? (
                        <Button
                          onClick={() => window.open(meeting.meet_link, '_blank')}
                          className="flex items-center gap-2"
                          variant={meetingStatus.status === 'live' ? 'default' : 'outline'}
                        >
                          <ExternalLink className="h-4 w-4" />
                          {meetingStatus.status === 'live' ? 'Join Live Session' : 'Join Meeting'}
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          disabled
                          className="flex items-center gap-2"
                        >
                          <Clock className="h-4 w-4" />
                          {meetingStatus.status === 'upcoming' ? 'Starts Soon' : 'Meeting Ended'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};