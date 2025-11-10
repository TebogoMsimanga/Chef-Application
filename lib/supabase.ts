/**
 * Supabase Client Library
 * 
 * This module provides all Supabase database operations including:
 * - Authentication (sign in, sign up, sign out, get current user)
 * - Categories (get all categories)
 * - Menu Items (CRUD operations)
 * - Favorites (add, remove, get favorites)
 * - Orders (create, get orders)
 * - Profile (update profile)
 * - Customizations (sides, toppings)
 * 
 * All functions include:
 * - Comprehensive error handling
 * - Sentry error tracking
 * - Console logging for debugging
 * 
 * @module lib/supabase
 */

import 'react-native-url-polyfill/auto';
import * as Sentry from '@sentry/react-native';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get Supabase configuration from environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  const error = new Error('Missing Supabase environment variables');
  console.error('[Supabase] Configuration error:', error);
  Sentry.captureException(error, {
    tags: { component: 'Supabase', issue: 'configuration' },
  });
  throw error;
}

console.log('[Supabase] Initializing client...');

let supabaseInstance: SupabaseClient | null = null;

/**
 * Get AsyncStorage for React Native
 * Only available on client side
 */
const getAsyncStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      return AsyncStorage;
    } catch (error) {
      console.warn('[Supabase] AsyncStorage not available:', error);
      return undefined;
    }
  }
  return undefined;
};

/**
 * Get or create Supabase client instance
 * Uses singleton pattern to ensure only one instance exists
 * 
 * @returns {SupabaseClient} Supabase client instance
 */
export const getSupabase = (): SupabaseClient => {
  if (!supabaseInstance) {
    console.log('[Supabase] Creating new client instance...');
    const storage = getAsyncStorage();
    
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          storage: storage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      });
      console.log('[Supabase] Client created successfully');
    } catch (error) {
      console.error('[Supabase] Error creating client:', error);
      Sentry.captureException(error, {
        tags: { component: 'Supabase', issue: 'client_creation' },
      });
      throw error;
    }
  }
  return supabaseInstance;
};

// Export singleton instance
export const supabase = getSupabase();

// ============================================================================
// AUTHENTICATION FUNCTIONS
// ============================================================================

/**
 * Sign in with email and password
 * 
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<any>} Auth data with user and session
 */
export async function signIn({ email, password }: { email: string; password: string }) {
  try {
    console.log('[Supabase] Signing in user:', email);
    
    const { data, error } = await getSupabase().auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('[Supabase] Sign in error:', error.message);
      Sentry.captureException(error, {
        tags: { component: 'Supabase', action: 'signIn' },
        extra: { email },
      });
      throw error;
    }
    
    console.log('[Supabase] Sign in successful:', data.user?.email);
    return data;
  } catch (error: any) {
    console.error('[Supabase] Sign in failed:', error);
    Sentry.captureException(error, {
      tags: { component: 'Supabase', action: 'signIn' },
      extra: { email, errorMessage: error?.message },
    });
    throw error;
  }
}

/**
 * Sign up new user with email and password
 * 
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User name
 * @returns {Promise<any>} Auth data with user and session
 */
export async function signUp({ 
  email, 
  password, 
  name 
}: { 
  email: string; 
  password: string; 
  name: string;
}) {
  try {
    console.log('[Supabase] Signing up user:', email);
    
    const { data: authData, error: authError } = await getSupabase().auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
        emailRedirectTo: undefined,
      },
    });
    
    if (authError) {
      console.error('[Supabase] Sign up error:', authError.message);
      Sentry.captureException(authError, {
        tags: { component: 'Supabase', action: 'signUp' },
        extra: { email },
      });
      throw authError;
    }
    
    console.log('[Supabase] Sign up successful:', authData.user?.email);
    return authData;
  } catch (error: any) {
    console.error('[Supabase] Sign up failed:', error);
    Sentry.captureException(error, {
      tags: { component: 'Supabase', action: 'signUp' },
      extra: { email, errorMessage: error?.message },
    });
    throw error;
  }
}

/**
 * Sign out current user
 * 
 * @returns {Promise<void>}
 */
