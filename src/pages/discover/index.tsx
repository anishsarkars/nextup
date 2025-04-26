
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Filter,
  Bookmark,
  Clock,
  Calendar,
  Link as LinkIcon,
  Search,
  Loader2,
  RefreshCw
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ErrorFallback } from "@/components/ui/error-fallback";
import { CardItem } from "@/components/cards/card-item";

// Types
interface Scholarship {
  id: string;
  title: string;
  description: string;
  amount: string;
  deadline: string;
  organization: string;
  link: string;
  tags: string[];
  created_at: string;
}

interface Hackathon {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  link: string;
  tags: string[];
  created_at: string;
}

export default function Discover() {
  const [activeTab, setActiveTab] = useState("scholarships");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const { user } = useAuth();
  const { toast } = useToast();
  const supabaseConfigured = isSupabaseConfigured();

  // Fetch scholarships
  const {
    data: scholarships = [],
    isLoading: scholarshipsLoading,
    isError: scholarshipsError,
    refetch: refetchScholarships,
  } = useQuery({
    queryKey: ["scholarships", searchQuery, category],
    queryFn: async () => {
      if (!supabaseConfigured) {
        return [];
      }

      try {
        let query = supabase.from("scholarships").select("*");

        if (searchQuery) {
          query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }

        if (category && category !== "all") {
          query = query.eq("category", category);
        }

        const { data, error } = await query.order("created_at", { ascending: false });

        if (error) throw error;
        return data as Scholarship[];
      } catch (error) {
        console.error("Error fetching scholarships:", error);
        throw error;
      }
    },
    enabled: supabaseConfigured,
  });

  // Fetch hackathons
  const {
    data: hackathons = [],
    isLoading: hackathonsLoading,
    isError: hackathonsError,
    refetch: refetchHackathons,
  } = useQuery({
    queryKey: ["hackathons", searchQuery],
    queryFn: async () => {
      if (!supabaseConfigured) {
        return [];
      }

      try {
        let query = supabase.from("hackathons").select("*");

        if (searchQuery) {
          query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }

        const { data, error } = await query.order("date", { ascending: true });

        if (error) throw error;
        return data as Hackathon[];
      } catch (error) {
        console.error("Error fetching hackathons:", error);
        throw error;
      }
    },
    enabled: supabaseConfigured,
  });

  // Handle bookmark toggling
  const handleBookmark = async (id: string, type: "scholarship" | "hackathon") => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark items",
        variant: "destructive",
      });
      return;
    }

    if (!supabaseConfigured) {
      toast({
        title: "Supabase not configured",
        description: "Bookmarking requires Supabase configuration.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if bookmark exists
      const { data: existingBookmark, error: checkError } = await supabase
        .from("bookmarks")
        .select()
        .eq("user_id", user.id)
        .eq("item_id", id)
        .eq("item_type", type)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }

      if (existingBookmark) {
        // Delete bookmark if it exists
        const { error: deleteError } = await supabase
          .from("bookmarks")
          .delete()
          .eq("id", existingBookmark.id);

        if (deleteError) throw deleteError;

        toast({
          title: "Bookmark removed",
          description: "Item removed from your bookmarks",
        });
      } else {
        // Add bookmark if it doesn't exist
        const { error: insertError } = await supabase.from("bookmarks").insert({
          user_id: user.id,
          item_id: id,
          item_type: type,
          created_at: new Date().toISOString(),
        });

        if (insertError) throw insertError;

        toast({
          title: "Bookmarked",
          description: "Item added to your bookmarks",
        });
      }
    } catch (error: any) {
      console.error("Error toggling bookmark:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update bookmark",
        variant: "destructive",
      });
    }
  };

  // Handle search
  const handleSearch = () => {
    if (activeTab === "scholarships") {
      refetchScholarships();
    } else {
      refetchHackathons();
    }
  };

  return (
    <div className="container mx-auto py-24 px-4">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Discover Opportunities</h1>
          <p className="text-muted-foreground max-w-3xl">
            Find scholarships, hackathons, and other opportunities to enhance your education and career.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search opportunities..."
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
          <div className="flex gap-2">
            {activeTab === "scholarships" && (
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="graduate">Graduate</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                  <SelectItem value="minority">Minority</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Button variant="outline" className="transition-soft" onClick={handleSearch}>
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        <Tabs defaultValue="scholarships" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
            <TabsTrigger value="hackathons">Hackathons</TabsTrigger>
          </TabsList>

          <TabsContent value="scholarships" className="animate-fade-in">
            {!supabaseConfigured ? (
              <ErrorFallback
                title="Supabase Not Configured"
                message="Scholarship data requires a Supabase connection. Please set up your environment variables."
              />
            ) : scholarshipsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : scholarshipsError ? (
              <ErrorFallback
                title="Failed to load scholarships"
                message="There was an error loading the scholarship data. Please try again."
                onRetry={() => refetchScholarships()}
              />
            ) : scholarships.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No scholarships found</h3>
                <p className="text-muted-foreground mt-2 mb-6">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scholarships.map((scholarship) => (
                  <CardItem
                    key={scholarship.id}
                    id={scholarship.id}
                    type="scholarship"
                    title={scholarship.title}
                    description={scholarship.description}
                    tags={scholarship.tags || []}
                    metadata={[
                      {
                        icon: <Clock className="h-4 w-4 text-muted-foreground" />,
                        value: `Deadline: ${new Date(scholarship.deadline).toLocaleDateString()}`
                      }
                    ]}
                    actionLabel="View Details"
                    detailsUrl={scholarship.link}
                    onBookmark={() => handleBookmark(scholarship.id, "scholarship")}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="hackathons" className="animate-fade-in">
            {!supabaseConfigured ? (
              <ErrorFallback
                title="Supabase Not Configured"
                message="Hackathon data requires a Supabase connection. Please set up your environment variables."
              />
            ) : hackathonsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : hackathonsError ? (
              <ErrorFallback
                title="Failed to load hackathons"
                message="There was an error loading the hackathon data. Please try again."
                onRetry={() => refetchHackathons()}
              />
            ) : hackathons.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No hackathons found</h3>
                <p className="text-muted-foreground mt-2 mb-6">
                  Try adjusting your search or check back later for new events.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hackathons.map((hackathon) => (
                  <CardItem
                    key={hackathon.id}
                    id={hackathon.id}
                    type="hackathon"
                    title={hackathon.title}
                    description={hackathon.description}
                    tags={hackathon.tags || []}
                    metadata={[
                      {
                        icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
                        value: new Date(hackathon.date).toLocaleDateString()
                      },
                      {
                        icon: <LinkIcon className="h-4 w-4 text-muted-foreground" />,
                        value: hackathon.organizer
                      }
                    ]}
                    actionLabel="Register Now"
                    detailsUrl={hackathon.link}
                    onBookmark={() => handleBookmark(hackathon.id, "hackathon")}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
