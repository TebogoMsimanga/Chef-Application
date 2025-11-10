/**
 * useSupabase Hook
 * 
 * Custom React hook for fetching data from Supabase with:
 * - Loading state management
 * - Error handling with Sentry integration
 * - Automatic refetching capability
 * - Console logging for debugging
 * 
 * @module lib/useSupabase
 */

import {useCallback, useEffect, useState, useRef} from "react";
import {Alert} from "react-native";
import * as Sentry from "@sentry/react-native";

/**
 * Options for useSupabase hook
 */
interface UseSupabaseOptions<T, P extends Record<string, any>> { 
  fn: (params: P) => Promise<T>;
  params?: P;
  skip?: boolean;
  showErrorAlert?: boolean; // Option to show/hide error alerts
}

/**
 * Return type for useSupabase hook
 */
interface UseSupabaseReturn<T, P> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (newParams?: P) => Promise<void>;
}

/**
 * Custom hook for fetching data from Supabase
 * 
 * @template T - Type of data returned
 * @template P - Type of parameters object
 * @param {UseSupabaseOptions<T, P>} options - Hook options
 * @returns {UseSupabaseReturn<T, P>} Hook return value with data, loading, error, and refetch
 * 
 * @example
 * const { data, loading, error, refetch } = useSupabase({
 *   fn: getMenu,
 *   params: { category: 'pizza', limit: 10 },
 *   skip: false,
 *   showErrorAlert: true
 * });
 */
const useSupabase = <T, P extends Record<string, any>>({  
  fn,
  params = {} as P,
  skip = false,
  showErrorAlert = true,
}: UseSupabaseOptions<T, P>): UseSupabaseReturn<T, P> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);
  const fnNameRef = useRef<string>(fn.name || 'unknown');

  // Get function name for logging
  useEffect(() => {
    fnNameRef.current = fn.name || 'unknown';
  }, [fn]);

  /**
   * Fetch data from Supabase
   * Handles loading states, errors, and logging
   */
  const fetchData = useCallback(
    async (fetchParams: P) => {
      const functionName = fnNameRef.current;
      console.log(`[useSupabase] Fetching data with ${functionName}:`, fetchParams);
      
      setLoading(true);
      setError(null);

      try {
        const result = await fn({ ...fetchParams });
        
        console.log(`[useSupabase] ${functionName} success:`, Array.isArray(result) ? `${result.length} items` : 'data received');
        setData(result);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        
        console.error(`[useSupabase] ${functionName} error:`, errorMessage);
        console.error(`[useSupabase] Error details:`, err);
        
        setError(errorMessage);
        
        // Log to Sentry with context
        Sentry.captureException(err instanceof Error ? err : new Error(errorMessage), {
          tags: {
            component: 'useSupabase',
            function: functionName,
          },
          extra: {
            params: fetchParams,
            errorMessage,
          },
        });
        
        // Show error alert if enabled
        if (showErrorAlert) {
          Alert.alert("Error", errorMessage);
        }
      } finally {
        setLoading(false);
        console.log(`[useSupabase] ${functionName} completed`);
      }
    },
    [fn, showErrorAlert]
  );

  /**
   * Initial data fetch on mount (if not skipped)
   */
  useEffect(() => {
    if (!skip) {
      console.log(`[useSupabase] Initial fetch for ${fnNameRef.current}`);
      fetchData(params);
    } else {
      console.log(`[useSupabase] Skipping initial fetch for ${fnNameRef.current}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  /**
   * Refetch data with optional new parameters
   * 
   * @param {P} newParams - Optional new parameters to use for fetching
   */
  const refetch = useCallback(async (newParams?: P) => {
    console.log(`[useSupabase] Refetching ${fnNameRef.current}`);
    await fetchData(newParams ?? params);
  }, [fetchData, params]);

  return { data, loading, error, refetch };
};

export default useSupabase;


