
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormWizard } from "@/components/forms/form-wizard";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
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

// Schema for project creation
const projectSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  skills_required: z.array(z.string()).min(1, "At least one skill is required"),
  roles_needed: z.array(z.string()).min(1, "At least one role is required"),
  team_size: z.string().min(1, "Team size is required"),
  stage: z.string().min(1, "Project stage is required"),
  deadline: z.string().optional(),
  external_link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSkill, setCurrentSkill] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      skills_required: [],
      roles_needed: [],
      team_size: "",
      stage: "",
      deadline: "",
      external_link: "",
    },
  });

  // Steps for the wizard
  const steps = [
    {
      title: "Basics",
      description: "Project title and description",
      content: (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a concise title for your project" {...field} />
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
                    placeholder="Describe your project idea and goals" 
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
      title: "Skills & Roles",
      description: "What skills and roles are needed?",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <FormLabel>Required Skills</FormLabel>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.watch("skills_required").map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                  {skill}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => {
                      const currentSkills = form.getValues("skills_required");
                      form.setValue(
                        "skills_required",
                        currentSkills.filter((_, i) => i !== index)
                      );
                    }}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. React, Python, UI/UX"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && currentSkill.trim()) {
                    e.preventDefault();
                    const currentSkills = form.getValues("skills_required");
                    if (!currentSkills.includes(currentSkill.trim())) {
                      form.setValue("skills_required", [
                        ...currentSkills,
                        currentSkill.trim(),
                      ]);
                    }
                    setCurrentSkill("");
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => {
                  if (currentSkill.trim()) {
                    const currentSkills = form.getValues("skills_required");
                    if (!currentSkills.includes(currentSkill.trim())) {
                      form.setValue("skills_required", [
                        ...currentSkills,
                        currentSkill.trim(),
                      ]);
                    }
                    setCurrentSkill("");
                  }
                }}
              >
                Add
              </Button>
            </div>
            {form.formState.errors.skills_required && (
              <p className="text-sm text-destructive mt-2">
                {form.formState.errors.skills_required.message}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <FormLabel>Roles Needed</FormLabel>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.watch("roles_needed").map((role, index) => (
                <Badge key={index} variant="outline" className="text-sm py-1 px-3">
                  {role}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => {
                      const currentRoles = form.getValues("roles_needed");
                      form.setValue(
                        "roles_needed",
                        currentRoles.filter((_, i) => i !== index)
                      );
                    }}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. Frontend Developer, UI Designer"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && currentRole.trim()) {
                    e.preventDefault();
                    const currentRoles = form.getValues("roles_needed");
                    if (!currentRoles.includes(currentRole.trim())) {
                      form.setValue("roles_needed", [
                        ...currentRoles,
                        currentRole.trim(),
                      ]);
                    }
                    setCurrentRole("");
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => {
                  if (currentRole.trim()) {
                    const currentRoles = form.getValues("roles_needed");
                    if (!currentRoles.includes(currentRole.trim())) {
                      form.setValue("roles_needed", [
                        ...currentRoles,
                        currentRole.trim(),
                      ]);
                    }
                    setCurrentRole("");
                  }
                }}
              >
                Add
              </Button>
            </div>
            {form.formState.errors.roles_needed && (
              <p className="text-sm text-destructive mt-2">
                {form.formState.errors.roles_needed.message}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Details",
      description: "Team size, stage, and deadlines",
      content: (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="team_size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Size</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1-2">1-2 members</SelectItem>
                    <SelectItem value="2-4">2-4 members</SelectItem>
                    <SelectItem value="3-5">3-5 members</SelectItem>
                    <SelectItem value="5+">5+ members</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Stage</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project stage" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Ideation">Ideation</SelectItem>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Prototype">Prototype</SelectItem>
                    <SelectItem value="Development">Development</SelectItem>
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
          <FormField
            control={form.control}
            name="external_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>External Link (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="url" 
                    placeholder="e.g. GitHub repository, Figma design" 
                    {...field} 
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
      title: "Review",
      description: "Review and publish your project",
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Project Title</h3>
            <p className="text-muted-foreground">{form.getValues("title")}</p>
          </div>
          <div>
            <h3 className="font-medium">Description</h3>
            <p className="text-muted-foreground">{form.getValues("description")}</p>
          </div>
          <div>
            <h3 className="font-medium">Required Skills</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {form.getValues("skills_required").map((skill, index) => (
                <Badge key={index} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-medium">Roles Needed</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {form.getValues("roles_needed").map((role, index) => (
                <Badge key={index} variant="outline">{role}</Badge>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Team Size</h3>
              <p className="text-muted-foreground">{form.getValues("team_size")}</p>
            </div>
            <div>
              <h3 className="font-medium">Project Stage</h3>
              <p className="text-muted-foreground">{form.getValues("stage")}</p>
            </div>
            {form.getValues("deadline") && (
              <div>
                <h3 className="font-medium">Deadline</h3>
                <p className="text-muted-foreground">{form.getValues("deadline")}</p>
              </div>
            )}
            {form.getValues("external_link") && (
              <div>
                <h3 className="font-medium">External Link</h3>
                <p className="text-muted-foreground">{form.getValues("external_link")}</p>
              </div>
            )}
          </div>
        </div>
      ),
    },
  ];
  
  const handleCreateProject = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a project",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const values = form.getValues();
      
      // Prepare tags from skills for better searchability
      const tags = [...new Set([...values.skills_required, ...values.roles_needed])];
      
      const { error } = await supabase
        .from("projects")
        .insert({
          title: values.title,
          description: values.description,
          skills_required: values.skills_required,
          roles_needed: values.roles_needed,
          team_size: values.team_size,
          stage: values.stage,
          deadline: values.deadline || null,
          external_link: values.external_link || null,
          creator_id: user.id,
          tags: tags,
          created_at: new Date().toISOString(),
        });
      
      if (error) throw error;
      
      toast({
        title: "Project created!",
        description: "Your project has been published successfully.",
      });
      
      // Reset form and close modal
      form.reset();
      
      // Invalidate projects query to refetch latest data
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["user-projects", user.id] });
      
      onClose();
    } catch (error: any) {
      console.error("Error creating project:", error);
      toast({
        title: "Failed to create project",
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
          <DialogTitle className="text-2xl font-bold">Create New Project</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form className="space-y-4">
            <FormWizard
              steps={steps}
              onComplete={handleCreateProject}
              isSubmitting={isSubmitting}
              submitButtonText="Create Project"
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
