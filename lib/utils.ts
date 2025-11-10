/**
 * Utility Functions
 * 
 * Common utility functions used throughout the application
 * 
 * @module lib/utils
 */

/**
 * Get user initials from name
 * 
 * @param {string} name - User's full name
 * @returns {string} User's initials (e.g., "John Doe" -> "JD")
 */
export function getUserInitials(name: string | undefined | null): string {
  if (!name) return "GU"; // Guest User
  
  const parts = name.trim().split(/\s+/);
  
  if (parts.length === 0) return "GU";
  
  if (parts.length === 1) {
    // Single name - use first two letters
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  // Multiple names - use first letter of first and last name
  const firstInitial = parts[0].charAt(0).toUpperCase();
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
  
  return `${firstInitial}${lastInitial}`;
}

/**
 * Get a color for avatar based on user name
 * 
 * @param {string} name - User's name
 * @returns {string} Hex color code
 */
export function getAvatarColor(name: string | undefined | null): string {
  if (!name) return "#FE8C00"; // Default orange
  
  // Generate a consistent color based on name
  const colors = [
    "#FE8C00", // Orange
    "#EF4444", // Red
    "#3B82F6", // Blue
    "#10B981", // Green
    "#8B5CF6", // Purple
    "#F59E0B", // Amber
    "#EC4899", // Pink
    "#06B6D4", // Cyan
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

