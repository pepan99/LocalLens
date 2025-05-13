// Place Type
export type PlaceType = {
  id: string;
  name: string;
  address: string;
  description: string | null;
  website: string | null;
  phone: string | null;
  category?: string; // Primary category (first in list)
  categories?: string[]; // All categories
  latitude: string | null;
  longitude: string | null;
  rating?: number | null;
  reviewCount?: number;
  distance?: number;
  openingHours?: OpeningHoursType[];
  amenities?: string[];
  upcomingEvents?: number;
  isFavorite?: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
};

// PlaceCategory Type
export type PlaceCategoryType = {
  id: string;
  name: string;
  description: string | null;
};

// OpeningHours Type
export type OpeningHoursType = {
  day: string;
  hours: string;
};

// Review Type
export type ReviewType = {
  id: string;
  userId: string;
  username?: string;
  placeId: string;
  rating: number;
  comment: string | null;
  likes?: number;
  dislikes?: number;
  createdAt: Date;
  updatedAt: Date;
};

// Amenity Type
export type AmenityType = {
  id: string;
  name: string;
};

// Place with associated reviews
export type PlaceWithReviews = PlaceType & {
  reviews: ReviewType[];
};
