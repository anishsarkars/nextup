
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export function useSupabaseData() {
  const [loading, setLoading] = useState(false);

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
    } = {}
  ): Promise<{ data: T[] | null; count: number; error: any }> {
    const { 
      page = 1, 
      perPage = 10,
      filters = {},
      orderBy,
      searchColumn,
      searchQuery
    } = options;
    
    setLoading(true);
    
    try {
      // Start building the query
      let query = supabase
        .from(table)
        .select('*', { count: 'exact' });
      
      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query = query.eq(key, value);
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
      query = query.range(from, to);
      
      // Execute query
      const { data, error, count } = await query;
      
      return { 
        data: data as T[] | null, 
        count: count || 0,
        error 
      };
    } catch (error) {
      console.error(`Error fetching data from ${table}:`, error);
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
    
    try {
      const { data: insertedData, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data: insertedData as T, error: null };
    } catch (error) {
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
    
    try {
      const { data: updatedData, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data: updatedData as T, error: null };
    } catch (error) {
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
    
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error) {
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
    itemType: 'project' | 'scholarship' | 'event' | 'gig',
    itemId: string,
    userId: string
  ): Promise<{ bookmarked: boolean; error: any }> {
    setLoading(true);
    
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
        
        return { bookmarked: true, error: null };
      }
    } catch (error) {
      console.error(`Error toggling bookmark:`, error);
      return { bookmarked: false, error };
    } finally {
      setLoading(false);
    }
  }

  // Check if an item is bookmarked
  async function isBookmarked(
    itemType: 'project' | 'scholarship' | 'event' | 'gig',
    itemId: string,
    userId: string
  ): Promise<boolean> {
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
    itemType?: 'project' | 'scholarship' | 'event' | 'gig'
  ): Promise<{ data: any[]; error: any }> {
    setLoading(true);
    
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
