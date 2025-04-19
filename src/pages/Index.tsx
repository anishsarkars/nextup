
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Book, Calendar, Layout, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Index() {
  // Add animation delays to elements as they load
  useEffect(() => {
    const elements = document.querySelectorAll('.animate-on-load');
    elements.forEach((el, i) => {
      (el as HTMLElement).style.animationDelay = `${i * 0.1}s`;
    });
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                  Your student journey,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    amplified
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Discover opportunities, connect with collaborators, and showcase your skills on the platform built for student success.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth/signup">
                  <Button size="lg" className="transition-soft">Get Started</Button>
                </Link>
                <Link to="/discover">
                  <Button variant="outline" size="lg" className="transition-soft">
                    Explore Opportunities
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-pastel-blue flex items-center justify-center border-2 border-background">
                      <span className="text-xs font-medium">U{i}</span>
                    </div>
                  ))}
                </div>
                <span>Join 2,000+ students already on NextMate</span>
              </div>
            </div>
            <div className="relative animate-scale-up">
              <div className="absolute inset-0 bg-gradient-to-r from-pastel-blue to-pastel-purple opacity-30 blur-3xl rounded-full"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-soft overflow-hidden border">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold">Recommended For You</h3>
                    <Button variant="ghost" size="sm" className="text-xs">View All</Button>
                  </div>
                  <div className="space-y-4">
                    {[
                      {
                        title: "NASA Space Apps Challenge",
                        type: "Hackathon",
                        date: "Oct 7-8, 2023",
                        icon: Calendar
                      },
                      {
                        title: "Google Developer Student Club",
                        type: "Scholarship",
                        date: "Applications due Sep 30",
                        icon: Book
                      },
                      {
                        title: "UI/UX Design Intern Needed",
                        type: "Gig",
                        date: "Posted 2 days ago",
                        icon: Layout
                      }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center p-3 rounded-lg hover:bg-muted/50 transition-soft cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-pastel-blue flex items-center justify-center mr-4">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span className="bg-pastel-green px-1.5 py-0.5 rounded text-black/70 mr-2">{item.type}</span>
                            <span>{item.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to succeed</h2>
            <p className="text-muted-foreground">
              NextMate brings together opportunities, collaborations, and skill-building in one seamless platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Discover Opportunities",
                description: "Find scholarships, hackathons, and events tailored to your interests and skills.",
                icon: Search,
                color: "bg-pastel-blue"
              },
              {
                title: "Collaborate on Projects",
                description: "Connect with like-minded students and build amazing things together.",
                icon: Users,
                color: "bg-pastel-purple"
              },
              {
                title: "Showcase Your Skills",
                description: "Offer your services, build your portfolio, and earn while you learn.",
                icon: Layout,
                color: "bg-pastel-green"
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-soft border animate-on-load animate-fade-in"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to take your student journey to the next level?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of students already discovering opportunities and connecting with peers on NextMate.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/auth/signup">
                <Button size="lg" className="transition-soft">Get Started Now</Button>
              </Link>
              <Link to="/discover">
                <Button variant="outline" size="lg" className="transition-soft">
                  Browse Opportunities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
