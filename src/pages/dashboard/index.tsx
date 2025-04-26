
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { CardItem } from "@/components/cards/card-item";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Clock, 
  Loader2, 
  BookOpen, 
  Calendar, 
  Star, 
  Users,
  Plus,
  ArrowRight,
} from "lucide-react";

export default function Dashboard() {
  const { user, userProfile, loading } = useAuth();
  
  // Fetch user's bookmarks
  const { data: bookmarks = [], isLoading: bookmarksLoading } = useQuery({
    queryKey: ["user-bookmarks", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        const { data, error } = await supabase
          .from("bookmarks")
          .select(`
            id,
            item_id,
            item_type,
            created_at,
            scholarship:item_id(id, title, description, provider, amount, deadline, tags),
            event:item_id(id, title, description, organizer, date, location, tags),
            project:item_id(id, title, description, creator_id, roles_needed, skills_required, tags),
            gig:item_id(id, title, description, poster_id, rate, duration, deadline, tags)
          `)
          .eq("user_id", user.id);
        
        if (error) throw error;
        
        return data || [];
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
        return [];
      }
    },
    enabled: !!user
  });

  // Fetch recommended items
  const { data: recommendations = [], isLoading: recommendationsLoading } = useQuery({
    queryKey: ["recommendations", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // In a real app, you'd have a more sophisticated recommendation system
      // For now, just fetch recent items
      try {
        const [scholarships, events, projects, gigs] = await Promise.all([
          supabase.from("scholarships").select("*").limit(2).order("created_at", { ascending: false }),
          supabase.from("events").select("*").limit(2).order("created_at", { ascending: false }),
          supabase.from("projects").select("*").limit(2).order("created_at", { ascending: false }),
          supabase.from("gigs").select("*").limit(2).order("created_at", { ascending: false })
        ]);
        
        const allRecommendations = [
          ...(scholarships.data || []).map(item => ({ ...item, type: "scholarship" })),
          ...(events.data || []).map(item => ({ ...item, type: "event" })),
          ...(projects.data || []).map(item => ({ ...item, type: "project" })),
          ...(gigs.data || []).map(item => ({ ...item, type: "gig" }))
        ];
        
        return allRecommendations;
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        return [];
      }
    },
    enabled: !!user
  });
  
  // Get user projects
  const { data: userProjects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["user-projects", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("creator_id", user.id);
        
        if (error) throw error;
        
        return data || [];
      } catch (error) {
        console.error("Error fetching user projects:", error);
        return [];
      }
    },
    enabled: !!user
  });
  
  // Get user gigs
  const { data: userGigs = [], isLoading: gigsLoading } = useQuery({
    queryKey: ["user-gigs", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        const { data, error } = await supabase
          .from("gigs")
          .select("*")
          .eq("poster_id", user.id);
        
        if (error) throw error;
        
        return data || [];
      } catch (error) {
        console.error("Error fetching user gigs:", error);
        return [];
      }
    },
    enabled: !!user
  });
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Loading your dashboard...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Welcome section */}
        <div className="bg-card border rounded-xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Welcome back, {user?.user_metadata?.name || user?.email?.split("@")[0] || "User"}!</h1>
            <p className="text-muted-foreground">
              Here's what's happening with your NextUP activity
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/collaborate">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/skillswap">
                <Star className="h-4 w-4 mr-2" />
                Offer Skills
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Recommendations */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Recommended for You</h2>
            <Button variant="ghost" size="sm" className="gap-1" asChild>
              <Link to="/discover">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
          
          {recommendationsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.slice(0, 3).map((item: any) => (
                <CardItem
                  key={`${item.type}-${item.id}`}
                  id={item.id}
                  type={item.type}
                  title={item.title}
                  description={item.description || "No description available"}
                  tags={item.tags || []}
                  detailsUrl={`/${item.type}/${item.id}`}
                  metadata={[
                    item.type === "scholarship" ? {
                      icon: <BookOpen className="h-4 w-4 text-muted-foreground" />,
                      value: item.amount
                    } : item.type === "event" ? {
                      icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
                      value: item.date
                    } : item.type === "project" ? {
                      icon: <Users className="h-4 w-4 text-muted-foreground" />,
                      value: "Project"
                    } : {
                      icon: <Star className="h-4 w-4 text-muted-foreground" />,
                      value: item.rate
                    },
                    {
                      icon: <Clock className="h-4 w-4 text-muted-foreground" />,
                      value: item.deadline || item.date || "Open"
                    },
                  ]}
                  actionLabel={
                    item.type === "scholarship" ? "Apply" :
                    item.type === "event" ? "Register" :
                    item.type === "project" ? "Join" :
                    "Contact"
                  }
                />
              ))}
            </div>
          ) : (
            <div className="bg-muted/30 border-dashed border-2 rounded-xl p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No recommendations yet</h3>
              <p className="text-muted-foreground mb-4">
                As you use NextUP, we'll suggest personalized opportunities based on your profile
              </p>
              <Button asChild>
                <Link to="/discover">Explore Opportunities</Link>
              </Button>
            </div>
          )}
        </section>
        
        {/* My Content */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">My Activity</h2>
          
          <Tabs defaultValue="bookmarks" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="bookmarks" className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Bookmarks
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                My Projects
              </TabsTrigger>
              <TabsTrigger value="gigs" className="flex items-center">
                <Star className="mr-2 h-4 w-4" />
                My Gigs
              </TabsTrigger>
            </TabsList>
            
            {/* Bookmarks Tab */}
            <TabsContent value="bookmarks" className="animate-fade-in">
              {bookmarksLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : bookmarks.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookmarks.map((bookmark: any) => {
                    // Determine the item based on type
                    const itemType = bookmark.item_type;
                    let item;
                    
                    switch (itemType) {
                      case "scholarship":
                        item = bookmark.scholarship;
                        break;
                      case "event":
                        item = bookmark.event;
                        break;
                      case "project":
                        item = bookmark.project;
                        break;
                      case "gig":
                        item = bookmark.gig;
                        break;
                      default:
                        return null;
                    }
                    
                    if (!item) return null;
                    
                    return (
                      <CardItem
                        key={bookmark.id}
                        id={item.id}
                        type={itemType}
                        title={item.title}
                        description={item.description || "No description available"}
                        tags={item.tags || []}
                        bookmarked={true}
                        detailsUrl={`/${itemType}/${item.id}`}
                        metadata={[
                          itemType === "scholarship" ? {
                            icon: <BookOpen className="h-4 w-4 text-muted-foreground" />,
                            value: item.amount
                          } : itemType === "event" ? {
                            icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
                            value: item.date
                          } : itemType === "project" ? {
                            icon: <Users className="h-4 w-4 text-muted-foreground" />,
                            value: "Project"
                          } : {
                            icon: <Star className="h-4 w-4 text-muted-foreground" />,
                            value: item.rate
                          },
                          {
                            icon: <Clock className="h-4 w-4 text-muted-foreground" />,
                            value: item.deadline || item.date || "Open"
                          },
                        ]}
                        actionLabel={
                          itemType === "scholarship" ? "Apply" :
                          itemType === "event" ? "Register" :
                          itemType === "project" ? "Join" :
                          "Contact"
                        }
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="bg-muted/30 border-dashed border-2 rounded-xl p-8 text-center">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                  <h3 className="mt-4 text-lg font-medium">No bookmarks yet</h3>
                  <p className="text-muted-foreground mt-2 mb-4">
                    Save items you're interested in for easy access later
                  </p>
                  <Button asChild>
                    <Link to="/discover">Explore Opportunities</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {/* Projects Tab */}
            <TabsContent value="projects" className="animate-fade-in">
              {projectsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : userProjects.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userProjects.map((project: any) => (
                    <CardItem
                      key={project.id}
                      id={project.id}
                      type="project"
                      title={project.title}
                      description={project.description || "No description available"}
                      tags={project.tags || []}
                      detailsUrl={`/project/${project.id}`}
                      metadata={[
                        {
                          icon: <Users className="h-4 w-4 text-muted-foreground" />,
                          value: `${project.team_size || "0"} members`
                        },
                        {
                          icon: <Clock className="h-4 w-4 text-muted-foreground" />,
                          value: project.stage || "In progress"
                        },
                      ]}
                      actionLabel="Manage"
                    />
                  ))}
                  
                  {/* Create Project Card */}
                  <div className="bg-muted/30 border-dashed border-2 rounded-xl p-6 flex flex-col items-center justify-center text-center h-[400px]">
                    <div className="p-4 rounded-full bg-muted">
                      <Plus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-6 font-medium">Create a New Project</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2 mb-6">
                      Looking for collaborators? Start a project and find talented teammates.
                    </p>
                    <Button asChild>
                      <Link to="/collaborate">Create Project</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-muted/30 border-dashed border-2 rounded-xl p-8 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                  <h3 className="mt-4 text-lg font-medium">No projects yet</h3>
                  <p className="text-muted-foreground mt-2 mb-4">
                    Create your first project and find teammates to collaborate with
                  </p>
                  <Button asChild>
                    <Link to="/collaborate">Create Project</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {/* Gigs Tab */}
            <TabsContent value="gigs" className="animate-fade-in">
              {gigsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : userGigs.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userGigs.map((gig: any) => (
                    <CardItem
                      key={gig.id}
                      id={gig.id}
                      type="gig"
                      title={gig.title}
                      description={gig.description || "No description available"}
                      tags={gig.tags || []}
                      detailsUrl={`/gig/${gig.id}`}
                      metadata={[
                        {
                          icon: <Star className="h-4 w-4 text-muted-foreground" />,
                          value: gig.rate || "Negotiable"
                        },
                        {
                          icon: <Clock className="h-4 w-4 text-muted-foreground" />,
                          value: gig.duration || "Flexible"
                        },
                      ]}
                      actionLabel="Manage"
                    />
                  ))}
                  
                  {/* Create Gig Card */}
                  <div className="bg-muted/30 border-dashed border-2 rounded-xl p-6 flex flex-col items-center justify-center text-center h-[400px]">
                    <div className="p-4 rounded-full bg-muted">
                      <Plus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-6 font-medium">Post a New Gig</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2 mb-6">
                      Offer your skills or post an opportunity for other talented students.
                    </p>
                    <Button asChild>
                      <Link to="/skillswap">Post Gig</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-muted/30 border-dashed border-2 rounded-xl p-8 text-center">
                  <Star className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                  <h3 className="mt-4 text-lg font-medium">No gigs yet</h3>
                  <p className="text-muted-foreground mt-2 mb-4">
                    Offer your skills or post gig opportunities for others
                  </p>
                  <Button asChild>
                    <Link to="/skillswap">Post Gig</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>
      </motion.div>
    </div>
  );
}
