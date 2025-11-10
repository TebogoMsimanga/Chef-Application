/**
 * Storage Setup Helper
 * 
 * This module provides functions to set up Supabase storage bucket and policies.
 * Can be used to programmatically create the bucket and policies.
 * 
 * @module lib/setup-storage
 */

import { getSupabase } from './supabase';
import * as Sentry from '@sentry/react-native';

/**
 * Create storage bucket if it doesn't exist
 * Note: This requires service role key or admin access
 * 
 * @param {string} bucketName - Name of the bucket (default: 'menu-images')
 * @returns {Promise<boolean>} True if bucket was created or already exists
 */
export async function createStorageBucket(bucketName: string = 'menu-images'): Promise<boolean> {
  try {
    console.log('[SetupStorage] Checking if bucket exists:', bucketName);
    
    const supabase = getSupabase();
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase
      .storage
      .listBuckets();
    
    if (listError) {
      console.error('[SetupStorage] Error listing buckets:', listError);
      throw listError;
    }
    
    const bucketExists = buckets?.some(b => b.name === bucketName);
    
    if (bucketExists) {
      console.log('[SetupStorage] Bucket already exists:', bucketName);
      return true;
    }
    
    console.log('[SetupStorage] Creating bucket:', bucketName);
    
    // Create bucket
    // Note: This requires admin access or service role key
    // For public buckets, set public: true
    const { data, error } = await supabase
      .storage
      .createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      });
    
    if (error) {
      console.error('[SetupStorage] Error creating bucket:', error);
      Sentry.captureException(error, {
        tags: { component: 'SetupStorage', action: 'createBucket' },
        extra: { bucketName, errorMessage: error.message },
      });
      throw error;
    }
    
    console.log('[SetupStorage] Bucket created successfully:', bucketName);
    return true;
  } catch (error: any) {
    console.error('[SetupStorage] Failed to create bucket:', error);
    Sentry.captureException(error, {
      tags: { component: 'SetupStorage', action: 'createBucket' },
      extra: { bucketName, errorMessage: error?.message },
    });
    throw error;
  }
}

/**
 * Verify storage bucket exists and is accessible
 * 
 * @param {string} bucketName - Name of the bucket (default: 'menu-images')
 * @returns {Promise<boolean>} True if bucket exists and is accessible
 */
export async function verifyStorageBucket(bucketName: string = 'menu-images'): Promise<boolean> {
  try {
    console.log('[SetupStorage] Verifying bucket:', bucketName);
    
    const supabase = getSupabase();
    
    // Try to list files in the bucket
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .list('', {
        limit: 1,
      });
    
    if (error) {
      console.error('[SetupStorage] Bucket verification failed:', error);
      return false;
    }
    
    console.log('[SetupStorage] Bucket verified successfully:', bucketName);
    return true;
  } catch (error: any) {
    console.error('[SetupStorage] Error verifying bucket:', error);
    return false;
  }
}

/**
 * Complete storage setup
 * Creates bucket and verifies it's accessible
 * 
 * @param {string} bucketName - Name of the bucket (default: 'menu-images')
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function setupStorage(bucketName: string = 'menu-images'): Promise<{success: boolean, message: string}> {
  try {
    console.log('[SetupStorage] Starting storage setup...');
    
    // Try to create bucket (may fail if no admin access)
    try {
      await createStorageBucket(bucketName);
    } catch (error: any) {
      console.warn('[SetupStorage] Could not create bucket automatically:', error.message);
      console.log('[SetupStorage] Please create the bucket manually via Supabase Dashboard');
    }
    
    // Verify bucket exists
    const verified = await verifyStorageBucket(bucketName);
    
    if (verified) {
      return {
        success: true,
        message: `Storage bucket "${bucketName}" is set up and accessible`,
      };
    } else {
      return {
        success: false,
        message: `Storage bucket "${bucketName}" does not exist or is not accessible. Please create it via Supabase Dashboard.`,
      };
    }
  } catch (error: any) {
    console.error('[SetupStorage] Setup failed:', error);
    return {
      success: false,
      message: `Storage setup failed: ${error.message}`,
    };
  }
}

