import useSWR from 'swr'
import { supabase } from './client'

const supabaseFetcher = async ({ table, select = '*', order, filter, single }) => {
  let query = supabase.from(table).select(select)
  if (order) {
    query = query.order(order.column, { ascending: order.ascending ?? false })
  }
  if (filter) {
    const { column, operator = 'eq', value } = filter
    query = query[operator](column, value)
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
 * @param {string} key - Unique SWR key (e.g. 'blog_posts')
 * @param {object} options - { table, select, order, filter, single }
 * @returns SWR response { data, error, isLoading, mutate }
 */
export default function useSupabaseSWR(key, options) {
  // Use a stable key and fetcher
  return useSWR([key, options], ([, opts]) => supabaseFetcher(opts))
}
