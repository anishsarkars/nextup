
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Award,
  Calendar,
  Clock,
  Code,
  Filter,
  Heart as HeartIcon,
  MapPin,
  MessageSquare,
  Plus,
  Search,
  Share2,
  Users
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data
const projects = [
  {
    id: 1,
    title: "EcoTracker - Sustainable Lifestyle App",
    description: "A mobile app that helps users track and reduce their carbon footprint through daily challenges and community engagement.",
    category: "Mobile App",
    creator: {
      name: "Alex Chen",
      avatar: "AC"
    },
    teamSize: "2-4",
    skills: ["React Native", "Firebase", "UI/UX Design"],
    stage: "Ideation",
    likes: 24,
    comments: 8,
    created: "2 days ago"
  },
  {
    id: 2,
    title: "StudyBuddy - Peer Learning Platform",
    description: "An AI-powered platform that matches students with study partners based on courses, learning style, and availability.",
    category: "Web App",
    creator: {
      name: "Maya Johnson",
      avatar: "MJ"
    },
    teamSize: "3-5",
    skills: ["React", "Node.js", "Machine Learning"],
    stage: "Development",
    likes: 36,
    comments: 15,
    created: "1 week ago"
  },
  {
    id: 3,
    title: "FoodShare - Reducing Campus Food Waste",
    description: "Platform connecting students with excess meal plan swipes to those in need, reducing food waste and addressing food insecurity.",
    category: "Social Impact",
    creator: {
      name: "Jordan Liu",
      avatar: "JL"
    },
    teamSize: "2-3",
    skills: ["Product Management", "Flutter", "Firebase"],
    stage: "Prototype",
    likes: 42,
    comments: 12,
    created: "3 days ago"
  },
  {
    id: 4,
    title: "AR Campus Tour Guide",
    description: "Augmented reality application that provides interactive tours of the university campus for prospective students and visitors.",
    category: "AR/VR",
    creator: {
      name: "Sam Taylor",
      avatar: "ST"
    },
    teamSize: "3-6",
    skills: ["Unity", "AR Development", "3D Modeling"],
    stage: "Ideation",
    likes: 19,
    comments: 5,
    created: "5 days ago"
  },
];

const hackathons = [
  {
    id: 1,
    title: "HealthTech Innovation Challenge",
    organizer: "MedTech Association",
    date: "Oct 15-16, 2023",
    location: "Online",
    participants: 120,
    prize: "$5,000",
    tags: ["Healthcare", "AI", "Wearables"]
  },
  {
    id: 2,
    title: "Sustainable Cities Hackathon",
    organizer: "Green Future Foundation",
    date: "Nov 4-5, 2023",
    location: "Boston, MA",
    participants: 80,
    prize: "$3,000",
    tags: ["Sustainability", "Smart Cities", "IoT"]
  },
];

export default function Collaborate() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  return (
    <div className="container mx-auto px-4 py-8">
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
              <Input placeholder="Search projects..." className="pl-10 transition-soft" />
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Select defaultValue="newest">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="active">Recently Active</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
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
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Active Projects</h2>
                <Button className="transition-soft">
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-soft animate-on-load animate-scale-up overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="mb-1">{project.title}</CardTitle>
                          <CardDescription className="flex items-center space-x-2">
                            <span className="bg-pastel-green px-2 py-0.5 rounded text-xs font-medium text-black/70">
                              {project.category}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {project.created}
                            </span>
                          </CardDescription>
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{project.creator.avatar}</AvatarFallback>
                        </Avatar>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {project.skills.map((skill, i) => (
                          <Badge key={i} variant="outline" className="bg-pastel-blue/10 text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center text-muted-foreground">
                          <Users className="h-4 w-4 mr-1" />
                          {project.teamSize} members
                        </span>
                        <span className="bg-pastel-purple/10 px-2 py-0.5 rounded-full text-xs">
                          {project.stage}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-3 flex justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <button className="flex items-center hover:text-foreground transition-soft">
                          <HeartIcon className="h-4 w-4 mr-1" />
                          {project.likes}
                        </button>
                        <button className="flex items-center hover:text-foreground transition-soft">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {project.comments}
                        </button>
                      </div>
                      <Button>Join Team</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Button variant="outline">Load More</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="hackathons" className="animate-fade-in space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Upcoming Hackathons</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {hackathons.map((hackathon) => (
                  <Card key={hackathon.id} className="hover:shadow-md transition-soft animate-on-load animate-scale-up">
                    <CardHeader className="pb-3">
                      <CardTitle>{hackathon.title}</CardTitle>
                      <CardDescription>
                        <span className="flex items-center">
                          Organized by {hackathon.organizer}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3 space-y-4">
                      <div className="flex justify-between text-sm">
                        <div className="space-y-1">
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            {hackathon.date}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-2" />
                            {hackathon.location}
                          </div>
                        </div>
                        <div className="space-y-1 text-right">
                          <div className="flex items-center justify-end text-muted-foreground">
                            <Users className="h-4 w-4 mr-2" />
                            {hackathon.participants} participants
                          </div>
                          <div className="flex items-center justify-end text-muted-foreground">
                            <Award className="h-4 w-4 mr-2" />
                            Prize: {hackathon.prize}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5">
                        {hackathon.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="bg-pastel-purple/10 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-3 flex justify-between">
                      <Button variant="outline" className="flex items-center">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button>Register</Button>
                    </CardFooter>
                  </Card>
                ))}
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
                {["All", "Mobile App", "Web App", "Data Science", "AI/ML", "Design", "Hardware", "Social Impact", "AR/VR"].map((category, i) => {
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
                      onClick={() => setSelectedCategory(value)}
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
                  <Badge key={i} variant="outline" className="cursor-pointer hover:bg-muted transition-soft">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Suggested Teammates</h3>
              <div className="space-y-4">
                {[
                  { name: "Taylor Kim", skills: "UI Designer", avatar: "TK" },
                  { name: "Jordan Rivera", skills: "Full Stack Developer", avatar: "JR" },
                  { name: "Alex Chen", skills: "Product Manager", avatar: "AC" }
                ].map((teammate, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>{teammate.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{teammate.name}</div>
                      <div className="text-xs text-muted-foreground">{teammate.skills}</div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full transition-soft">
                  View All
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
