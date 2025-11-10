import 'react-native-url-polyfill/auto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

let supabaseInstance: SupabaseClient | null = null;

const getAsyncStorage = () => {
  if (typeof window !== 'undefined') {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return AsyncStorage;
  }
  return undefined;
};

export const getSupabase = () => {
  if (!supabaseInstance) {
    const storage = getAsyncStorage();
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: storage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }
  return supabaseInstance;
};

export const supabase = getSupabase();

// Auth functions
export async function signIn({ email, password }: { email: string; password: string }) {
  const { data, error } = await getSupabase().auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

export async function signUp({ 
  email, 
  password, 
  name 
}: { 
  email: string; 
  password: string; 
  name: string;
}) {
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
  
  if (authError) throw authError;
  
  return authData;
}

export async function signOut() {
  const { error } = await getSupabase().auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { session }, error } = await getSupabase().auth.getSession();
  if (error) throw error;
  
  if (!session?.user) return null;
  
  const { data: profile } = await getSupabase()
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
  
  return profile;
}

// Categories
export async function getCategories() {
  const { data, error } = await getSupabase()
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
}

// Menu Items
export async function getMenu({ 
  category = '', 
  query = '', 
  limit = 100 
}: { 
  category?: string; 
  query?: string; 
  limit?: number;
} = {}) {
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
  
  if (error) throw error;
  return data;
}

export async function getMenuItem(id: string) {
  const { data, error } = await getSupabase()
    .from('menu_items')
    .select(`
      *,
      category:categories(id, name)
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createMenuItem(item: any) {
  const { data, error } = await getSupabase()
    .from('menu_items')
    .insert(item)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateMenuItem(id: string, updates: any) {
  const { data, error } = await getSupabase()
    .from('menu_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteMenuItem(id: string) {
  const { error } = await getSupabase()
    .from('menu_items')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Favorites
export async function getFavorites(userId: string) {
  const { data, error } = await getSupabase()
    .from('favorites')
    .select(`
      *,
      menu_item:menu_items(*)
    `)
    .eq('user_id', userId);
  
  if (error) throw error;
  return data;
}

export async function addFavorite(userId: string, menuItemId: string) {
  const { data, error } = await getSupabase()
    .from('favorites')
    .insert({ user_id: userId, menu_item_id: menuItemId })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function removeFavorite(userId: string, menuItemId: string) {
  const { error } = await getSupabase()
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('menu_item_id', menuItemId);
  
  if (error) throw error;
}

// Orders
export async function createOrder(order: any) {
  const { data, error } = await getSupabase()
    .from('orders')
    .insert(order)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getOrders(userId: string) {
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
  
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: any) {
  const { data, error } = await getSupabase()
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getSides() {
  const { data, error } = await getSupabase()
    .from('sides')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
}

export async function getToppings() {
  const { data, error } = await getSupabase()
    .from('toppings')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
}

export async function getSidesByType(type: string) {
  const { data, error } = await getSupabase()
    .from('sides')
    .select('*')
    .eq('type', type)
    .order('name');
  
  if (error) throw error;
  return data;
}

export async function getToppingsByType(type: string) {
  const { data, error } = await getSupabase()
    .from('toppings')
    .select('*')
    .eq('type', type)
    .order('name');
  
  if (error) throw error;
  return data;
}