export async function signOut() {
  try {
    console.log('[Supabase] Signing out user...');
    
    const { error } = await getSupabase().auth.signOut();
    
    if (error) {
      console.error('[Supabase] Sign out error:', error.message);
      Sentry.captureException(error, {
        tags: { component: 'Supabase', action: 'signOut' },
      });
      throw error;
    }
    
    console.log('[Supabase] Sign out successful');
  } catch (error: any) {
    console.error('[Supabase] Sign out failed:', error);
    Sentry.captureException(error, {
      tags: { component: 'Supabase', action: 'signOut' },
      extra: { errorMessage: error?.message },
    });
    throw error;
  }
}

/**
 * Get current authenticated user with profile data
 * 
 * @returns {Promise<any|null>} User profile or null if not authenticated
 */
export async function getCurrentUser() {
  try {
    console.log('[Supabase] Getting current user...');
    
    const { data: { session }, error } = await getSupabase().auth.getSession();
    
    if (error) {
      console.error('[Supabase] Get session error:', error.message);
      Sentry.captureException(error, {
        tags: { component: 'Supabase', action: 'getCurrentUser' },
      });
      throw error;
    }
    
    if (!session?.user) {
      console.log('[Supabase] No active session');
      return null;
    }
    
    console.log('[Supabase] Fetching user profile:', session.user.id);
    
    const { data: profile, error: profileError } = await getSupabase()
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (profileError) {
      console.error('[Supabase] Get profile error:', profileError.message);
      Sentry.captureException(profileError, {
        tags: { component: 'Supabase', action: 'getCurrentUser' },
        extra: { userId: session.user.id },
      });
      throw profileError;
    }
    
    console.log('[Supabase] User profile fetched:', profile?.email);
    return profile;
  } catch (error: any) {
    console.error('[Supabase] Get current user failed:', error);
    Sentry.captureException(error, {
      tags: { component: 'Supabase', action: 'getCurrentUser' },
      extra: { errorMessage: error?.message },
    });
    throw error;
  }
}

// ============================================================================
// CATEGORIES FUNCTIONS
// ============================================================================

/**
 * Get all categories
 * 
 * @returns {Promise<any[]>} Array of categories
 */
export async function getCategories() {
  try {
    console.log('[Supabase] Fetching categories...');
    
    const { data, error } = await getSupabase()
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('[Supabase] Get categories error:', error.message);
      Sentry.captureException(error, {
        tags: { component: 'Supabase', action: 'getCategories' },
      });
      throw error;
    }
    
    console.log('[Supabase] Categories fetched:', data?.length || 0);
    return data || [];
  } catch (error: any) {
    console.error('[Supabase] Get categories failed:', error);
    Sentry.captureException(error, {
      tags: { component: 'Supabase', action: 'getCategories' },
      extra: { errorMessage: error?.message },
    });
    throw error;
  }
}

// ============================================================================
// MENU ITEMS FUNCTIONS
// ============================================================================

/**
 * Get menu items with optional filtering
 * 
 * @param {string} category - Category ID to filter by
 * @param {string} query - Search query for menu item names
 * @param {number} limit - Maximum number of items to return
 * @returns {Promise<any[]>} Array of menu items
 */
export async function getMenu({ 
  category = '', 
  query = '', 
  limit = 100 
}: { 
  category?: string; 
  query?: string; 
  limit?: number;
} = {}) {
  try {
    console.log('[Supabase] Fetching menu items:', { category, query, limit });
    
    let queryBuilder = getSupabase()
      .from('menu_items')
      .select(`
        *,
        category:categories(id, name)
      `)
      .order('name');
    
    if (category) {
      queryBuilder = queryBuilder.eq('category_id', category);
    }
    
    if (query) {
      queryBuilder = queryBuilder.ilike('name', `%${query}%`);
    }
    
    queryBuilder = queryBuilder.limit(limit);
    
    const { data, error } = await queryBuilder;
    
    if (error) {
      console.error('[Supabase] Get menu error:', error.message);
      Sentry.captureException(error, {
        tags: { component: 'Supabase', action: 'getMenu' },
        extra: { category, query, limit },
      });
      throw error;
    }
    
    console.log('[Supabase] Menu items fetched:', data?.length || 0);
    return data || [];
  } catch (error: any) {
    console.error('[Supabase] Get menu failed:', error);
    Sentry.captureException(error, {
      tags: { component: 'Supabase', action: 'getMenu' },
      extra: { category, query, limit, errorMessage: error?.message },
    });
    throw error;
  }
}

