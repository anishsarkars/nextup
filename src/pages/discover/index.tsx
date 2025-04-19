
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Filter,
  GraduationCap,
  Search,
  Award,
  Clock,
  MapPin,
  BookOpen
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Mock data
const scholarships = [
  {
    id: 1,
    title: "Google Women in Tech Scholarship",
    provider: "Google",
    amount: "$10,000",
    deadline: "October 15, 2023",
    tags: ["Tech", "Women", "STEM"],
    image: "https://via.placeholder.com/40"
  },
  {
    id: 2,
    title: "AWS Cloud Computing Scholarship",
    provider: "Amazon Web Services",
    amount: "$5,000",
    deadline: "November 30, 2023",
    tags: ["Cloud", "Computing", "Technology"],
    image: "https://via.placeholder.com/40"
  },
  {
    id: 3,
    title: "Global Undergraduate Exchange Program",
    provider: "U.S. Department of State",
    amount: "Fully Funded",
    deadline: "December 1, 2023",
    tags: ["Exchange", "Undergraduate", "International"],
    image: "https://via.placeholder.com/40"
  },
  {
    id: 4,
    title: "Environmental Leadership Scholarship",
    provider: "Green Future Foundation",
    amount: "$7,500",
    deadline: "January 15, 2024",
    tags: ["Environment", "Leadership", "Sustainability"],
    image: "https://via.placeholder.com/40"
  },
];

const events = [
  {
    id: 1,
    title: "TechCrunch Disrupt 2023",
    organizer: "TechCrunch",
    date: "Sep 19-21, 2023",
    location: "San Francisco, CA",
    tags: ["Tech", "Startup", "Networking"],
    image: "https://via.placeholder.com/40"
  },
  {
    id: 2,
    title: "NASA Space Apps Challenge",
    organizer: "NASA",
    date: "Oct 7-8, 2023",
    location: "Worldwide",
    tags: ["Space", "Hackathon", "Innovation"],
    image: "https://via.placeholder.com/40"
  },
  {
    id: 3,
    title: "Women in Data Science Conference",
    organizer: "Stanford University",
    date: "Nov 12, 2023",
    location: "Online",
    tags: ["Data Science", "Women", "Conference"],
    image: "https://via.placeholder.com/40"
  },
  {
    id: 4,
    title: "Design Systems London",
    organizer: "Figma",
    date: "Dec 5, 2023",
    location: "London, UK",
    tags: ["Design", "UX", "Systems"],
    image: "https://via.placeholder.com/40"
  },
];

export default function Discover() {
  const [activeTab, setActiveTab] = useState("scholarships");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Generic filter categories for both scholarships and events
  const filterCategories = {
    scholarships: [
      { name: "Amount", options: ["Under $1,000", "$1,000 - $5,000", "$5,000 - $10,000", "Over $10,000", "Fully Funded"] },
      { name: "Deadline", options: ["This Week", "This Month", "Next 3 Months", "Future"] },
      { name: "Field", options: ["STEM", "Arts", "Business", "Humanities", "Medicine", "Law"] },
      { name: "Eligibility", options: ["Undergraduate", "Graduate", "PhD", "International", "Minority"] },
    ],
    events: [
      { name: "Event Type", options: ["Conference", "Hackathon", "Workshop", "Competition", "Networking"] },
      { name: "Date", options: ["This Week", "This Month", "Next 3 Months", "Future"] },
      { name: "Location", options: ["Online", "In-person", "Hybrid"] },
      { name: "Field", options: ["Tech", "Business", "Design", "Science", "Arts", "Engineering"] },
    ]
  };
  
  // Filter based on active tab
  const currentFilters = filterCategories[activeTab as keyof typeof filterCategories];
  
  return (
    <div className="container mx-auto px-4 py-8">
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

        {showFilters && (
          <div className="bg-card rounded-lg p-6 border shadow-sm animate-fade-in">
            <h3 className="font-medium mb-4">Filter Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentFilters.map((category, idx) => (
                <div key={idx} className="space-y-3">
                  <h4 className="text-sm font-medium">{category.name}</h4>
                  {category.options.map((option, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Checkbox id={`${category.name}-${i}`} />
                      <Label htmlFor={`${category.name}-${i}`} className="text-sm">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6 space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(false)}>
                Cancel
              </Button>
              <Button size="sm">Apply Filters</Button>
            </div>
          </div>
        )}
        
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scholarships.map((scholarship) => (
                <div
                  key={scholarship.id}
                  className="bg-card rounded-xl border p-6 hover:shadow-md transition-soft animate-on-load animate-scale-up"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-pastel-blue flex-shrink-0 flex items-center justify-center">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{scholarship.title}</h3>
                      <p className="text-sm text-muted-foreground">{scholarship.provider}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{scholarship.amount}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Deadline: {scholarship.deadline}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {scholarship.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="bg-pastel-blue/20">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button className="w-full mt-4 transition-soft">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="events" className="animate-fade-in">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-card rounded-xl border p-6 hover:shadow-md transition-soft animate-on-load animate-scale-up"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-pastel-purple flex-shrink-0 flex items-center justify-center">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.organizer}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {event.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="bg-pastel-purple/20">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button className="w-full mt-4 transition-soft">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 text-center">
          <Button variant="outline">Load More</Button>
        </div>
      </div>
    </div>
  );
}
