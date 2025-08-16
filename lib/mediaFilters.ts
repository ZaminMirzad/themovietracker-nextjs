// Utility functions for filtering media items

// Minimal shapes for common media attributes used in filters
type WithPoster = { poster_path?: string | null };
type WithBackdrop = { backdrop_path?: string | null };
type WithProfile = { profile_path?: string | null };
type WithLogo = { logo_path?: string | null };

/**
 * Filters media items to only include those with valid image paths
 * @param items Array of media items to filter
 * @param imagePathKey Which image path to check (defaults to 'poster_path')
 * @returns Filtered array with only items that have the specified image path
 */
export function filterMediaWithImages<T extends Record<string, unknown>>(
  items: T[],
  imagePathKey = 'poster_path'
): T[] {
  return items.filter((item) => {
    const value = (item as Record<string, unknown>)[imagePathKey];
    return Boolean(value);
  });
}

/**
 * Filters media items to only include those with valid poster or backdrop paths
 * @param items Array of media items to filter
 * @returns Filtered array with items that have either poster_path or backdrop_path
 */
export function filterMediaWithAnyImage<T extends WithPoster & WithBackdrop>(items: T[]): T[] {
  return items.filter((item) => Boolean(item.poster_path || item.backdrop_path));
}

/**
 * Filters cast/crew members to only include those with profile images
 * @param members Array of cast/crew members
 * @returns Filtered array with only members that have profile_path
 */
export function filterCastWithProfileImages<T extends WithProfile>(members: T[]): T[] {
  return members.filter((member) => Boolean(member.profile_path));
}

/**
 * Filters production companies to only include those with logos
 * @param companies Array of production companies
 * @returns Filtered array with only companies that have logo_path
 */
export function filterCompaniesWithLogos<T extends WithLogo>(companies: T[]): T[] {
  return companies.filter((company) => Boolean(company.logo_path));
}

/**
 * Combines filtering and slicing for related media display
 * @param items Array of media items
 * @param maxItems Maximum number of items to return (optional)
 * @returns Filtered and optionally limited array
 */
export function filterAndLimitMedia<T extends WithPoster>(items: T[], maxItems?: number): T[] {
  const filtered = items.filter((item) => item && item.poster_path);
  return maxItems ? filtered.slice(0, maxItems) : filtered;
}
