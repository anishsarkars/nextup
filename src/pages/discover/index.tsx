
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Filter,
  GraduationCap,
  Search,
  Award,
  Clock,
  MapPin,
  BookOpen,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { CardItem } from "@/components/cards/card-item";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseData } from "@/hooks/use-supabase-data";

// Types for data
interface Scholarship {
  id: string;
  title: string;
  provider: string;
  amount: string;
  deadline: string;
  tags: string[];
  description: string;
}

interface Event {
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

export default function Discover() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { fetchData, loading: bookmarkLoading } = useSupabaseData();
  const [activeTab, setActiveTab] = useState("scholarships");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  
  // Fetch bookmarks if user is logged in
  const { data: bookmarks = [], refetch: refetchBookmarks } = useQuery({
    queryKey: ["bookmarks", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        const { data } = await supabase
          .from("bookmarks")
          .select("item_id, item_type")
          .eq("user_id", user.id);
          
        return data || [];
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
        return [];
      }
    },
    enabled: !!user
  });
  
  // Fetch scholarships
  const { 
    data: scholarships = [], 
    isLoading: scholarshipsLoading,
    refetch: refetchScholarships 
  } = useQuery({
    queryKey: ["scholarships", searchQuery, selectedFilters],
    queryFn: async () => {
      try {
        let query = supabase.from("scholarships").select("*");
        
        if (searchQuery) {
          query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }
        
        // Apply filters
        if (selectedFilters.amount && selectedFilters.amount.length) {
          query = query.in("amount_category", selectedFilters.amount);
        }
        
        if (selectedFilters.deadline && selectedFilters.deadline.length) {
          query = query.in("deadline_category", selectedFilters.deadline);
        }
        
        if (selectedFilters.field && selectedFilters.field.length) {
          // For tags we need a different approach since tags is an array
          const tagConditions = selectedFilters.field.map(field => 
            `tags.cs.{${field}}`
          ).join(",");
          query = query.or(tagConditions);
        }
        
        const { data, error } = await query.order("created_at", { ascending: false });
        
        if (error) throw error;
        
        return data || [];
      } catch (error) {
        console.error("Error fetching scholarships:", error);
        toast({
          title: "Error",
          description: "Failed to load scholarships. Please try again.",
          variant: "destructive"
        });
        return [];
      }
    }
  });
  
  // Fetch events
  const { 
    data: events = [], 
    isLoading: eventsLoading,
    refetch: refetchEvents 
  } = useQuery({
    queryKey: ["events", searchQuery, selectedFilters],
    queryFn: async () => {
      try {
        let query = supabase.from("events").select("*");
        
        if (searchQuery) {
          query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }
        
        // Apply filters
        if (selectedFilters.eventType && selectedFilters.eventType.length) {
          query = query.in("event_type", selectedFilters.eventType);
        }
        
        if (selectedFilters.date && selectedFilters.date.length) {
          query = query.in("date_category", selectedFilters.date);
        }
        
        if (selectedFilters.location && selectedFilters.location.length) {
          query = query.in("location_type", selectedFilters.location);
        }
        
        if (selectedFilters.field && selectedFilters.field.length) {
          // For tags we need a different approach since tags is an array
          const tagConditions = selectedFilters.field.map(field => 
            `tags.cs.{${field}}`
          ).join(",");
          query = query.or(tagConditions);
        }
        
        const { data, error } = await query.order("created_at", { ascending: false });
        
        if (error) throw error;
        
        return data || [];
      } catch (error) {
        console.error("Error fetching events:", error);
        toast({
          title: "Error",
          description: "Failed to load events. Please try again.",
          variant: "destructive"
        });
        return [];
      }
    },
    enabled: activeTab === "events" // Only fetch events when on events tab
  });
  
  // Filter categories for both scholarships and events
  const filterCategories = {
    scholarships: [
      { name: "amount", label: "Amount", options: ["Under $1,000", "$1,000 - $5,000", "$5,000 - $10,000", "Over $10,000", "Fully Funded"] },
      { name: "deadline", label: "Deadline", options: ["This Week", "This Month", "Next 3 Months", "Future"] },
      { name: "field", label: "Field", options: ["STEM", "Arts", "Business", "Humanities", "Medicine", "Law"] },
      { name: "eligibility", label: "Eligibility", options: ["Undergraduate", "Graduate", "PhD", "International", "Minority"] },
    ],
    events: [
      { name: "eventType", label: "Event Type", options: ["Conference", "Hackathon", "Workshop", "Competition", "Networking"] },
      { name: "date", label: "Date", options: ["This Week", "This Month", "Next 3 Months", "Future"] },
      { name: "location", label: "Location", options: ["Online", "In-person", "Hybrid"] },
      { name: "field", label: "Field", options: ["Tech", "Business", "Design", "Science", "Arts", "Engineering"] },
    ]
  };
  
  // Filter based on active tab
  const currentFilters = filterCategories[activeTab as keyof typeof filterCategories];
  
  // Handle filter change
  const handleFilterChange = (category: string, option: string) => {
    setSelectedFilters(prev => {
      const current = prev[category] || [];
      const updated = current.includes(option)
        ? current.filter(item => item !== option)
        : [...current, option];
      
      return {
        ...prev,
        [category]: updated
      };
    });
  };
  
  // Check if an option is selected
  const isOptionSelected = (category: string, option: string) => {
    return selectedFilters[category]?.includes(option) || false;
  };
  
  // Handle tab change
  useEffect(() => {
    // Reset filters when changing tabs
    setSelectedFilters({});
  }, [activeTab]);
  
  // Apply filters
  const applyFilters = () => {
    if (activeTab === "scholarships") {
      refetchScholarships();
    } else {
      refetchEvents();
    }
    setShowFilters(false);
  };
  
  // Reset filters
  const resetFilters = () => {
    setSelectedFilters({});
    setSearchQuery("");
  };
  
  // Check if an item is bookmarked
  const isItemBookmarked = (id: string, type: string) => {
    return bookmarks.some(bookmark => 
      bookmark.item_id === id && bookmark.item_type === type
    );
  };
  
  // Loading states
  const isLoading = activeTab === "scholarships" ? scholarshipsLoading : eventsLoading;

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Discover Opportunities</h1>
          <p className="text-muted-foreground">
            Find scholarships, grants, hackathons, events, and more
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search opportunities..."
              className="pl-10 transition-soft"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (activeTab === "scholarships") {
                    refetchScholarships();
                  } else {
                    refetchEvents();
                  }
                }
              }}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:w-auto w-full transition-soft"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="bg-card rounded-lg p-6 border shadow-sm">
                <h3 className="font-medium mb-4">Filter Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {currentFilters.map((category, idx) => (
                    <div key={idx} className="space-y-3">
                      <h4 className="text-sm font-medium">{category.label}</h4>
                      {category.options.map((option, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`${category.name}-${i}`} 
                            checked={isOptionSelected(category.name, option)}
                            onCheckedChange={() => handleFilterChange(category.name, option)}
                          />
                          <Label htmlFor={`${category.name}-${i}`} className="text-sm">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-6 space-x-2">
                  <Button variant="outline" size="sm" onClick={resetFilters}>
                    Reset
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowFilters(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={applyFilters}>Apply Filters</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Tabs defaultValue="scholarships" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="scholarships" className="flex items-center">
              <GraduationCap className="mr-2 h-4 w-4" />
              Scholarships
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Events
            </TabsTrigger>
          </TabsList>
          <TabsContent value="scholarships" className="animate-fade-in">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : scholarships.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scholarships.map((scholarship) => (
                  <CardItem
                    key={scholarship.id}
                    id={scholarship.id}
                    type="scholarship"
                    title={scholarship.title}
                    description={scholarship.description || "No description available"}
                    tags={scholarship.tags || []}
                    bookmarked={isItemBookmarked(scholarship.id, "scholarship")}
                    detailsUrl={`/scholarship/${scholarship.id}`}
                    metadata={[
                      { 
                        icon: <Award className="h-4 w-4 text-muted-foreground" />,
                        value: scholarship.amount
                      },
                      {
                        icon: <Clock className="h-4 w-4 text-muted-foreground" />,
                        value: `Deadline: ${scholarship.deadline}`
                      },
                    ]}
                    actionLabel="Apply Now"
                    onAction={() => {
                      // Handle scholarship application
                      if (!user) {
                        toast({
                          title: "Authentication required",
                          description: "Please sign in to apply for scholarships",
                          variant: "destructive"
                        });
                        return;
                      }
                      
                      // For this example, just show a toast
                      toast({
                        title: "Application initiated",
                        description: `You're applying for ${scholarship.title}`,
                      });
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                <h3 className="mt-4 text-lg font-medium">No scholarships found</h3>
                <p className="text-muted-foreground mt-2">
                  Try adjusting your filters or search terms
                </p>
                {Object.keys(selectedFilters).length > 0 && (
                  <Button variant="outline" className="mt-4" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
          <TabsContent value="events" className="animate-fade-in">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : events.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <CardItem
                    key={event.id}
                    id={event.id}
                    type="event"
                    title={event.title}
                    description={event.description || "No description available"}
                    tags={event.tags || []}
                    bookmarked={isItemBookmarked(event.id, "event")}
                    detailsUrl={`/event/${event.id}`}
                    metadata={[
                      {
                        icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
                        value: event.date
                      },
                      {
                        icon: <MapPin className="h-4 w-4 text-muted-foreground" />,
                        value: event.location
                      },
                    ]}
                    actionLabel="Register"
                    onAction={() => {
                      // Handle event registration
                      if (!user) {
                        toast({
                          title: "Authentication required",
                          description: "Please sign in to register for events",
                          variant: "destructive"
                        });
                        return;
                      }
                      
                      // For this example, just show a toast
                      toast({
                        title: "Registration initiated",
                        description: `You're registering for ${event.title}`,
                      });
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                <h3 className="mt-4 text-lg font-medium">No events found</h3>
                <p className="text-muted-foreground mt-2">
                  Try adjusting your filters or search terms
                </p>
                {Object.keys(selectedFilters).length > 0 && (
                  <Button variant="outline" className="mt-4" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 text-center">
          <Button variant="outline">Load More</Button>
        </div>
      </div>
    </div>
  );
}
