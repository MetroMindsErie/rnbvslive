import useSWR from 'swr';
import { supabase } from './client';

/**
 * Custom hook for Supabase data fetching with SWR
 * @param {string|array} key - Cache key or array of keys
 * @param {object} options - Query options
 * @returns {object} SWR response with data, error, and loading state
 */
export default function useSupabaseSWR(key, options = {}) {
  // Return empty state if no key is provided
  if (!key) {
    return {
      data: null,
      error: null,
      isLoading: false
    };
  }

  // Use SWR for data fetching with cache
  const { data, error, isLoading } = useSWR(key, async () => {
    try {
      const { table, filter, single } = options;
      
      // Start building the query
      let query = supabase.from(table).select('*');
      
      // Apply filter if provided
      if (filter && filter.column && filter.value) {
        query = query.eq(filter.column, filter.value);
      }
      
      // Execute as single or multiple records query
      const { data: result, error: queryError } = single
        ? await query.single()
        : await query;
        
      if (queryError) throw queryError;
      return result;
    } catch (err) {
      console.error('Supabase query error:', err);
      throw err;
    }
  });

  return {
    data,
    error,
    isLoading
  };
}
    
  