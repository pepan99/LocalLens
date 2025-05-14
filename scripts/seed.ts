// Central seeding script

import { seedEvents } from "./seed-events";
import { seedPlaces } from "./seed-places";
import { seedReviews } from "./seed-reviews";
import { seedUsers } from "./seed-users";

async function main() {
  try {
    console.log("🌱 Starting database seed...");

    await seedPlaces();
    console.log("✅ Places seeded.");

    await seedUsers();
    console.log("✅ Users seeded.");

    await seedEvents();
    console.log("✅ Events seeded.");

    await seedReviews();
    console.log("✅ Reviews seeded.");

    console.log("🎉 All seed tasks completed successfully.");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

main();