/**
 * Get single menu item by ID
 * 
 * @param {string} id - Menu item ID
 * @returns {Promise<any>} Menu item with category data
 */
export async function getMenuItem(id: string) {
  try {
    console.log('[Supabase] Fetching menu item:', id);
    
    const { data, error } = await getSupabase()
      .from('menu_items')
      .select(`
        *,
        category:categories(id, name)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('[Supabase] Get menu item error:', error.message);
      Sentry.captureException(error, {
        tags: { component: 'Supabase', action: 'getMenuItem' },
        extra: { id },
      });
      throw error;
    }
    
    console.log('[Supabase] Menu item fetched:', data?.name);
    return data;
  } catch (error: any) {
    console.error('[Supabase] Get menu item failed:', error);
    Sentry.captureException(error, {
      tags: { component: 'Supabase', action: 'getMenuItem' },
      extra: { id, errorMessage: error?.message },
    });
    throw error;
  }
}

/**
 * Create new menu item
 * 
 * @param {any} item - Menu item data
 * @returns {Promise<any>} Created menu item
 */
export async function createMenuItem(item: any) {
  try {
    console.log('[Supabase] Creating menu item:', item.name);
    
    const { data, error } = await getSupabase()
      .from('menu_items')
      .insert(item)
      .select()
      .single();
    
    if (error) {
      console.error('[Supabase] Create menu item error:', error.message);
      Sentry.captureException(error, {
        tags: { component: 'Supabase', action: 'createMenuItem' },
        extra: { itemName: item.name },
      });
      throw error;
    }
    
    console.log('[Supabase] Menu item created:', data?.id);
    return data;
  } catch (error: any) {
    console.error('[Supabase] Create menu item failed:', error);
    Sentry.captureException(error, {
      tags: { component: 'Supabase', action: 'createMenuItem' },
      extra: { item, errorMessage: error?.message },
    });
    throw error;
  }
}

/**
 * Update menu item
 * 
 * @param {string} id - Menu item ID
 * @param {any} updates - Fields to update
 * @returns {Promise<any>} Updated menu item
 */
export async function updateMenuItem(id: string, updates: any) {
  try {
    console.log('[Supabase] Updating menu item:', id);
    
    const { data, error } = await getSupabase()
      .from('menu_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('[Supabase] Update menu item error:', error.message);
      Sentry.captureException(error, {
        tags: { component: 'Supabase', action: 'updateMenuItem' },
        extra: { id },
      });
      throw error;
    }
    
    console.log('[Supabase] Menu item updated:', data?.id);
    return data;
  } catch (error: any) {
    console.error('[Supabase] Update menu item failed:', error);
    Sentry.captureException(error, {
      tags: { component: 'Supabase', action: 'updateMenuItem' },
      extra: { id, updates, errorMessage: error?.message },
    });
    throw error;
  }
}

/**
 * Delete menu item
 * 
 * @param {string} id - Menu item ID
 * @returns {Promise<void>}
 */
export async function deleteMenuItem(id: string) {
  try {
    console.log('[Supabase] Deleting menu item:', id);
    
    const { error } = await getSupabase()
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('[Supabase] Delete menu item error:', error.message);
      Sentry.captureException(error, {
        tags: { component: 'Supabase', action: 'deleteMenuItem' },
        extra: { id },
      });
      throw error;
    }
    
    console.log('[Supabase] Menu item deleted:', id);
  } catch (error: any) {
    console.error('[Supabase] Delete menu item failed:', error);
    Sentry.captureException(error, {
      tags: { component: 'Supabase', action: 'deleteMenuItem' },
      extra: { id, errorMessage: error?.message },
    });
    throw error;
  }
}

/**
 * Upload image to Supabase storage
 * 
 * @param {string} uri - Local file URI
 * @param {string} fileName - Name for the file in storage
 * @param {string} bucket - Storage bucket name (default: 'menu-images')
 * @returns {Promise<string>} Public URL of uploaded image
 */
export async function uploadImage(
  uri: string,
  fileName: string,
  bucket: string = 'menu-images'
): Promise<string> {
  try {
    console.log('[Supabase] Uploading image:', fileName, 'to bucket:', bucket);
    
    // Read file as blob
    const response = await fetch(uri);
    const blob = await response.blob();
    
    // Generate unique filename
    const fileExt = fileName.split('.').pop();
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `menu-items/${uniqueFileName}`;
    
    console.log('[Supabase] Uploading to path:', filePath);
    
    // Upload to Supabase storage
    const { data, error } = await getSupabase()
      .storage
      .from(bucket)
      .upload(filePath, blob, {
        contentType: blob.type || 'image/jpeg',
        upsert: false,
      });
    
    if (error) {
      console.error('[Supabase] Upload image error:', error.message);
      Sentry.captureException(error, {
        tags: { component: 'Supabase', action: 'uploadImage' },
        extra: { fileName, bucket, errorMessage: error?.message },
      });
      throw error;
    }
    
    // Get public URL
    const { data: urlData } = getSupabase()
      .storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    const publicUrl = urlData.publicUrl;
    console.log('[Supabase] Image uploaded successfully:', publicUrl);
    
    return publicUrl;
  } catch (error: any) {
    console.error('[Supabase] Upload image failed:', error);
    Sentry.captureException(error, {
      tags: { component: 'Supabase', action: 'uploadImage' },
      extra: { fileName, bucket, errorMessage: error?.message },
    });
    throw error;
  }
}

/**
 * Initialize categories if they don't exist
 * Creates default categories for the application
 * 
 * @returns {Promise<void>}
 */
export async function initializeCategories() {
  try {
    console.log('[Supabase] Initializing categories...');
    
    const defaultCategories = [
      { name: 'Breakfast', description: 'Morning meals and breakfast items' },
      { name: 'Starters', description: 'Appetizers and starters' },
      { name: 'Lunch', description: 'Lunch meals and dishes' },
      { name: 'Supper', description: 'Evening meals' },
      { name: 'Meals', description: 'Main meals and dishes' },
    ];
    
    const supabase = getSupabase();
    
    // Check existing categories
    const { data: existingCategories } = await supabase
      .from('categories')
      .select('name');
    
    const existingNames = new Set(existingCategories?.map(c => c.name.toLowerCase()) || []);
    
    // Insert only new categories
    const newCategories = defaultCategories.filter(
      cat => !existingNames.has(cat.name.toLowerCase())
    );
    
    if (newCategories.length > 0) {
      const { error } = await supabase
        .from('categories')
        .insert(newCategories);
      
      if (error) {
        console.error('[Supabase] Initialize categories error:', error.message);
        Sentry.captureException(error, {
          tags: { component: 'Supabase', action: 'initializeCategories' },
        });
        throw error;
      }
      
      console.log('[Supabase] Created', newCategories.length, 'new categories');
    } else {
      console.log('[Supabase] All categories already exist');
    }
  } catch (error: any) {
    console.error('[Supabase] Initialize categories failed:', error);
    Sentry.captureException(error, {
      tags: { component: 'Supabase', action: 'initializeCategories' },
      extra: { errorMessage: error?.message },
    });
    throw error;
  }
}

// ============================================================================
// FAVORITES FUNCTIONS
// ============================================================================

/**
 * Get user's favorites
 * 
 * @param {string} userId - User ID
 * @returns {Promise<any[]>} Array of favorites with menu item data
 */
export async function getFavorites(userId: string) {
  try {
    console.log('[Supabase] Fetching favorites for user:', userId);
    
    const { data, error } = await getSupabase()
      .from('favorites')
      .select(`
        *,
        menu_item:menu_items(*)
      `)
      .eq('user_id', userId);
    
    if (error) {
      console.error('[Supabase] Get favorites error:', error.message);
      Sentry.captureException(error, {
        tags: { component: 'Supabase', action: 'getFavorites' },
        extra: { userId },
      });
      throw error;
    }
    
    console.log('[Supabase] Favorites fetched:', data?.length || 0);
    return data || [];
  } catch (error: any) {
    console.error('[Supabase] Get favorites failed:', error);
    Sentry.captureException(error, {
      tags: { component: 'Supabase', action: 'getFavorites' },
      extra: { userId, errorMessage: error?.message },
    });
    throw error;
  }
}

/**
 * Add menu item to favorites
 * 
 * @param {string} userId - User ID
 * @param {string} menuItemId - Menu item ID
 * @returns {Promise<any>} Created favorite record
 */
export async function addFavorite(userId: string, menuItemId: string) {
  try {
    console.log('[Supabase] Adding favorite:', { userId, menuItemId });
    
    const { data, error } = await getSupabase()
      .from('favorites')
      .insert({ user_id: userId, menu_item_id: menuItemId })
      .select()
      .single();
    
    if (error) {
      console.error('[Supabase] Add favorite error:', error.message);
      Sentry.captureException(error, {
        tags: { component: 'Supabase', action: 'addFavorite' },
        extra: { userId, menuItemId },
      });
      throw error;
    }
    
    console.log('[Supabase] Favorite added:', data?.id);
    return data;
  } catch (error: any) {
    console.error('[Supabase] Add favorite failed:', error);
    Sentry.captureException(error, {
      tags: { component: 'Supabase', action: 'addFavorite' },
      extra: { userId, menuItemId, errorMessage: error?.message },
    });
    throw error;
  }
}

/**
 * Remove menu item from favorites
 * 
 * @param {string} userId - User ID
 * @param {string} menuItemId - Menu item ID
 * @returns {Promise<void>}
 */
export async function removeFavorite(userId: string, menuItemId: string) {
  try {
    console.log('[Supabase] Removing favorite:', { userId, menuItemId });
    
    const { error } = await getSupabase()
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('menu_item_id', menuItemId);
    
    if (error) {
      console.error('[Supabase] Remove favorite error:', error.message);
      Sentry.captureException(error, {
        tags: { component: 'Supabase', action: 'removeFavorite' },
        extra: { userId, menuItemId },
      });
      throw error;
    }
    
    console.log('[Supabase] Favorite removed');
  } catch (error: any) {
    console.error('[Supabase] Remove favorite failed:', error);
    Sentry.captureException(error, {
      tags: { component: 'Supabase', action: 'removeFavorite' },
      extra: { userId, menuItemId, errorMessage: error?.message },
    });
    throw error;
  }
}

// ============================================================================
// ORDERS FUNCTIONS
// ============================================================================

/**
 * Create new order
 * 
 * @param {any} order - Order data
 * @returns {Promise<any>} Created order
 */
export async function createOrder(order: any) {
  try {
    console.log('[Supabase] Creating order:', order.user_id);
    
    const { data, error } = await getSupabase()
      .from('orders')
      .insert(order)
      .select()
      .single();
    
    if (error) {
      console.error('[Supabase] Create order error:', error.message);
      Sentry.captureException(error, {
        tags: { component: 'Supabase', action: 'createOrder' },
        extra: { userId: order.user_id },
      });
      throw error;
    }
    
    console.log('[Supabase] Order created:', data?.id);
    return data;
  } catch (error: any) {
    console.error('[Supabase] Create order failed:', error);
    Sentry.captureException(error, {
      tags: { component: 'Supabase', action: 'createOrder' },
      extra: { order, errorMessage: error?.message },
    });
    throw error;
  }
}

/**
 * Get user's orders
 * 
 * @param {string} userId - User ID
 * @returns {Promise<any[]>} Array of orders with order items
 */
export async function getOrders(userId: string) {
  try {
    console.log('[Supabase] Fetching orders for user:', userId);
    
    const { data, error } = await getSupabase()
      .from('orders')
      .select(`
        *,
        order_items:order_items(
          *,
          menu_item:menu_items(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('[Supabase] Get orders error:', error.message);
      Sentry.captureException(error, {
        tags: { component: 'Supabase', action: 'getOrders' },
        extra: { userId },
      });
      throw error;
    }
    
    console.log('[Supabase] Orders fetched:', data?.length || 0);
    return data || [];
  } catch (error: any) {
    console.error('[Supabase] Get orders failed:', error);
    Sentry.captureException(error, {
      tags: { component: 'Supabase', action: 'getOrders' },
      extra: { userId, errorMessage: error?.message },
    });
    throw error;
  }
}

// ============================================================================
// PROFILE FUNCTIONS
// ============================================================================

/**
 * Update user profile
 * 
 * @param {string} userId - User ID
 * @param {any} updates - Fields to update
 * @returns {Promise<any>} Updated profile
 */
export async function updateProfile(userId: string, updates: any) {
  try {
    console.log('[Supabase] Updating profile:', userId);
    
    const { data, error } = await getSupabase()
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('[Supabase] Update profile error:', error.message);
      Sentry.captureException(error, {
        tags: { component: 'Supabase', action: 'updateProfile' },
        extra: { userId },
      });
      throw error;
    }
    
    console.log('[Supabase] Profile updated:', data?.id);
    return data;
  } catch (error: any) {
    console.error('[Supabase] Update profile failed:', error);
    Sentry.captureException(error, {
      tags: { component: 'Supabase', action: 'updateProfile' },
      extra: { userId, updates, errorMessage: error?.message },
    });
    throw error;
  }
}

// ============================================================================
// CUSTOMIZATIONS FUNCTIONS (SIDES & TOPPINGS)
// ============================================================================

/**
 * Get all sides
 * 
 * @returns {Promise<any[]>} Array of sides
 */
export async function getSides() {
  try {
    console.log('[Supabase] Fetching sides...');
    
    const { data, error } = await getSupabase()
      .from('sides')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('[Supabase] Get sides error:', error.message);
      Sentry.captureException(error, {
        tags: { component: 'Supabase', action: 'getSides' },
      });
      throw error;
    }
    
    console.log('[Supabase] Sides fetched:', data?.length || 0);
    return data || [];
  } catch (error: any) {
    console.error('[Supabase] Get sides failed:', error);
    Sentry.captureException(error, {
      tags: { component: 'Supabase', action: 'getSides' },
      extra: { errorMessage: error?.message },
    });
    throw error;
  }
}

