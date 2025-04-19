
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookmarkIcon,
  BriefcaseIcon,
  CheckCircle2,
  ClockIcon,
  Edit2Icon,
  GraduationCap,
  Settings,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export default function Dashboard() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Profile Sidebar */}
        <div className="lg:w-1/3 space-y-6">
          <Card className="overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-pastel-blue to-pastel-purple"></div>
            <CardContent className="pt-0 relative">
              <div className="flex flex-col items-center -mt-12">
                <Avatar className="h-24 w-24 border-4 border-background">
                  <AvatarFallback className="text-2xl">JD</AvatarFallback>
                </Avatar>
                <div className="mt-4 text-center">
                  <h2 className="text-xl font-bold">Jane Doe</h2>
                  <p className="text-muted-foreground">Computer Science Student</p>
                  <p className="text-sm text-muted-foreground">Stanford University</p>
                </div>
                <Button variant="outline" size="sm" className="mt-4">
                  <Edit2Icon className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>

              <Separator className="my-6" />

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">About</h3>
                  <p className="text-sm text-muted-foreground">
                    Junior CS student passionate about web development and AI. 
                    Looking for collaborators for hackathons and research projects.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {["JavaScript", "React", "Python", "UI/UX", "Firebase"].map((skill, i) => (
                      <Badge key={i} variant="outline" className="bg-pastel-blue/10">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Availability</h3>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 hover:bg-green-100 dark:hover:bg-green-900">
                    Available for Projects
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Completed Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Personal Portfolio Website", role: "Frontend Developer" },
                { name: "AI Chatbot for Student Support", role: "Backend Developer" },
                { name: "VR Campus Tour App", role: "Designer" },
              ].map((project, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">{project.role}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Content */}
        <div className="lg:flex-1">
          <Tabs defaultValue="saved">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <TabsList>
                <TabsTrigger value="saved" className="flex items-center">
                  <BookmarkIcon className="mr-2 h-4 w-4" />
                  Saved
                </TabsTrigger>
                <TabsTrigger value="collaborations" className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Collaborations
                </TabsTrigger>
                <TabsTrigger value="gigs" className="flex items-center">
                  <BriefcaseIcon className="mr-2 h-4 w-4" />
                  Gigs
                </TabsTrigger>
              </TabsList>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>

            <TabsContent value="saved" className="space-y-6 animate-fade-in">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Saved Scholarships</h2>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Adobe Design Circle Scholarship",
                        amount: "$7,500",
                        deadline: "Jan 15, 2024",
                      },
                      {
                        title: "Grace Hopper Celebration Scholarship",
                        amount: "Fully Funded",
                        deadline: "Mar 30, 2024",
                      },
                    ].map((item, i) => (
                      <Card key={i} className="animate-on-load animate-scale-up">
                        <CardContent className="p-4 flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-pastel-blue flex items-center justify-center">
                              <GraduationCap className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <div className="flex space-x-3 text-sm text-muted-foreground">
                                <span>${item.amount}</span>
                                <span>•</span>
                                <span className="flex items-center">
                                  <ClockIcon className="h-3 w-3 mr-1" />
                                  {item.deadline}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button size="sm">Apply</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">Saved Events</h2>
                  <div className="space-y-4">
                    {[
                      {
                        title: "React Summit 2023",
                        date: "Oct 27, 2023",
                        location: "Amsterdam & Online",
                      },
                      {
                        title: "Stanford AI Symposium",
                        date: "Nov 11, 2023",
                        location: "Stanford University",
                      },
                    ].map((item, i) => (
                      <Card key={i} className="animate-on-load animate-scale-up">
                        <CardContent className="p-4 flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-pastel-purple flex items-center justify-center">
                              <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <div className="flex space-x-3 text-sm text-muted-foreground">
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {item.date}
                                </span>
                                <span className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {item.location}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">Details</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="collaborations" className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Active Collaborations</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "AR Campus Tour Guide",
                    description: "Building an AR application for interactive campus tours",
                    team: ["JD", "ST", "MK", "AJ"],
                    progress: 65
                  },
                  {
                    title: "StudyBuddy - Peer Learning Platform",
                    description: "Connecting students for peer learning and sharing resources",
                    team: ["JD", "TW", "PR"],
                    progress: 40
                  }
                ].map((project, i) => (
                  <Card key={i} className="animate-on-load animate-scale-up">
                    <CardHeader className="pb-2">
                      <CardTitle>{project.title}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm">Project Progress</span>
                        <span className="text-sm font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                      
                      <div className="mt-6">
                        <p className="text-sm font-medium mb-2">Team Members</p>
                        <div className="flex -space-x-2">
                          {project.team.map((member, j) => (
                            <Avatar key={j} className="border-2 border-background h-8 w-8">
                              <AvatarFallback className="text-xs">{member}</AvatarFallback>
                            </Avatar>
                          ))}
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border-2 border-background">
                            <Plus className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">Team Chat</Button>
                        <Button size="sm" className="flex-1">Project Board</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="gigs" className="animate-fade-in">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">My Gigs</h2>
                  <Card className="animate-on-load animate-scale-up">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">UI/UX Design Services</CardTitle>
                      <CardDescription>Active • 3 clients</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-1">Total Earnings</p>
                          <p className="text-2xl font-bold">$350</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium mb-1">Rating</p>
                          <div className="flex items-center">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              ))}
                            </div>
                            <span className="text-sm ml-2">5.0 (7 reviews)</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1">Manage</Button>
                          <Button size="sm" className="flex-1">Edit Service</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Applied Gigs</h2>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Frontend Developer for Student App",
                        status: "Interview Scheduled",
                        date: "Sep 25, 2023"
                      },
                      {
                        title: "UI Designer for Research Project",
                        status: "Application Review",
                        date: "Sep 20, 2023"
                      }
                    ].map((gig, i) => (
                      <Card key={i} className="animate-on-load animate-scale-up">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{gig.title}</h3>
                            <Badge variant="outline" className="bg-pastel-blue/10">
                              {gig.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Applied: {gig.date}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Missing components
const Calendar = ({ className }: { className?: string }) => {
  return <span className={className}>📅</span>
};

const MapPin = ({ className }: { className?: string }) => {
  return <span className={className}>📍</span>
};

const Plus = ({ className }: { className?: string }) => {
  return <span className={className}>+</span>
};

const Star = ({ className }: { className?: string }) => {
  return <span className={className}>⭐</span>
};
