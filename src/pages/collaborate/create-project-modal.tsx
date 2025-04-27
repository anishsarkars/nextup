
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelector } from "@/components/ui/multi-selector"; // Now we've created this component

const projectSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters."
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters."
  }),
  category: z.string().min(1, {
    message: "Please select a category."
  }),
  tags: z.array(z.string()).optional(),
  is_private: z.boolean().default(false)
});

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: () => void;
}

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated }: CreateProjectModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, control, reset } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      is_private: false
    }
  });

  const categories = [
    "Web Development",
    "Mobile App Development",
    "Data Science",
    "Machine Learning",
    "AI",
    "UI/UX Design",
    "Graphic Design",
    "Marketing",
    "Business",
    "Other"
  ];

  const handleCreateProject = async (data: z.infer<typeof projectSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a project",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from("projects").insert({
        ...data,
        owner_id: user.id,
        // Add the skill_tags and roles_needed fields to match our Project interface
        skill_tags: data.tags || [],
        roles_needed: [],
        created_at: new Date().toISOString()
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Project created",
        description: "Your project has been created successfully"
      });

      // Invalidate and refetch projects
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      
      // Reset the form
      reset();
    } catch (error: any) {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      // Optional chaining to handle potential undefined onProjectCreated
      onProjectCreated?.();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleCreateProject)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title">Title</label>
            <Input
              id="title"
              placeholder="Project Title"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <label htmlFor="description">Description</label>
            <Textarea
              id="description"
              placeholder="Project Description"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <label htmlFor="category">Category</label>
            <Select
              control={control}
              name="category"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <label htmlFor="tags">Tags</label>
            <MultiSelector
              control={control}
              name="tags"
              placeholder="Add some tags"
              options={[
                { value: "react", label: "React" },
                { value: "typescript", label: "TypeScript" },
                { value: "javascript", label: "JavaScript" },
                { value: "node", label: "Node.js" },
                { value: "python", label: "Python" },
                { value: "django", label: "Django" },
                { value: "flask", label: "Flask" },
                { value: "tailwindcss", label: "TailwindCSS" },
                { value: "nextjs", label: "Next.js" },
                { value: "supabase", label: "Supabase" }
              ]}
            />
            {errors.tags && (
              <p className="text-sm text-red-500">{errors.tags.message}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_private"
              {...register("is_private")}
              defaultChecked={false}
            />
            <label
              htmlFor="is_private"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Private Project?
            </label>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Project"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
