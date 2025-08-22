import useSWR from 'swr'
import { supabase } from './client'

const supabaseFetcher = async ({ table, select = '*', order, filter, match, single }) => {
  let query = supabase.from(table).select(select)
  
  if (order) {
    query = query.order(order.column, { ascending: order.ascending ?? false })
  }
  
  if (filter) {
    for (const [key, value] of Object.entries(filter)) {
      // Handle simple filter format: { id: 'eq.123' }
      if (typeof value === 'string' && value.startsWith('eq.')) {
        query = query.eq(key, value.substring(3))
      } else if (typeof value === 'object') {
        // Handle complex filter format: { column: 'id', operator: 'eq', value: '123' }
        const { operator = 'eq', value: filterValue } = value
        query = query[operator](key, filterValue)
      } else {
        // Handle simple equality: { id: '123' }
        query = query.eq(key, value)
      }
    }
  }
  
  // Handle match object (exact matches)
  if (match) {
    for (const [column, value] of Object.entries(match)) {
      query = query.eq(column, value)
    }
  }
  
  if (single) {
    query = query.single()
  }
  
  const { data, error } = await query
  if (error) throw error
  return data
}

/**
 * Generic SWR hook for Supabase table queries.
 * @param {string|array|null} key - Unique SWR key (e.g. 'blog_posts') or null to disable fetching
 * @param {object|null} options - { table, select, order, filter, match, single } or null
 * @returns SWR response { data, error, isLoading, mutate }
 */
export default function useSupabaseSWR(key, options) {
  // Always call useSWR, but don't fetch if key is null
  return useSWR(
    key, 
    key ? () => supabaseFetcher(options) : null,
    { suspense: false }
  )
}
