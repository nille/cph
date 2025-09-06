// Emoji mappings for different place categories and tags
// Priority order matters - first match wins

export interface EmojiMapping {
  keywords: string[];
  emoji: string;
  label: string;
}

export const EMOJI_MAPPINGS: EmojiMapping[] = [
  // Food & Drink (highest priority)
  { keywords: ['cafe', 'coffee'], emoji: '☕', label: 'Cafe' },
  { keywords: ['restaurant', 'brunch', 'lunch', 'dinner'], emoji: '🍽️', label: 'Restaurant' },
  { keywords: ['pizza'], emoji: '🍕', label: 'Pizza' },
  { keywords: ['bar', 'wine', 'beer'], emoji: '🍺', label: 'Bar' },
  { keywords: ['food market', 'market'], emoji: '🏪', label: 'Market' },
  
  // Culture & Education
  { keywords: ['museum', 'gallery', 'art'], emoji: '🏛️', label: 'Museum' },
  { keywords: ['bookstore', 'books'], emoji: '📚', label: 'Bookstore' },
  
  // Shopping
  { keywords: ['shopping', 'shop', 'clothing', 'sneakers'], emoji: '🛍️', label: 'Shopping' },
  { keywords: ['second hand', 'thrift', 'vintage'], emoji: '♻️', label: 'Thrift Store' },
  { keywords: ['design', 'ceramics', 'home goods'], emoji: '🎨', label: 'Design Store' },
  
  // Nature & Outdoors
  { keywords: ['beach', 'swimming'], emoji: '🏖️', label: 'Beach' },
  { keywords: ['park', 'botanical garden', 'nature'], emoji: '🌳', label: 'Park' },
  
  // Areas & Locations
  { keywords: ['neighborhood', 'area'], emoji: '🏘️', label: 'Neighborhood' },
  { keywords: ['street', 'pedestrian'], emoji: '🛣️', label: 'Street' },
  { keywords: ['square'], emoji: '🏛️', label: 'Square' },
  
  // Special
  { keywords: ['parking'], emoji: '🅿️', label: 'Parking' },
  { keywords: ['nørrebro', 'local', 'home'], emoji: '🏠', label: 'Home' },
  
  // Fallback
  { keywords: ['location'], emoji: '📍', label: 'Location' },
];

// Function to determine emoji based on tags
export function getEmojiFromTags(tags: string[] = [], type?: string): { emoji: string; label: string } {
  // Create a combined search array with type first, then tags
  const searchTerms = [type, ...tags].filter(Boolean).map(term => term?.toLowerCase());
  
  // Find the first mapping that matches any of the search terms (exact match)
  for (const mapping of EMOJI_MAPPINGS) {
    for (const searchTerm of searchTerms) {
      if (mapping.keywords.some(keyword => searchTerm === keyword)) {
        return { emoji: mapping.emoji, label: mapping.label };
      }
    }
  }
  
  // Ultimate fallback
  return { emoji: '📍', label: 'Location' };
}

// Legacy mapping for backward compatibility
export const LEGACY_TYPE_MAPPING: Record<string, string> = {
  'cafe': '☕',
  'restaurant': '🍽️',
  'bar': '🍺',
  'museum': '🏛️',
  'shop': '🛍️',
  'market': '🏪',
  'area': '📍',
  'beach': '🏖️',
  'park': '🌳',
  'parking': '🅿️',
  'location': '🏠'
};