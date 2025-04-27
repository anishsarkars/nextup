
import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Common fields shared between different data types
interface BaseItem {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

// Project type for collaboration
export interface Project extends BaseItem {
  owner_id: string;
  creator?: { name: string; avatar: any };
  creator_id?: string;
  skill_tags: string[];
  roles_needed: string[];
  deadline: string;
  external_links: any[];
  // Support legacy field names
  tags?: string[];
}

// Gig type for skillswap
export interface Gig extends BaseItem {
  poster_id: string;
  poster?: { name: string; avatar: any };
  gig_type?: string; 
  rate?: string;
  duration?: string;
  availability?: string;
  tags: string[];
  // Support for compatibility with Project type
  skill_tags?: string[];
  roles_needed?: string[];
}

// Hackathon/Event type for discover
export interface Event extends BaseItem {
  date: string;
  location: string;
  organizer: string;
  link: string;
  tags: string[];
  // Support for compatibility with Project type
  deadline?: string;
  skill_tags?: string[];
  roles_needed?: string[];
  external_links?: any[];
}

type DataType = 'projects' | 'gigs' | 'events' | 'hackathons';

// Mock data for development
const mockProjects: Project[] = [
  {
    id: "1",
    title: "Student Community App",
    description: "Building a mobile app to connect students across campus for study groups and social events.",
    owner_id: "user1",
    creator: { name: "Alex Johnson", avatar: null },
    skill_tags: ["react-native", "firebase", "ui-design"],
    roles_needed: ["Mobile Developer", "UI/UX Designer", "Backend Developer"],
    deadline: "2023-08-15",
    external_links: [],
    created_at: "2023-05-20T10:30:00Z",
  },
  {
    id: "2",
    title: "Sustainability Tracker",
    description: "Creating a web app that helps students track and reduce their carbon footprint on campus.",
    owner_id: "user2",
    creator: { name: "Morgan Smith", avatar: null },
    skill_tags: ["react", "d3js", "node"],
    roles_needed: ["Frontend Developer", "Data Visualization Expert"],
    deadline: "2023-09-01",
    external_links: [],
    created_at: "2023-05-22T14:15:00Z",
  },
];

const mockGigs: Gig[] = [
  {
    id: "1",
    title: "Python Tutoring",
    description: "Offering Python programming tutoring for beginners. Can help with assignments and projects.",
    poster_id: "user1",
    poster: { name: "Jamie Doe", avatar: null },
    gig_type: "offering",
    rate: "$20/hr",
    duration: "1-2 hours",
    availability: "Weekends",
    tags: ["python", "programming", "tutoring"],
    created_at: "2023-05-19T09:45:00Z",
  },
  {
    id: "2",
    title: "Logo Design Needed",
    description: "Looking for someone to design a logo for my student organization. Must be creative and understand branding.",
    poster_id: "user3",
    poster: { name: "Taylor Reed", avatar: null },
    gig_type: "seeking",
    rate: "$50 flat rate",
    duration: "One-time project",
    availability: "Within 2 weeks",
    tags: ["design", "logo", "branding"],
    created_at: "2023-05-21T16:20:00Z",
  }
];

const mockHackathons: Event[] = [
  {
    id: "1",
    title: "Campus Hack 2023",
    description: "Annual hackathon focusing on solutions for campus life improvement. 24-hour event with prizes.",
    date: "2023-06-15",
    location: "University Student Center",
    organizer: "Computer Science Society",
    link: "https://campushack.example.com",
    tags: ["hackathon", "beginner-friendly", "prizes"],
    created_at: "2023-05-01T08:00:00Z",
  },
  {
    id: "2",
    title: "AI Innovation Challenge",
    description: "Create innovative AI solutions to real-world problems. Sponsored by tech companies with internship opportunities.",
    date: "2023-07-10",
    location: "Virtual Event",
    organizer: "AI Research Lab",
    link: "https://aichallenge.example.com",
    tags: ["AI", "machine-learning", "virtual"],
    created_at: "2023-05-05T11:30:00Z",
  }
];

export const useSupabaseData = <T extends Project | Gig | Event>(
  type: DataType,
  options?: {
    filters?: Record<string, any>;
    enabled?: boolean;
  }
) => {
  const isConfigured = isSupabaseConfigured();
  
  return useQuery({
    queryKey: [type, options?.filters],
    queryFn: async () => {
      if (!isConfigured) {
        // Return mock data if Supabase is not configured
        switch (type) {
          case 'projects':
            return mockProjects as T[];
          case 'gigs':
            return mockGigs as T[];
          case 'events':
          case 'hackathons':
            return mockHackathons as T[];
          default:
            return [] as T[];
        }
      }
      
      // Real Supabase query implementation when configured
      let query = supabase.from(type).select('*');
      
      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value) && value.length > 0) {
              query = query.contains(key, value);
            } else {
              query = query.eq(key, value);
            }
          }
        });
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error(`Error fetching ${type}:`, error);
        throw error;
      }
      
      return data as T[];
    },
    enabled: options?.enabled !== false,
  });
};
