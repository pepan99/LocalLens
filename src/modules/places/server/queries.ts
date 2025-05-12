import { auth } from "@/auth";
import { db } from "@/db";
import {
  amenities,
  openingHours,
  placeAmenities,
  placeCategories,
  places,
} from "@/db/schemas/places";
import { reviews } from "@/db/schemas/reviews";
import { avg, count, desc, eq, gt, sql } from "drizzle-orm";
import {
  AmenityType,
  OpeningHoursType,
  PlaceCategoryType,
  PlaceType,
  PlaceWithReviews,
  ReviewType,
} from "../types/places";

/**
 * Map database place result to PlaceType
 */
export const mapPlaceToPlaceType = async (
  placeData: typeof places.$inferSelect,
  includeDetails: boolean = false,
): Promise<PlaceType> => {
  // Calculate average rating and count
  const [ratingResult] = await db
    .select({
      average: avg(reviews.rating).mapWith(Number).as("average"),
      count: count().as("count"),
    })
    .from(reviews)
    .where(eq(reviews.placeId, placeData.id));

  let openingHoursData: OpeningHoursType[] = [];
  let amenitiesData: string[] = [];

  if (includeDetails) {
    // Get opening hours
    const hoursResult = await db
      .select()
      .from(openingHours)
      .where(eq(openingHours.placeId, placeData.id));

    openingHoursData = hoursResult.map(hour => ({
      day: hour.day,
      hours: hour.hours,
    }));

    // Get amenities
    const amenitiesResult = await db
      .select({ name: amenities.name })
      .from(amenities)
      .innerJoin(placeAmenities, eq(placeAmenities.amenityId, amenities.id))
      .where(eq(placeAmenities.placeId, placeData.id));

    amenitiesData = amenitiesResult.map(a => a.name);
  }

  return {
    id: placeData.id,
    name: placeData.name,
    address: placeData.address,
    description: placeData.description,
    website: placeData.website,
    phone: placeData.phone,
    rating: ratingResult.average,
    reviewCount: ratingResult.count || 0,
    openingHours: includeDetails ? openingHoursData : undefined,
    amenities: includeDetails ? amenitiesData : undefined,
    image: "/placeholder-place-1.jpg", // Default image
    createdAt: new Date(placeData.createdAt),
    updatedAt: new Date(placeData.updatedAt),
  };
};

/**
 * Map database review result to ReviewType
 */
export const mapReviewToReviewType = (
  reviewData: typeof reviews.$inferSelect,
): ReviewType => {
  return {
    id: reviewData.id,
    userId: reviewData.userId,
    placeId: reviewData.placeId,
    rating: reviewData.rating,
    comment: reviewData.comment,
    createdAt: new Date(reviewData.createdAt),
    updatedAt: new Date(reviewData.updatedAt),
  };
};

/**
 * Get all places
 */
export const getPlaces = async (
  limit: number = 20,
  page: number = 1,
): Promise<PlaceType[]> => {
  try {
    const placesData = await db
      .select()
      .from(places)
      .limit(limit)
      .offset((page - 1) * limit);

    const result: PlaceType[] = [];
    for (const place of placesData) {
      result.push(await mapPlaceToPlaceType(place));
    }

    return result;
  } catch (error) {
    console.error("Error fetching places:", error);
    return [];
  }
};

/**
 * Get place by ID
 */
export const getPlaceById = async (
  placeId: string,
): Promise<PlaceType | null> => {
  try {
    const result = await db
      .select()
      .from(places)
      .where(eq(places.id, placeId))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return mapPlaceToPlaceType(result[0], true);
  } catch (error) {
    console.error("Error fetching place:", error);
    return null;
  }
};

/**
 * Get place with reviews
 */
export const getPlaceWithReviews = async (
  placeId: string,
): Promise<PlaceWithReviews | null> => {
  try {
    const placeResult = await getPlaceById(placeId);

    if (!placeResult) {
      return null;
    }

    const reviewsResult = await db
      .select()
      .from(reviews)
      .where(eq(reviews.placeId, placeId))
      .orderBy(desc(reviews.createdAt));

    const mappedReviews = reviewsResult.map(mapReviewToReviewType);

    return {
      ...placeResult,
      reviews: mappedReviews,
    };
  } catch (error) {
    console.error("Error fetching place with reviews:", error);
    return null;
  }
};

