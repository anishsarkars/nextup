
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { supabase, isSupabaseConfigured, getMockData } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardItem } from "@/components/cards/card-item";
import {
  Filter,
  Loader2,
  Plus,
  Search,
  Star,
  BriefcaseIcon,
  DollarSign,
  Clock,
} from "lucide-react";
import PostGigModal from "./post-gig-modal";

// Types for data
interface Gig {
  id: string;
  title: string;
  description: string;
  poster_id: string;
  poster?: {
    name: string;
    avatar?: string;
  };
  gig_type: "offering" | "seeking";
  rate: string;
  duration: string;
  availability: string;
  deadline?: string;
  tags: string[];
  created_at: string;
}

export default function SkillSwap() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("services");
  const [searchQuery, setSearchQuery] = useState("");
  const [showGigModal, setShowGigModal] = useState(false);
  const supabaseConfigured = isSupabaseConfigured();
  
  // Fetch services (offerings)
  const { 
    data: services = [], 
    isLoading: servicesLoading,
    refetch: refetchServices
  } = useQuery({
    queryKey: ["gigs-services", searchQuery],
    queryFn: async () => {
      if (!supabaseConfigured) {
        // Return mock data when Supabase is not configured
        const mockData = getMockData('gigs');
        
        // Filter for offerings only
        let filteredData = mockData.filter(gig => gig.gig_type === 'offering');
        
        // Apply search query if provided
        if (searchQuery) {
          filteredData = filteredData.filter(gig => 
            gig.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            gig.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            gig.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        }
        
        return filteredData;
      }

      try {
        let query = supabase.from("gigs").select(`
          *,
          poster:poster_id(id, email, name:user_metadata->name, avatar:user_metadata->avatar_url)
        `)
        .eq("gig_type", "offering");
        
        // Apply search query
        if (searchQuery) {
          query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`);
        }
        
        // Get results ordered by most recent
        const { data, error } = await query.order("created_at", { ascending: false });
        
        if (error) throw error;
        
        // Format the data
        return data.map((gig) => ({
          ...gig,
          poster: gig.poster ? {
            name: gig.poster.name || gig.poster.email.split('@')[0],
            avatar: gig.poster.avatar
          } : undefined
        }));
      } catch (error) {
        console.error("Error fetching services:", error);
        toast({
          title: "Error",
          description: "Failed to load services. Please try again.",
          variant: "destructive"
        });
        return [];
      }
    }
  });
  
  // Fetch gigs (seeking help)
  const { 
    data: gigs = [], 
    isLoading: gigsLoading,
    refetch: refetchGigs
  } = useQuery({
    queryKey: ["gigs-seeking", searchQuery],
    queryFn: async () => {
      if (!supabaseConfigured) {
        // Return mock data when Supabase is not configured
        const mockData = getMockData('gigs');
        
        // Filter for seeking only
        let filteredData = mockData.filter(gig => gig.gig_type === 'seeking');
        
        // Apply search query if provided
        if (searchQuery) {
          filteredData = filteredData.filter(gig => 
            gig.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            gig.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            gig.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        }
        
        return filteredData;
      }

      try {
        let query = supabase.from("gigs").select(`
          *,
          poster:poster_id(id, email, name:user_metadata->name, avatar:user_metadata->avatar_url)
        `)
        .eq("gig_type", "seeking");
        
        // Apply search query
        if (searchQuery) {
          query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`);
        }
        
        // Get results ordered by most recent
        const { data, error } = await query.order("created_at", { ascending: false });
        
        if (error) throw error;
        
        // Format the data
        return data.map((gig) => ({
          ...gig,
          poster: gig.poster ? {
            name: gig.poster.name || gig.poster.email.split('@')[0],
            avatar: gig.poster.avatar
          } : undefined
        }));
      } catch (error) {
        console.error("Error fetching gigs:", error);
        toast({
          title: "Error",
          description: "Failed to load gigs. Please try again.",
          variant: "destructive"
        });
        return [];
      }
    }
  });
  
  // Handle search
  const handleSearch = () => {
    refetchServices();
    refetchGigs();
  };
  
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">SkillSwap & Gigs</h1>
          <p className="text-muted-foreground">
            Offer your skills, find short-term gigs, and collaborate on projects
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search skills or gigs..."
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
          <Button 
            variant="outline" 
            className="sm:w-auto w-full transition-soft"
            onClick={handleSearch}
          >
            <Filter className="mr-2 h-4 w-4" />
            Search
          </Button>
          <Button 
            className="sm:w-auto w-full transition-soft"
            onClick={() => {
              if (user) {
                setShowGigModal(true);
              } else {
                toast({
                  title: "Authentication required",
                  description: "Please sign in to post a gig",
                  variant: "destructive"
                });
              }
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {activeTab === "services" ? "Offer a Service" : "Post a Gig"}
          </Button>
        </div>
        
        <Tabs defaultValue="services" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="services" className="flex items-center">
              <Star className="mr-2 h-4 w-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="gigs" className="flex items-center">
              <BriefcaseIcon className="mr-2 h-4 w-4" />
              Gigs
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="services" className="animate-fade-in">
            {servicesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : services.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {services.map((service) => (
                  <CardItem
                    key={service.id}
                    id={service.id}
                    type="gig"
                    title={service.title}
                    description={service.description}
                    tags={service.tags}
                    creator={service.poster}
                    detailsUrl={`/service/${service.id}`}
                    metadata={[
                      {
                        icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
                        value: service.rate
                      },
                      {
                        icon: <Clock className="h-4 w-4 text-muted-foreground" />,
                        value: service.availability
                      }
                    ]}
                    actionLabel={
                      service.poster_id === user?.id ? "Edit" : "Contact"
                    }
                    onAction={() => {
                      if (!user) {
                        toast({
                          title: "Authentication required",
                          description: "Please sign in to contact this provider",
                          variant: "destructive"
                        });
                        return;
                      }
                      
                      if (service.poster_id === user.id) {
                        // For demo purposes, just show a toast for edit
                        toast({
                          title: "Edit Service",
                          description: "Editing functionality coming soon!"
                        });
                      } else {
                        // For demo purposes, just show a toast
                        toast({
                          title: "Message Sent",
                          description: `Your message has been sent to ${service.poster?.name}!`
                        });
                      }
                    }}
                  />
                ))}
                
                {/* Add Service Card */}
                <div className="bg-muted/30 border-dashed border-2 rounded-xl p-6 flex flex-col items-center justify-center text-center h-[400px]">
                  <div className="p-4 rounded-full bg-muted">
                    <Plus className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-6 font-medium">Offer Your Services</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2 mb-6">
                    Share your skills and get paid or collaborate with other students
                  </p>
                  <Button onClick={() => setShowGigModal(true)}>Offer a Service</Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Star className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                <h3 className="mt-4 text-lg font-medium">No services found</h3>
                <p className="text-muted-foreground mt-2 mb-4">
                  Be the first to offer your skills in this category
                </p>
                <Button onClick={() => setShowGigModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Offer a Service
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="gigs" className="animate-fade-in">
            {gigsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : gigs.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {gigs.map((gig) => (
                  <CardItem
                    key={gig.id}
                    id={gig.id}
                    type="gig"
                    title={gig.title}
                    description={gig.description}
                    tags={gig.tags}
                    creator={gig.poster}
                    detailsUrl={`/gig/${gig.id}`}
                    metadata={[
                      {
                        icon: <Clock className="h-4 w-4 text-muted-foreground" />,
                        value: gig.duration
                      },
                      {
                        icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
                        value: gig.rate
                      }
                    ]}
                    actionLabel={
                      gig.poster_id === user?.id ? "Edit" : "Apply"
                    }
                    onAction={() => {
                      if (!user) {
                        toast({
                          title: "Authentication required",
                          description: "Please sign in to apply for this gig",
                          variant: "destructive"
                        });
                        return;
                      }
                      
                      if (gig.poster_id === user.id) {
                        // For demo purposes, just show a toast for edit
                        toast({
                          title: "Edit Gig",
                          description: "Editing functionality coming soon!"
                        });
                      } else {
                        // For demo purposes, just show a toast
                        toast({
                          title: "Application Sent",
                          description: `Your application has been sent for "${gig.title}"!`
                        });
                      }
                    }}
                  />
                ))}
                
                {/* Post Gig Card */}
                <div className="bg-muted/30 border-dashed border-2 rounded-xl p-6 flex flex-col items-center justify-center text-center h-[400px]">
                  <div className="p-4 rounded-full bg-muted">
                    <Plus className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-6 font-medium">Post Your Own Gig</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2 mb-6">
                    Need help with a project? Post a gig and find talented students.
                  </p>
                  <Button onClick={() => setShowGigModal(true)}>Post a Gig</Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <BriefcaseIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                <h3 className="mt-4 text-lg font-medium">No gigs found</h3>
                <p className="text-muted-foreground mt-2 mb-4">
                  Post the first gig in this category
                </p>
                <Button onClick={() => setShowGigModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Post a Gig
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Post Gig Modal */}
      <PostGigModal 
        isOpen={showGigModal} 
        onClose={() => setShowGigModal(false)}
      />
    </div>
  );
}
