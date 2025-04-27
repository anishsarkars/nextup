
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
  category?: string;
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
  category?: string;
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
  category?: string;
}

// Scholarship type for discover page
export interface Scholarship extends BaseItem {
  amount: string;
  deadline: string;
  organization: string;
  link: string;
  tags: string[];
  category?: string;
}

type DataType = 'projects' | 'gigs' | 'events' | 'hackathons' | 'scholarships';

// Comprehensive mock data for development
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
    category: "Mobile App"
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
    category: "Web Development"
  },
  {
    id: "3",
    title: "AI Study Buddy",
    description: "An AI-powered study assistant that helps students create flashcards, quizzes, and study schedules.",
    owner_id: "user3",
    creator: { name: "Jamie Lee", avatar: null },
    skill_tags: ["python", "machine-learning", "api-development"],
    roles_needed: ["ML Engineer", "Backend Developer", "UX Researcher"],
    deadline: "2023-10-15",
    external_links: [],
    created_at: "2023-05-25T11:30:00Z",
    category: "AI/ML"
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
  },
  {
    id: "3",
    title: "Mobile App UI Design",
    description: "Need help designing the UI for a new fitness tracking app aimed at college students.",
    poster_id: "user2",
    poster: { name: "Sam Chen", avatar: null },
    gig_type: "seeking",
    rate: "$35/hr",
    duration: "5-10 hours",
    availability: "Weekdays after 4pm",
    tags: ["ui-design", "mobile", "figma"],
    created_at: "2023-05-23T13:10:00Z",
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
  },
  {
    id: "3",
    title: "Green Tech Hackathon",
    description: "Build sustainable tech solutions to address environmental challenges facing campuses today.",
    date: "2023-08-05",
    location: "Engineering Building",
    organizer: "Environmental Science Club",
    link: "https://greentech.example.com",
    tags: ["sustainability", "green-tech", "iot"],
    created_at: "2023-05-10T14:45:00Z",
  }
];

const mockScholarships: Scholarship[] = [
  {
    id: "1",
    title: "Future Tech Leaders Scholarship",
    description: "For undergraduate students pursuing degrees in computer science or related fields.",
    amount: "$5,000",
    deadline: "2023-09-30",
    organization: "Tech Foundation",
    link: "https://techscholarship.example.com",
    tags: ["undergraduate", "computer-science", "merit-based"],
    created_at: "2023-05-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Women in STEM Grant",
    description: "Supporting women pursuing careers in science, technology, engineering, or mathematics.",
    amount: "$7,500",
    deadline: "2023-08-15",
    organization: "Women's Tech Alliance",
    link: "https://womeninstem.example.com",
    tags: ["women", "stem", "diversity"],
    created_at: "2023-05-12T09:15:00Z",
  },
  {
    id: "3",
    title: "Global Innovation Fellowship",
    description: "For graduate students researching innovative solutions to global challenges.",
    amount: "$10,000",
    deadline: "2023-10-15",
    organization: "Global Innovation Fund",
    link: "https://globalinnovation.example.com",
    tags: ["graduate", "research", "international"],
    created_at: "2023-05-18T14:30:00Z",
  }
];

export const useSupabaseData = <T extends Project | Gig | Event | Scholarship>(
  type: DataType,
  options?: {
    filters?: Record<string, any>;
    enabled?: boolean;
  }
) => {
  const isConfigured = isSupabaseConfigured();
  
  return useQuery<T[]>({
    queryKey: [type, options?.filters],
    queryFn: async () => {
      if (!isConfigured) {
        // Return rich mock data if Supabase is not configured
        console.log(`Using mock ${type} data since Supabase is not configured`);
        switch (type) {
          case 'projects':
            return mockProjects as T[];
          case 'gigs':
            return mockGigs as T[];
          case 'events':
          case 'hackathons':
            return mockHackathons as T[];
          case 'scholarships':
            return mockScholarships as T[];
          default:
            return [] as T[];
        }
      }
      
      // Real Supabase query implementation when configured
      try {
        let query = supabase.from(type).select('*');
        
        if (options?.filters) {
          Object.entries(options.filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              if (Array.isArray(value) && value.length > 0) {
                query = query.contains(key, value);
              } else if (typeof value === 'string' && value.includes('%')) {
                query = query.ilike(key, value);
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
      } catch (error) {
        console.error(`Error in Supabase query for ${type}:`, error);
        // Fallback to mock data if query fails
        console.log(`Falling back to mock ${type} data due to error`);
        switch (type) {
          case 'projects':
            return mockProjects as T[];
          case 'gigs':
            return mockGigs as T[];
          case 'events':
          case 'hackathons':
            return mockHackathons as T[];
          case 'scholarships':
            return mockScholarships as T[];
          default:
            return [] as T[];
        }
      }
    },
    enabled: options?.enabled !== false,
    retry: isConfigured ? 1 : 0, // Don't retry if not configured
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Helper function to get a better error message
export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  return 'An unknown error occurred';
};
