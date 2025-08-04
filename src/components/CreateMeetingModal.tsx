
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Upload, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface CreateMeetingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMeetingCreated: () => void;
}

export const CreateMeetingModal = ({ open, onOpenChange, onMeetingCreated }: CreateMeetingModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    meetLink: "",
    scheduledDate: undefined as Date | undefined,
    scheduledTime: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { adminSession } = useAdminAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPG, PNG, etc.)",
          variant: "destructive",
        });
      }
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `meeting-images/${fileName}`;

    const { error } = await supabase.storage
      .from('meeting-images')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    const { data } = supabase.storage
      .from('meeting-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const isTimeValid = (selectedDate: Date, timeString: string): boolean => {
    if (!timeString) return false;
    
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const selectedDateOnly = new Date(selectedDate);
    selectedDateOnly.setHours(0, 0, 0, 0);
    
    // If it's a future date, any time is valid
    if (selectedDateOnly.getTime() > today.getTime()) {
      return true;
    }
    
    // If it's today, check if the time is in the future
    if (selectedDateOnly.getTime() === today.getTime()) {
      const [hours, minutes] = timeString.split(':').map(Number);
      const selectedDateTime = new Date();
      selectedDateTime.setHours(hours, minutes, 0, 0);
      
      return selectedDateTime.getTime() > now.getTime();
    }
    
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.meetLink || !formData.scheduledDate || !formData.scheduledTime) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate time selection
    if (!isTimeValid(formData.scheduledDate, formData.scheduledTime)) {
      toast({
        title: "Invalid time",
        description: "Please select a future time. For today's date, the time must be later than the current time.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
        if (!imageUrl) {
          toast({
            title: "Image upload failed",
            description: "Could not upload the image. Please try again.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      // Combine date and time
      const [hours, minutes] = formData.scheduledTime.split(':');
      const scheduledAt = new Date(formData.scheduledDate);
      scheduledAt.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const { error } = await supabase
        .from('meetings')
        .insert({
          title: formData.title,
          description: formData.description || null,
          image_url: imageUrl,
          meet_link: formData.meetLink,
          scheduled_at: scheduledAt.toISOString(),
          created_by: adminSession?.id,
        });

      if (error) {
        console.error('Error creating meeting:', error);
        toast({
          title: "Error creating meeting",
          description: "Could not create the meeting. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Meeting created!",
          description: "The meeting has been successfully created and is now visible to active students.",
        });
        
        // Reset form
        setFormData({
          title: "",
          description: "",
          meetLink: "",
          scheduledDate: undefined,
          scheduledTime: "",
        });
        setSelectedFile(null);
        onMeetingCreated();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Unexpected error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Create New Meeting
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter meeting title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Meeting description (optional)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Meeting Banner/Image</Label>
            <div className="flex items-center gap-2">
              <Input
                id="image"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image')?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {selectedFile ? selectedFile.name : "Choose Image"}
              </Button>
            </div>
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="meetLink">Google Meet Link *</Label>
            <Input
              id="meetLink"
              value={formData.meetLink}
              onChange={(e) => setFormData(prev => ({ ...prev, meetLink: e.target.value }))}
              placeholder="https://meet.google.com/abc-defg-hij"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Meeting Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.scheduledDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.scheduledDate ? format(formData.scheduledDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.scheduledDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, scheduledDate: date }))}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Meeting Time *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
              {formData.scheduledDate && formData.scheduledTime && !isTimeValid(formData.scheduledDate, formData.scheduledTime) && (
                <p className="text-xs text-destructive">
                  {format(formData.scheduledDate, "PPP") === format(new Date(), "PPP") 
                    ? "For today's date, please select a future time"
                    : "Please select a valid time"
                  }
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Meeting"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
