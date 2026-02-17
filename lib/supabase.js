import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in your deployment environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Database schema for bookmarks
export const BOOKMARKS_TABLE = 'bookmarks';

// Helper functions for bookmark operations
export const bookmarkService = {
  // Get all bookmarks for current user
  async getUserBookmarks(userId) {
    if (!userId) return [];
    
    const { data, error } = await supabase
      .from(BOOKMARKS_TABLE)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching bookmarks:', error);
      return [];
    }
    return data || [];
  },

  // Add new bookmark
  async addBookmark(bookmark) {
    const { data, error } = await supabase
      .from(BOOKMARKS_TABLE)
      .insert([bookmark])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
    return data;
  },

  // Update bookmark
  async updateBookmark(id, updates) {
    const { data, error } = await supabase
      .from(BOOKMARKS_TABLE)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating bookmark:', error);
      throw error;
    }
    return data;
  },

  // Delete bookmark
  async deleteBookmark(id) {
    const { error } = await supabase
      .from(BOOKMARKS_TABLE)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting bookmark:', error);
      throw error;
    }
  },

  // Subscribe to real-time bookmark changes for a user
  subscribeToUserBookmarks(userId, callback) {
    if (!userId) return null;
    
    return supabase
      .channel(`bookmarks:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: BOOKMARKS_TABLE,
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },
};