/**
 * Search places by name, address or description
 */
export const searchPlaces = async (
  searchTerm: string,
  limit: number = 20,
): Promise<PlaceType[]> => {
  try {
    const searchPattern = `%${searchTerm}%`;

    const results = await db
      .select()
      .from(places)
      .where(
        sql`(
          ${places.name} LIKE ${searchPattern} OR
          ${places.address} LIKE ${searchPattern} OR
          ${places.description} LIKE ${searchPattern}
        )`,
      )
      .limit(limit);

    const mappedResults: PlaceType[] = [];
    for (const place of results) {
      mappedResults.push(await mapPlaceToPlaceType(place));
    }

    return mappedResults;
  } catch (error) {
    console.error("Error searching places:", error);
    return [];
  }
};

/**
 * Get all reviews for a place
 */
export const getPlaceReviews = async (
  placeId: string,
  limit: number = 20,
  page: number = 1,
): Promise<ReviewType[]> => {
  try {
    const results = await db
      .select()
      .from(reviews)
      .where(eq(reviews.placeId, placeId))
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    return results.map(mapReviewToReviewType);
  } catch (error) {
    console.error("Error fetching place reviews:", error);
    return [];
  }
};

/**
 * Get a specific review by ID
 */
export const getReviewById = async (
  reviewId: string,
): Promise<ReviewType | null> => {
  try {
    const [result] = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, reviewId))
      .limit(1);

    if (!result) {
      return null;
    }

    return mapReviewToReviewType(result);
  } catch (error) {
    console.error("Error fetching review:", error);
    return null;
  }
};

/**
 * Get user's reviews
 */
export const getUserReviews = async (
  limit: number = 20,
  page: number = 1,
): Promise<ReviewType[]> => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return [];
    }

    const userId = session.user.id;

    const results = await db
      .select()
      .from(reviews)
      .where(eq(reviews.userId, userId))
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    return results.map(mapReviewToReviewType);
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return [];
  }
};

/**
 * Get all place categories
 */
export const getPlaceCategories = async (): Promise<PlaceCategoryType[]> => {
  try {
    const results = await db.select().from(placeCategories);

    return results.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
    }));
  } catch (error) {
    console.error("Error fetching place categories:", error);
    return [];
  }
};

/**
 * Get top rated places
 */
export const getTopRatedPlaces = async (
  limit: number = 10,
): Promise<PlaceType[]> => {
  try {
    // Get average ratings for places
    const placeRatings = await db
      .select({
        placeId: reviews.placeId,
        avgRating: avg(reviews.rating).mapWith(Number).as("avgRating"),
        reviewCount: count().as("reviewCount"),
      })
      .from(reviews)
      .groupBy(reviews.placeId)
      .having(({ avgRating }) => gt(avgRating, 4.0))
      .orderBy(desc(sql`avgRating`))
      .limit(limit);

    if (placeRatings.length === 0) {
      return [];
    }

    // Get place details for the top rated places
    const placeIds = placeRatings.map(r => r.placeId);
    const placeResults = await db
      .select()
      .from(places)
      .where(sql`id IN (${placeIds.join(",")})`);

    // Map places to PlaceType and add rating information
    const mappedPlaces: PlaceType[] = [];
    for (const place of placeResults) {
      const placeRating = placeRatings.find(r => r.placeId === place.id);
      const mappedPlace = await mapPlaceToPlaceType(place);

      if (placeRating) {
        mappedPlace.rating = Number(placeRating.avgRating);
        mappedPlace.reviewCount = Number(placeRating.reviewCount);
      }

      mappedPlaces.push(mappedPlace);
    }

    // Sort by rating
    return mappedPlaces.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } catch (error) {
    console.error("Error fetching top rated places:", error);
    return [];
  }
};

/**
 * Get all amenities
 */
export const getAllAmenities = async (): Promise<AmenityType[]> => {
  try {
    const results = await db.select().from(amenities);

    return results.map(amenity => ({
      id: amenity.id,
      name: amenity.name,
    }));
  } catch (error) {
    console.error("Error fetching amenities:", error);
    return [];
  }
};
