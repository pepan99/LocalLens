import { randomUUID } from "crypto";
import { db } from "@/db";
import { places } from "@/db/schemas/places";
import { reviews } from "@/db/schemas/reviews";
import { users } from "@/db/schemas/users";
import { faker } from "@faker-js/faker";

// Load existing users and places

// Function to create a UUID
const uuid = () => randomUUID();

async function seedReviews() {
  const allUsers = await db.select({ id: users.id }).from(users);
  const allPlaces = await db.select({ id: places.id }).from(places);

  if (allUsers.length === 0 || allPlaces.length === 0) {
    throw new Error("❌ No users or places found in the database.");
  }

  // Review texts grouped by rating
  const reviewTexts: Record<number, string[]> = {
    1: [
      "Really disappointed with the experience.",
      "Would not recommend. Needs serious improvement.",
      "Poor service and uncomfortable environment.",
      "Overpriced and not worth it.",
      "Terrible. I won’t be coming back.",
    ],
    2: [
      "Not great. Needs some work.",
      "Mediocre experience, unfortunately.",
      "Could be better with some improvements.",
      "Service was slow and the place was a bit dirty.",
      "Had higher expectations.",
    ],
    3: [
      "It was okay, nothing special.",
      "Average experience overall.",
      "Neutral feelings, neither great nor terrible.",
      "Decent, but not memorable.",
      "Fine for a quick visit.",
    ],
    4: [
      "Really nice place, would visit again.",
      "Enjoyed it a lot. Clean and friendly staff.",
      "Good vibes and well-maintained.",
      "Pleasant experience, worth a try.",
      "Solid spot. Met my expectations.",
    ],
    5: [
      "Absolutely loved it! Highly recommend.",
      "Fantastic service and great atmosphere!",
      "One of the best places I've been to.",
      "Exceptional! Will definitely come back.",
      "Top notch experience from start to finish.",
    ],
  };

  // Helper to create a review
  const createReview = (userId: string, placeId: string, rating: number) => {
    const commentOptions = reviewTexts[rating];
    const comment = faker.helpers.arrayElement(commentOptions);
    return {
      id: uuid(),
      userId,
      placeId,
      rating,
      comment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  // Prevent duplicate user-place combinations
  const existingReviews = new Set<string>();
  const allReviews = [];

  for (const place of allPlaces) {
    const numberOfReviews = faker.number.int({ min: 2, max: 5 });

    const selectedUsers = faker.helpers
      .shuffle(allUsers)
      .slice(0, numberOfReviews);

    for (const user of selectedUsers) {
      const reviewKey = `${user.id}-${place.id}`;
      if (existingReviews.has(reviewKey)) continue;

      existingReviews.add(reviewKey);

      const rating = faker.number.int({ min: 1, max: 5 });

      allReviews.push(createReview(user.id, place.id, rating));
    }
  }

  // Insert reviews into DB
  await db.insert(reviews).values(allReviews);
}

// Execute if this script is run directly
if (require.main === module) {
  seedReviews()
    .then(() => {
      console.log("Seeding completed successfully");
      process.exit(0);
    })
    .catch(error => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}

// Export for use in other scripts
export { seedReviews };
