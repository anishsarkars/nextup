
import { createClient } from '@supabase/supabase-js';

// Check environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Placeholder values for development without environment variables
const placeholderUrl = 'https://placeholder-project.supabase.co';
const placeholderKey = 'placeholder-key';

// Use placeholders if environment variables are not set
const effectiveUrl = supabaseUrl || placeholderUrl;
const effectiveKey = supabaseAnonKey || placeholderKey;

// Log warning only once during initialization rather than for every check
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Running with placeholder Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables for full functionality.'
  );
}

// Create the Supabase client
export const supabase = createClient(effectiveUrl, effectiveKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Helper function to get the current session
export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error.message);
      return null;
    }
    return data.session;
  } catch (error) {
    console.error('Error in getSession:', error);
    return null;
  }
};

// Helper function to get the current user
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting user:', error.message);
      return null;
    }
    return data.user;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
};

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
};

// Helper function to provide mock data when Supabase is not configured
export const getMockData = (type: string, count = 10) => {
  switch(type) {
    case 'projects':
      return Array.from({ length: count }, (_, i) => ({
        id: `mock-project-${i}`,
        title: `Demo Project ${i + 1}`,
        description: `This is a demo project that showcases what you could do with a real project. Connect Supabase for full functionality.`,
        owner_id: 'mock-user-1',
        creator: {
          name: `Demo User ${i % 3 + 1}`,
          avatar: null
        },
        skill_tags: ['React', 'TypeScript', 'TailwindCSS'],
        roles_needed: ['Frontend Developer', 'Designer'],
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
        external_links: [],
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * i).toISOString()
      }));
    
    case 'scholarships':
      return Array.from({ length: count }, (_, i) => ({
        id: `mock-scholarship-${i}`,
        title: `Demo Scholarship ${i + 1}`,
        description: `This is a demo scholarship opportunity. Connect Supabase to see real scholarships.`,
        amount: `$${5000 + i * 1000}`,
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * (30 + i)).toISOString(),
        organization: `University of Demo ${i + 1}`,
        link: 'https://example.com/scholarship',
        tags: ['Undergraduate', 'STEM', 'Merit-based'],
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * i).toISOString()
      }));
    
    case 'hackathons':
      return Array.from({ length: count }, (_, i) => ({
        id: `mock-hackathon-${i}`,
        title: `Demo Hackathon ${i + 1}`,
        description: `This is a demo hackathon event. Connect Supabase to see real hackathon opportunities.`,
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * (15 + i * 5)).toISOString(),
        location: i % 2 === 0 ? 'Virtual' : 'Tech Campus, Demo City',
        organizer: `TechOrg ${i + 1}`,
        link: 'https://example.com/hackathon',
        tags: ['AI/ML', 'Web3', 'Mobile'],
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * i).toISOString()
      }));
    
    case 'gigs':
      return Array.from({ length: count }, (_, i) => ({
        id: `mock-gig-${i}`,
        title: `Demo ${i % 2 === 0 ? 'Service' : 'Gig'} ${i + 1}`,
        description: `This is a demo ${i % 2 === 0 ? 'service offering' : 'gig request'}. Connect Supabase to see real opportunities.`,
        gig_type: i % 2 === 0 ? 'offering' : 'seeking',
        poster_id: `mock-user-${i % 3 + 1}`,
        poster: {
          name: `Demo User ${i % 3 + 1}`,
          avatar: null
        },
        rate: i % 2 === 0 ? `$${30 + i * 5}/hr` : `Fixed $${150 + i * 50}`,
        duration: `${1 + i % 4} ${i % 2 === 0 ? 'week' : 'days'}`,
        availability: 'Available now',
        tags: ['Web Development', 'Design', 'Content Writing'].slice(0, 1 + i % 3),
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * i).toISOString()
      }));
    
    default:
      return [];
  }
};
