import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Filter,
  Plus,
  Search,
  Loader2,
  Users,
  CalendarDays,
  RefreshCw,
} from "lucide-react";
import { ErrorFallback } from "@/components/ui/error-fallback";
import { CardItem } from "@/components/cards/card-item";
import { supabase, isSupabaseConfigured, getMockData } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import CreateProjectModal from "./create-project-modal";

// Project type
interface Project {
  id: string;
  title: string;
  description: string;
  creator_id: string;
  creator?: {
    name: string;
    avatar?: string;
  };
  skill_tags: string[];
  roles_needed: string[];
  deadline?: string;
  external_links?: {
    label: string;
    url: string;
  }[];
  created_at: string;
}

export default function Collaborate() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const supabaseConfigured = isSupabaseConfigured();

  // Fetch projects
  const {
    data: projects = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["projects", searchQuery, sortBy],
    queryFn: async () => {
      if (!supabaseConfigured) {
        // Return mock data when Supabase is not configured
        let mockData = getMockData('projects') as Project[];
        
        // Apply filtering
        if (searchQuery) {
          mockData = mockData.filter(project => 
            project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        // Apply sorting
        if (sortBy === "newest") {
          mockData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
        
        return mockData;
      }

      try {
        let query = supabase.from("projects").select(`
          *,
          creator:creator_id(id, email, name:user_metadata->name, avatar:user_metadata->avatar_url)
        `);

        if (searchQuery) {
          query = query.or(
            `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
          );
        }

        // Apply sorting
        if (sortBy === "newest") {
          query = query.order("created_at", { ascending: false });
        } else if (sortBy === "popular") {
          // For simplicity, we'll still sort by created_at
          // In a real app, you might have a view_count or likes column
          query = query.order("created_at", { ascending: false });
        }

        const { data, error } = await query;

        if (error) throw error;

        // Format the data
        return data.map((project) => ({
          ...project,
          creator: project.creator
            ? {
                name: project.creator.name || project.creator.email.split("@")[0],
                avatar: project.creator.avatar,
              }
            : undefined,
        }));
      } catch (error) {
        console.error("Error fetching projects:", error);
        throw error;
      }
    },
  });

  // Handle project creation
  const handleProjectCreated = () => {
    setShowModal(false);
    refetch();
    toast({
      title: "Project created!",
      description: "Your project has been published successfully.",
    });
  };

  // Handle join project
  const handleJoinProject = async (projectId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to join projects",
        variant: "destructive",
      });
      return;
    }

    if (!supabaseConfigured) {
      toast({
        title: "Demo Mode",
        description: "Project joining is available after connecting to Supabase",
      });
      return;
    }

    try {
      // Check if user is already a member
      const { data: existingMember, error: checkError } = await supabase
        .from("project_members")
        .select()
        .eq("project_id", projectId)
        .eq("user_id", user.id)
        .single();

      if (!checkError && existingMember) {
        toast({
          title: "Already joined",
          description: "You are already a member of this project",
        });
        return;
      }

      // Get project to check if creator is the same as current user
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("creator_id")
        .eq("id", projectId)
        .single();

      if (projectError) throw projectError;

      if (project.creator_id === user.id) {
        toast({
          title: "Cannot join",
          description: "You are the creator of this project",
        });
        return;
      }

      // Insert into project_members
      const { error: joinError } = await supabase.from("project_members").insert({
        project_id: projectId,
        user_id: user.id,
        role: "member", // Default role
        joined_at: new Date().toISOString(),
      });

      if (joinError) throw joinError;

      toast({
        title: "Project joined!",
        description: "You have successfully joined this project.",
      });
    } catch (error: any) {
      console.error("Error joining project:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to join project",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-24 px-4">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Collaborate</h1>
          <p className="text-muted-foreground max-w-3xl">
            Find exciting projects to join or create your own and build with talented
            students from around the world.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search projects..."
              className="pl-10 transition-soft"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  refetch();
                }
              }}
            />
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="transition-soft" onClick={() => refetch()}>
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button
              className="transition-soft"
              onClick={() => setShowModal(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <ErrorFallback
            title="Failed to load projects"
            message="There was an error loading the project data. Please try again."
            onRetry={() => refetch()}
          />
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No projects found</h3>
            <p className="text-muted-foreground mt-2 mb-6">
              Be the first to create a project or adjust your search criteria.
            </p>
            <Button onClick={() => setShowModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <CardItem
                key={project.id}
                id={project.id}
                type="project"
                title={project.title}
                description={project.description}
                tags={[...project.skill_tags, ...project.roles_needed.map(role => `Role: ${role}`)]}
                creator={project.creator}
                detailsUrl={`/project/${project.id}`}
                metadata={[
                  {
                    icon: <Users className="h-4 w-4 text-muted-foreground" />,
                    value: project.roles_needed.length > 0 
                      ? `Looking for: ${project.roles_needed.slice(0, 2).join(", ")}${project.roles_needed.length > 2 ? '...' : ''}` 
                      : "Open to all"
                  },
                  project.deadline ? {
                    icon: <CalendarDays className="h-4 w-4 text-muted-foreground" />,
                    value: `Deadline: ${new Date(project.deadline).toLocaleDateString()}`
                  } : undefined
                ].filter(Boolean)}
                actionLabel="Join Project"
                onAction={() => handleJoinProject(project.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}