/**
 * Get all toppings
 * 
 * @returns {Promise<any[]>} Array of toppings
 */
export async function getToppings() {
  try {
    console.log('[Supabase] Fetching toppings...');
    
    const { data, error } = await getSupabase()
      .from('toppings')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('[Supabase] Get toppings error:', error.message);
      Sentry.captureException(error, {
        tags: { component: 'Supabase', action: 'getToppings' },
      });
      throw error;
    }
    
    console.log('[Supabase] Toppings fetched:', data?.length || 0);
    return data || [];
  } catch (error: any) {
    console.error('[Supabase] Get toppings failed:', error);
    Sentry.captureException(error, {
      tags: { component: 'Supabase', action: 'getToppings' },
      extra: { errorMessage: error?.message },
    });
    throw error;
  }
}

/**
 * Get sides by type
 * 
 * @param {string} type - Side type
 * @returns {Promise<any[]>} Array of sides filtered by type
 */
export async function getSidesByType(type: string) {
  try {
    console.log('[Supabase] Fetching sides by type:', type);
    
    const { data, error } = await getSupabase()
      .from('sides')
      .select('*')
      .eq('type', type)
      .order('name');
    
    if (error) {
      console.error('[Supabase] Get sides by type error:', error.message);
      Sentry.captureException(error, {
        tags: { component: 'Supabase', action: 'getSidesByType' },
        extra: { type },
      });
      throw error;
    }
    
    console.log('[Supabase] Sides by type fetched:', data?.length || 0);
    return data || [];
  } catch (error: any) {
    console.error('[Supabase] Get sides by type failed:', error);
    Sentry.captureException(error, {
      tags: { component: 'Supabase', action: 'getSidesByType' },
      extra: { type, errorMessage: error?.message },
    });
    throw error;
  }
}

/**
 * Get toppings by type
 * 
 * @param {string} type - Topping type
 * @returns {Promise<any[]>} Array of toppings filtered by type
 */
export async function getToppingsByType(type: string) {
  try {
    console.log('[Supabase] Fetching toppings by type:', type);
    
    const { data, error } = await getSupabase()
      .from('toppings')
      .select('*')
      .eq('type', type)
      .order('name');
    
    if (error) {
      console.error('[Supabase] Get toppings by type error:', error.message);
      Sentry.captureException(error, {
        tags: { component: 'Supabase', action: 'getToppingsByType' },
        extra: { type },
      });
      throw error;
    }
    
    console.log('[Supabase] Toppings by type fetched:', data?.length || 0);
    return data || [];
  } catch (error: any) {
    console.error('[Supabase] Get toppings by type failed:', error);
    Sentry.captureException(error, {
      tags: { component: 'Supabase', action: 'getToppingsByType' },
      extra: { type, errorMessage: error?.message },
    });
    throw error;
  }
}
