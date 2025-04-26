
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardItem } from "@/components/cards/card-item";
import {
  Code,
  Filter,
  Loader2,
  Plus,
  Search,
  Users
} from "lucide-react";
import CreateProjectModal from "./create-project-modal";

// Types for data
interface Project {
  id: string;
  title: string;
  description: string;
  creator_id: string;
  creator?: {
    name: string;
    avatar?: string;
  };
  team_size: string;
  skills_required: string[];
  roles_needed: string[];
  stage: string;
  tags: string[];
  created_at: string;
}

interface Hackathon {
  id: string;
  title: string;
  organizer: string;
  date: string;
  location: string;
  participants: number;
  prize: string;
  tags: string[];
  description: string;
}

export default function Collaborate() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showProjectModal, setShowProjectModal] = useState(false);
  
  // Fetch projects
  const { 
    data: projects = [], 
    isLoading: projectsLoading,
    refetch: refetchProjects
  } = useQuery({
    queryKey: ["projects", searchQuery, selectedCategory],
    queryFn: async () => {
      try {
        let query = supabase.from("projects").select(`
          *,
          creator:creator_id(id, email, name:user_metadata->name, avatar:user_metadata->avatar_url)
        `);
        
        // Apply search query
        if (searchQuery) {
          query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }
        
        // Apply category filter
        if (selectedCategory !== "all") {
          query = query.contains("tags", [selectedCategory]);
        }
        
        // Get results ordered by most recent
        const { data, error } = await query.order("created_at", { ascending: false });
        
        if (error) throw error;
        
        // Format the data
        return data.map((project) => ({
          ...project,
          creator: project.creator ? {
            name: project.creator.name || project.creator.email.split('@')[0],
            avatar: project.creator.avatar
          } : undefined
        }));
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast({
          title: "Error",
          description: "Failed to load projects. Please try again.",
          variant: "destructive"
        });
        return [];
      }
    }
  });
  
  // Fetch hackathons
  const { 
    data: hackathons = [], 
    isLoading: hackathonsLoading,
    refetch: refetchHackathons
  } = useQuery({
    queryKey: ["hackathons", searchQuery, selectedCategory],
    queryFn: async () => {
      try {
        let query = supabase.from("hackathons").select("*");
        
        // Apply search query
        if (searchQuery) {
          query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }
        
        // Apply category filter
        if (selectedCategory !== "all") {
          query = query.contains("tags", [selectedCategory]);
        }
        
        // Get results ordered by closest date
        const { data, error } = await query.order("date", { ascending: true });
        
        if (error) throw error;
        
        return data || [];
      } catch (error) {
        console.error("Error fetching hackathons:", error);
        toast({
          title: "Error",
          description: "Failed to load hackathons. Please try again.",
          variant: "destructive"
        });
        return [];
      }
    }
  });
  
  // Categories for filtering
  const categories = [
    "All", "Mobile App", "Web App", "Data Science", 
    "AI/ML", "Design", "Hardware", "Social Impact", "AR/VR"
  ];
  
  // Handle search
  const handleSearch = () => {
    refetchProjects();
    refetchHackathons();
  };
  
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:flex-1 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Collaborate</h1>
            <p className="text-muted-foreground">
              Connect with other students, join projects, and build together
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search projects..."
                className="pl-10 transition-soft"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="icon"
                onClick={handleSearch}
                title="Apply filters"
              >
                <Filter className="h-4 w-4" />
              </Button>
              <Button 
                className="transition-soft"
                onClick={() => {
                  if (user) {
                    setShowProjectModal(true);
                  } else {
                    toast({
                      title: "Authentication required",
                      description: "Please sign in to create a project",
                      variant: "destructive"
                    });
                  }
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="projects">
            <TabsList className="mb-6">
              <TabsTrigger value="projects" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="hackathons" className="flex items-center">
                <Code className="mr-2 h-4 w-4" />
                Hackathons
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects" className="animate-fade-in space-y-4">
              {projectsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : projects.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {projects.map((project) => (
                    <CardItem
                      key={project.id}
                      id={project.id}
                      type="project"
                      title={project.title}
                      description={project.description}
                      tags={project.tags}
                      creator={project.creator}
                      detailsUrl={`/project/${project.id}`}
                      metadata={[
                        {
                          icon: <Users className="h-4 w-4 text-muted-foreground" />,
                          value: project.team_size
                        },
                        {
                          icon: <Code className="h-4 w-4 text-muted-foreground" />,
                          value: project.stage
                        }
                      ]}
                      actionLabel={
                        project.creator_id === user?.id ? "Manage" : "Join Team"
                      }
                      onAction={() => {
                        if (!user) {
                          toast({
                            title: "Authentication required",
                            description: "Please sign in to join this project",
                            variant: "destructive"
                          });
                          return;
                        }
                        
                        if (project.creator_id === user.id) {
                          // Redirect to manage project page (not implemented yet)
                          toast({
                            title: "Manage Project",
                            description: "This is your project. Redirecting to management page."
                          });
                        } else {
                          // For demo purposes, just show a toast
                          toast({
                            title: "Request Sent",
                            description: `Your request to join ${project.title} has been sent!`
                          });
                        }
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                  <h3 className="mt-4 text-lg font-medium">No projects found</h3>
                  <p className="text-muted-foreground mt-2">
                    Be the first to create a project in this category
                  </p>
                  <Button className="mt-4" onClick={() => setShowProjectModal(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Project
                  </Button>
                </div>
              )}
              
              <div className="mt-8 text-center">
                <Button variant="outline">Load More</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="hackathons" className="animate-fade-in space-y-4">
              {hackathonsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : hackathons.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {hackathons.map((hackathon) => (
                    <CardItem
                      key={hackathon.id}
                      id={hackathon.id}
                      type="event"
                      title={hackathon.title}
                      description={hackathon.description}
                      tags={hackathon.tags}
                      creator={{
                        name: hackathon.organizer
                      }}
                      detailsUrl={`/hackathon/${hackathon.id}`}
                      metadata={[
                        {
                          icon: <Users className="h-4 w-4 text-muted-foreground" />,
                          value: `${hackathon.participants} participants`
                        },
                        {
                          icon: <Code className="h-4 w-4 text-muted-foreground" />,
                          value: hackathon.date
                        }
                      ]}
                      actionLabel="Register"
                      onAction={() => {
                        if (!user) {
                          toast({
                            title: "Authentication required",
                            description: "Please sign in to register for this hackathon",
                            variant: "destructive"
                          });
                          return;
                        }
                        
                        // For demo purposes, just show a toast
                        toast({
                          title: "Registration Successful",
                          description: `You're registered for ${hackathon.title}!`
                        });
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Code className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                  <h3 className="mt-4 text-lg font-medium">No hackathons found</h3>
                  <p className="text-muted-foreground mt-2">
                    Check back later for upcoming hackathons
                  </p>
                </div>
              )}
              
              <div className="mt-8 text-center">
                <Button variant="outline">Load More</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar */}
        <div className="lg:w-80 animate-fade-in">
          <div className="bg-card rounded-xl border p-6 shadow-sm space-y-6 sticky top-24">
            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category, i) => {
                  const value = category.toLowerCase().replace('/', '-').replace(' ', '-');
                  const isSelected = selectedCategory === value || (value === "all" && selectedCategory === "all");
                  return (
                    <button 
                      key={i}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-soft ${
                        isSelected 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-muted"
                      }`}
                      onClick={() => {
                        setSelectedCategory(category.toLowerCase());
                        refetchProjects();
                        refetchHackathons();
                      }}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Popular Topics</h3>
              <div className="flex flex-wrap gap-2">
                {["React", "Machine Learning", "Mobile", "UI/UX", "Sustainability", "Blockchain", "EdTech", "Health"].map((topic, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    size="sm"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all"
                    onClick={() => {
                      setSearchQuery(topic);
                      refetchProjects();
                      refetchHackathons();
                    }}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </div>
            
            {user && (
              <div>
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    onClick={() => setShowProjectModal(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Project
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="https://github.com" target="_blank" rel="noreferrer">
                      <Code className="mr-2 h-4 w-4" />
                      View GitHub Repos
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Create Project Modal */}
      <CreateProjectModal 
        isOpen={showProjectModal} 
        onClose={() => setShowProjectModal(false)}
      />
    </div>
  );
}
