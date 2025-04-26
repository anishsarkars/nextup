import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormWizard } from "@/components/forms/form-wizard";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

// Schema for gig creation
const gigSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  gig_type: z.enum(["offering", "seeking"]),
  rate: z.string().min(1, "Rate is required"),
  duration: z.string().min(1, "Duration is required"),
  availability: z.string().min(1, "Availability is required"),
  deadline: z.string().optional(),
});

type GigFormValues = z.infer<typeof gigSchema>;

interface PostGigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PostGigModal({ isOpen, onClose }: PostGigModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTag, setCurrentTag] = useState("");
  const supabaseConfigured = isSupabaseConfigured();
  
  const form = useForm<GigFormValues>({
    resolver: zodResolver(gigSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      gig_type: "offering",
      rate: "",
      duration: "",
      availability: "",
      deadline: "",
    },
  });

  // Steps for the wizard
  const steps = [
    {
      title: "Gig Details",
      description: "Title and description of your gig",
      content: (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="gig_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gig Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gig type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="offering">I'm offering my skills</SelectItem>
                    <SelectItem value="seeking">I'm looking for help</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gig Title</FormLabel>
                <FormControl>
                  <Input placeholder="E.g. Web Development & React Projects" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe what you're offering or seeking" 
                    {...field} 
                    className="min-h-[120px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ),
    },
    {
      title: "Skills & Tags",
      description: "Add relevant skills and tags",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <FormLabel>Skill Tags</FormLabel>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.watch("tags").map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                  {tag}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => {
                      const currentTags = form.getValues("tags");
                      form.setValue(
                        "tags",
                        currentTags.filter((_, i) => i !== index)
                      );
                    }}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. React, Design, Python"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && currentTag.trim()) {
                    e.preventDefault();
                    const currentTags = form.getValues("tags");
                    if (!currentTags.includes(currentTag.trim())) {
                      form.setValue("tags", [
                        ...currentTags,
                        currentTag.trim(),
                      ]);
                    }
                    setCurrentTag("");
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => {
                  if (currentTag.trim()) {
                    const currentTags = form.getValues("tags");
                    if (!currentTags.includes(currentTag.trim())) {
                      form.setValue("tags", [
                        ...currentTags,
                        currentTag.trim(),
                      ]);
                    }
                    setCurrentTag("");
                  }
                }}
              >
                Add
              </Button>
            </div>
            {form.formState.errors.tags && (
              <p className="text-sm text-destructive mt-2">
                {form.formState.errors.tags.message}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Add skills and keywords relevant to your gig to help others find it
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Terms",
      description: "Set your rates and availability",
      content: (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate</FormLabel>
                <FormControl>
                  <Input placeholder="E.g. $30/hr or Fixed $150" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration / Timeline</FormLabel>
                <FormControl>
                  <Input placeholder="E.g. 1 week, 2-4 hours" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Availability</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your availability" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Available now">Available now</SelectItem>
                    <SelectItem value="Available next week">Available next week</SelectItem>
                    <SelectItem value="Available weekends only">Available weekends only</SelectItem>
                    <SelectItem value="Limited availability">Limited availability</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deadline (Optional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ),
    },
    {
      title: "Review",
      description: "Review and post your gig",
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Type</h3>
            <p className="text-muted-foreground">
              {form.getValues("gig_type") === "offering" 
                ? "Offering Skills" 
                : "Seeking Help"}
            </p>
          </div>
          <div>
            <h3 className="font-medium">Title</h3>
            <p className="text-muted-foreground">{form.getValues("title")}</p>
          </div>
          <div>
            <h3 className="font-medium">Description</h3>
            <p className="text-muted-foreground">{form.getValues("description")}</p>
          </div>
          <div>
            <h3 className="font-medium">Skills & Tags</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {form.getValues("tags").map((tag, index) => (
                <Badge key={index} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Rate</h3>
              <p className="text-muted-foreground">{form.getValues("rate")}</p>
            </div>
            <div>
              <h3 className="font-medium">Duration</h3>
              <p className="text-muted-foreground">{form.getValues("duration")}</p>
            </div>
            <div>
              <h3 className="font-medium">Availability</h3>
              <p className="text-muted-foreground">{form.getValues("availability")}</p>
            </div>
            {form.getValues("deadline") && (
              <div>
                <h3 className="font-medium">Deadline</h3>
                <p className="text-muted-foreground">{form.getValues("deadline")}</p>
              </div>
            )}
          </div>
        </div>
      ),
    },
  ];
  
  const handleCreateGig = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post a gig",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const values = form.getValues();
      
      if (!supabaseConfigured) {
        // Handle demo mode
        setTimeout(() => {
          toast({
            title: "Gig posted!",
            description: "Your gig has been published in demo mode. In a production environment, this would be saved to Supabase.",
          });
          
          // Reset form and close modal
          form.reset();
          setIsSubmitting(false);
          onClose();
        }, 1000);
        return;
      }
      
      const { error } = await supabase
        .from("gigs")
        .insert({
          title: values.title,
          description: values.description,
          tags: values.tags,
          gig_type: values.gig_type,
          rate: values.rate,
          duration: values.duration,
          availability: values.availability,
          deadline: values.deadline || null,
          poster_id: user.id,
          created_at: new Date().toISOString(),
        });
      
      if (error) throw error;
      
      toast({
        title: "Gig posted!",
        description: "Your gig has been published successfully.",
      });
      
      // Reset form
      form.reset();
      
      // Invalidate gigs query to refetch latest data
      queryClient.invalidateQueries({ queryKey: ["gigs"] });
      queryClient.invalidateQueries({ queryKey: ["user-gigs", user.id] });
      
      onClose();
    } catch (error: any) {
      console.error("Error posting gig:", error);
      toast({
        title: "Failed to post gig",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Post a Gig</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form className="space-y-4">
            <FormWizard
              steps={steps}
              onComplete={handleCreateGig}
              isSubmitting={isSubmitting}
              submitButtonText="Post Gig"
            />
            
            {!supabaseConfigured && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                Running in demo mode. Gig data won't be permanently stored.
              </p>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
