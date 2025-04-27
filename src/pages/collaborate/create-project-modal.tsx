
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelector } from "@/components/ui/multi-selector";
import { useToast } from "@/hooks/use-toast";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

// Define the form schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  roles_needed: z.array(z.string()).optional(),
  deadline: z.string().optional(),
  is_private: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: () => void;
}

const CATEGORIES = [
  "Web Development",
  "Mobile App",
  "Data Science",
  "AI/ML",
  "UI/UX Design",
  "Blockchain",
  "IoT",
  "Game Development",
  "Other",
];

const SKILL_TAGS = [
  "JavaScript",
  "React",
  "Python",
  "Node.js",
  "UX Design",
  "Figma",
  "TypeScript",
  "Flutter",
  "Vue.js",
  "SQL",
  "NoSQL",
  "AWS",
  "Firebase",
  "TensorFlow",
  "Blockchain",
  "Smart Contracts",
  "Unity",
  "3D Modeling",
  "AR/VR",
  "GraphQL",
];

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "UI/UX Designer",
  "Full Stack Developer",
  "Mobile Developer",
  "Data Scientist",
  "DevOps Engineer",
  "Product Manager",
  "Project Manager",
  "QA Engineer",
  "Content Writer",
  "Marketing Specialist",
];

export default function CreateProjectModal({
  isOpen,
  onClose,
  onProjectCreated,
}: CreateProjectModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabaseConfigured = isSupabaseConfigured();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      tags: [],
      roles_needed: [],
      deadline: "",
      is_private: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a project",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // For demo when Supabase isn't configured
      if (!supabaseConfigured) {
        setTimeout(() => {
          setIsSubmitting(false);
          onProjectCreated();
          toast({
            title: "Project created in demo mode",
            description: "Your project would be created if Supabase was configured.",
          });
        }, 1000);
        return;
      }

      // Real implementation with Supabase
      const { error } = await supabase.from("projects").insert({
        title: values.title,
        description: values.description,
        creator_id: user.id,
        skill_tags: values.tags,
        roles_needed: values.roles_needed || [],
        deadline: values.deadline || null,
        is_private: values.is_private,
        category: values.category,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Project created!",
        description: "Your project has been published successfully.",
      });
      onProjectCreated();
    } catch (error: any) {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project title" {...field} />
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
                      placeholder="Describe your project and what you're looking to achieve"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills/Technologies</FormLabel>
                  <FormControl>
                    <MultiSelector
                      placeholder="Select technologies used in this project"
                      options={SKILL_TAGS.map(tag => ({ label: tag, value: tag }))}
                      values={field.value.map(value => ({ label: value, value }))}
                      onChange={values => field.onChange(values.map(v => v.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roles_needed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roles Needed (Optional)</FormLabel>
                  <FormControl>
                    <MultiSelector
                      placeholder="Select roles you're looking for"
                      options={ROLES.map(role => ({ label: role, value: role }))}
                      values={(field.value || []).map(value => ({ label: value, value }))}
                      onChange={values => field.onChange(values.map(v => v.value))}
                    />
                  </FormControl>
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
              name="is_private"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Private Project</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
