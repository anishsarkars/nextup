
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BriefcaseIcon,
  Filter,
  Search,
  Star,
  Clock,
  DollarSign,
  Tag,
  Plus
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Mock data
const serviceOffers = [
  {
    id: 1,
    title: "Web Development & React Projects",
    provider: {
      name: "Chris Wilson",
      avatar: "CW",
      rating: 4.9,
      reviews: 27
    },
    price: "$30/hr",
    tags: ["React", "Web Development", "Frontend"],
    availability: "Available next week",
    description: "Experienced React developer available to help with your web projects, assignments, or tutoring on React concepts."
  },
  {
    id: 2,
    title: "UI/UX Design & Figma Prototyping",
    provider: {
      name: "Mia Zhang",
      avatar: "MZ",
      rating: 4.8,
      reviews: 19
    },
    price: "$25/hr",
    tags: ["UI/UX", "Figma", "Design"],
    availability: "Available now",
    description: "I can help design intuitive interfaces, create prototypes, and provide feedback on your UI/UX projects."
  },
  {
    id: 3,
    title: "Data Science & Python Projects",
    provider: {
      name: "Jordan Lee",
      avatar: "JL",
      rating: 4.7,
      reviews: 15
    },
    price: "$35/hr",
    tags: ["Python", "Data Science", "Machine Learning"],
    availability: "Limited availability",
    description: "PhD student in data science offering help with Python projects, data analysis, machine learning models, and visualization."
  },
  {
    id: 4,
    title: "Technical Writing & Documentation",
    provider: {
      name: "Ali Hassan",
      avatar: "AH",
      rating: 5.0,
      reviews: 11
    },
    price: "$20/hr",
    tags: ["Technical Writing", "Documentation", "Editing"],
    availability: "Available weekends",
    description: "Professional technical writer offering services for documentation, reports, research papers, and project submissions."
  },
];

const gigs = [
  {
    id: 1,
    title: "Need UI Designer for Hackathon Project",
    poster: {
      name: "Team NoSleep",
      avatar: "NS"
    },
    duration: "2-day project",
    rate: "$150 fixed",
    deadline: "This weekend",
    tags: ["UI Design", "Figma", "Hackathon"],
    description: "Looking for a UI designer to join our hackathon team this weekend. We're building a mental health app for students and need help with the interface."
  },
  {
    id: 2,
    title: "Data Visualization Help for Research Paper",
    poster: {
      name: "Morgan Taylor",
      avatar: "MT"
    },
    duration: "1 week",
    rate: "$200-300",
    deadline: "Due in 10 days",
    tags: ["Data Visualization", "Python", "Research"],
    description: "Need help creating compelling data visualizations for my research paper on climate change effects on urban areas. Must be skilled in Python visualization libraries."
  },
];

export default function SkillSwap() {
  const [activeTab, setActiveTab] = useState("services");
  
  return (
    <div className="container mx-auto px-4 py-8">
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
            <Input placeholder="Search skills or gigs..." className="pl-10 transition-soft" />
          </div>
          <Button variant="outline" className="sm:w-auto w-full transition-soft">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button className="sm:w-auto w-full transition-soft">
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
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {serviceOffers.map((service) => (
                <Card key={service.id} className="hover:shadow-md transition-soft animate-on-load animate-scale-up">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{service.title}</CardTitle>
                        <CardDescription className="flex items-center">
                          <span className="flex items-center">
                            <Star className="fill-yellow-400 stroke-yellow-400 h-4 w-4 mr-1" />
                            {service.provider.rating}
                          </span>
                          <span className="text-xs mx-1.5">•</span>
                          <span>{service.provider.reviews} reviews</span>
                        </CardDescription>
                      </div>
                      <Avatar>
                        <AvatarFallback>{service.provider.avatar}</AvatarFallback>
                      </Avatar>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {service.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="bg-pastel-green/10">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <DollarSign className="h-4 w-4 mr-1.5" />
                        {service.price}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1.5" />
                        {service.availability}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-3 flex justify-between">
                    <Button variant="outline">View Profile</Button>
                    <Button>Contact</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="gigs" className="animate-fade-in">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {gigs.map((gig) => (
                <Card key={gig.id} className="hover:shadow-md transition-soft animate-on-load animate-scale-up">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{gig.title}</CardTitle>
                        <CardDescription>Posted by {gig.poster.name}</CardDescription>
                      </div>
                      <Avatar>
                        <AvatarFallback>{gig.poster.avatar}</AvatarFallback>
                      </Avatar>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {gig.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {gig.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="bg-pastel-purple/10">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1.5" />
                        {gig.duration}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <DollarSign className="h-4 w-4 mr-1.5" />
                        {gig.rate}
                      </div>
                      <div className="flex items-center text-muted-foreground col-span-2">
                        <Tag className="h-4 w-4 mr-1.5" />
                        Deadline: {gig.deadline}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-3 flex justify-between">
                    <Button variant="outline">Ask Question</Button>
                    <Button>Apply</Button>
                  </CardFooter>
                </Card>
              ))}
              <Card className="bg-muted/30 border-dashed hover:bg-muted/50 transition-soft animate-on-load animate-scale-up flex flex-col items-center justify-center p-6 h-[400px]">
                <div className="p-4 rounded-full bg-muted">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-6 font-medium">Post Your Own Gig</h3>
                <p className="text-sm text-muted-foreground text-center mt-2 mb-6">
                  Need help with a project? Post a gig and find talented students.
                </p>
                <Button>Post a Gig</Button>
              </Card>
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
