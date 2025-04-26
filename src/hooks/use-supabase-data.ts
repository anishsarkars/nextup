import { useState } from 'react';
import { supabase, isSupabaseConfigured, getMockData } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function useSupabaseData() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Generic function to fetch data with pagination
  async function fetchData<T>(
    table: string, 
    options: { 
      page?: number; 
      perPage?: number; 
      filters?: Record<string, any>;
      orderBy?: { column: string; ascending?: boolean };
      searchColumn?: string;
      searchQuery?: string;
      select?: string;
    } = {}
  ): Promise<{ data: T[] | null; count: number; error: any }> {
    const { 
      page = 1, 
      perPage = 10,
      filters = {},
      orderBy,
      searchColumn,
      searchQuery,
      select = '*'
    } = options;
    
    setLoading(true);
    
    // Check Supabase configuration
    if (!isSupabaseConfigured()) {
      // Return mock data based on table name
      const mockData = getMockData(table, perPage);
      
      // Apply simple filtering to mock data if needed
      let filteredData = [...mockData];
      
      // Apply basic search if provided
      if (searchColumn && searchQuery) {
        filteredData = filteredData.filter(item => {
          const value = item[searchColumn]?.toString().toLowerCase();
          return value?.includes(searchQuery.toLowerCase());
        });
      }
      
      // Apply filters
      if (Object.keys(filters).length > 0) {
        filteredData = filteredData.filter(item => {
          return Object.entries(filters).every(([key, value]) => {
            if (value === undefined || value === null || value === '') return true;
            
            if (Array.isArray(value)) {
              return value.every(v => item[key]?.includes(v));
            } else {
              return item[key] === value;
            }
          });
        });
      }
      
      // Apply sorting
      if (orderBy) {
        filteredData.sort((a, b) => {
          if (a[orderBy.column] < b[orderBy.column]) return orderBy.ascending ? -1 : 1;
          if (a[orderBy.column] > b[orderBy.column]) return orderBy.ascending ? 1 : -1;
          return 0;
        });
      }
      
      // Apply pagination
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      // Simulate delay for loading state
      return new Promise(resolve => {
        setTimeout(() => {
          setLoading(false);
          resolve({ 
            data: paginatedData as T[],
            count: filteredData.length,
            error: null
          });
        }, 500);
      });
    }
    
    try {
      // Start building the query
      let query = supabase
        .from(table)
        .select(select, { count: 'exact' });
      
      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            query = query.contains(key, value);
          } else {
            query = query.eq(key, value);
          }
        }
      });
      
      // Add search if provided
      if (searchColumn && searchQuery) {
        query = query.ilike(searchColumn, `%${searchQuery}%`);
      }
      
      // Add ordering
      if (orderBy) {
        query = query.order(orderBy.column, { 
          ascending: orderBy.ascending ?? false 
        });
      }
      
      // Add pagination
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;
      
      if (perPage > 0) {
        query = query.range(from, to);
      }
      
      // Execute query
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      return { 
        data: data as T[] | null, 
        count: count || 0,
        error: null
      };
    } catch (error) {
      console.error(`Error fetching data from ${table}:`, error);
      toast({
        title: `Error fetching ${table}`,
        description: error.message || "Failed to load data. Please try again.",
        variant: "destructive"
      });
      return { data: null, count: 0, error };
    } finally {
      setLoading(false);
    }
  }

  // Insert data into a table
  async function insertData<T>(
    table: string,
    data: Record<string, any>
  ): Promise<{ data: T | null; error: any }> {
    setLoading(true);
    
    if (!isSupabaseConfigured()) {
      // Return mock response in demo mode
      return new Promise(resolve => {
        setTimeout(() => {
          setLoading(false);
          resolve({ 
            data: { id: `mock-${Date.now()}`, ...data } as unknown as T,
            error: null
          });
        }, 500);
      });
    }
    
    try {
      const { data: insertedData, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data: insertedData as T, error: null };
    } catch (error: any) {
      console.error(`Error inserting data into ${table}:`, error);
      toast({
        title: "Error",
        description: `Failed to save data: ${error.message || "Unknown error"}`,
        variant: "destructive"
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }

  // Update data in a table
  async function updateData<T>(
    table: string,
    id: string,
    data: Record<string, any>
  ): Promise<{ data: T | null; error: any }> {
    setLoading(true);
    
    if (!isSupabaseConfigured()) {
      // Return mock response in demo mode
      return new Promise(resolve => {
        setTimeout(() => {
          setLoading(false);
          resolve({ 
            data: { id, ...data } as unknown as T,
            error: null
          });
        }, 500);
      });
    }
    
    try {
      const { data: updatedData, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data: updatedData as T, error: null };
    } catch (error: any) {
      console.error(`Error updating data in ${table}:`, error);
      toast({
        title: "Error",
        description: `Failed to update data: ${error.message || "Unknown error"}`,
        variant: "destructive"
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }

  // Delete data from a table
  async function deleteData(
    table: string,
    id: string
  ): Promise<{ success: boolean; error: any }> {
    setLoading(true);
    
    if (!isSupabaseConfigured()) {
      // Return mock response in demo mode
      return new Promise(resolve => {
        setTimeout(() => {
          setLoading(false);
          resolve({ 
            success: true,
            error: null
          });
        }, 500);
      });
    }
    
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error: any) {
      console.error(`Error deleting data from ${table}:`, error);
      toast({
        title: "Error",
        description: `Failed to delete data: ${error.message || "Unknown error"}`,
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }

  // Toggle bookmark for a user
  async function toggleBookmark(
    itemType: 'project' | 'scholarship' | 'event' | 'gig' | 'hackathon',
    itemId: string,
    userId: string
  ): Promise<{ bookmarked: boolean; error: any }> {
    setLoading(true);
    
    if (!isSupabaseConfigured()) {
      // Return mock response in demo mode
      return new Promise(resolve => {
        setTimeout(() => {
          setLoading(false);
          resolve({ 
            bookmarked: true,
            error: null
          });
        }, 500);
      });
    }
    
    try {
      // Check if bookmark exists
      const { data: existingBookmark, error: checkError } = await supabase
        .from('bookmarks')
        .select()
        .eq('user_id', userId)
        .eq('item_id', itemId)
        .eq('item_type', itemType)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw checkError;
      }
      
      if (existingBookmark) {
        // Delete bookmark if it exists
        const { error: deleteError } = await supabase
          .from('bookmarks')
          .delete()
          .eq('id', existingBookmark.id);
          
        if (deleteError) throw deleteError;
        
        toast({
          title: "Bookmark removed",
          description: "Item removed from your bookmarks"
        });
        
        return { bookmarked: false, error: null };
      } else {
        // Add bookmark if it doesn't exist
        const { error: insertError } = await supabase
          .from('bookmarks')
          .insert({
            user_id: userId,
            item_id: itemId,
            item_type: itemType,
            created_at: new Date().toISOString()
          });
          
        if (insertError) throw insertError;
        
        toast({
          title: "Bookmarked",
          description: "Item added to your bookmarks"
        });
        
        return { bookmarked: true, error: null };
      }
    } catch (error: any) {
      console.error(`Error toggling bookmark:`, error);
      toast({
        title: "Error",
        description: `Failed to update bookmark: ${error.message || "Unknown error"}`,
        variant: "destructive"
      });
      return { bookmarked: false, error };
    } finally {
      setLoading(false);
    }
  }

  // Check if an item is bookmarked
  async function isBookmarked(
    itemType: 'project' | 'scholarship' | 'event' | 'gig' | 'hackathon',
    itemId: string,
    userId: string
  ): Promise<boolean> {
    if (!userId || !isSupabaseConfigured()) return false;
    
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select()
        .eq('user_id', userId)
        .eq('item_id', itemId)
        .eq('item_type', itemType)
        .single();
      
      if (error) {
        return false;
      }
      
      return !!data;
    } catch {
      return false;
    }
  }

  // Get user's bookmarks
  async function getUserBookmarks(
    userId: string,
    itemType?: 'project' | 'scholarship' | 'event' | 'gig' | 'hackathon'
  ): Promise<{ data: any[]; error: any }> {
    setLoading(true);
    
    if (!isSupabaseConfigured()) {
      // Return mock response in demo mode with empty bookmarks
      return new Promise(resolve => {
        setTimeout(() => {
          setLoading(false);
          resolve({ 
            data: [],
            error: null
          });
        }, 500);
      });
    }
    
    try {
      let query = supabase
        .from('bookmarks')
        .select('*, projects(*), scholarships(*), events(*), gigs(*)')
        .eq('user_id', userId);
      
      if (itemType) {
        query = query.eq('item_type', itemType);
      }
      
      const { data, error } = await query;
      
      return { data: data || [], error };
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      return { data: [], error };
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    fetchData,
    insertData,
    updateData,
    deleteData,
    toggleBookmark,
    isBookmarked,
    getUserBookmarks
  };
}
