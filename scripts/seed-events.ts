import { randomUUID } from "crypto";
import { db } from "@/db";
import { events, LocationSourceTypes } from "@/db/schemas/events";
import { places } from "@/db/schemas/places";
import { users } from "@/db/schemas/users";
import { faker } from "@faker-js/faker";

// Brno base coordinates
const BRNO_LAT = 49.1951;
const BRNO_LON = 16.6068;

async function seedEvents() {
  // Get existing places from DB
  const existingPlaces = await db.select().from(places);

  const existingUsers = await db.select({ email: users.id }).from(users);

  const userIds = existingUsers.map(x => x.email);

  const totalEvents = 30;
  const eventsWithPlaces = faker.number.int({ min: 5, max: 10 });

  const fakeEvents = Array.from({ length: totalEvents }).map((_, index) => {
    const isUsingPlace = index < eventsWithPlaces && existingPlaces.length > 0;

    if (isUsingPlace) {
      const selectedPlace = faker.helpers.arrayElement(existingPlaces);
      return {
        id: randomUUID(),
        creatorId: faker.helpers.arrayElement(userIds),
        title: faker.lorem.words(3),
        time: faker.date.future().toISOString(),
        date: new Date(),
        location: selectedPlace.name || faker.location.streetAddress(),
        locationSource: LocationSourceTypes.PLACE,
        placeId: selectedPlace.id,
        description: faker.lorem.sentences(2),
        category: faker.helpers.arrayElement(["Music", "Tech", "Food", "Art"]),
        capacity: faker.number.int({ min: 10, max: 100 }),
        latitude: Number(selectedPlace.latitude),
        longitude: Number(selectedPlace.longitude),
        isPrivate: false,
        imageUrl: faker.image.url(),
      };
    }

    const lat = BRNO_LAT + faker.number.float({ min: -0.02, max: 0.02 });
    const lon = BRNO_LON + faker.number.float({ min: -0.02, max: 0.02 });

    return {
      id: randomUUID(),
      creatorId: faker.helpers.arrayElement(userIds),
      title: faker.lorem.words(3),
      time: faker.date.future().toISOString(),
      date: new Date(),
      location: faker.location.streetAddress({ useFullAddress: false }),
      locationSource: LocationSourceTypes.CUSTOM,
      placeId: null,
      description: faker.lorem.sentences(2),
      category: faker.helpers.arrayElement(["Music", "Tech", "Food", "Art"]),
      capacity: faker.number.int({ min: 10, max: 100 }),
      latitude: lat,
      longitude: lon,
      isPrivate: false,
      imageUrl: faker.image.url(),
    };
  });

  await db.insert(events).values(fakeEvents);
}

// Main seed runner
async function main() {
  await seedEvents();
}

main().catch(err => {
  console.error("❌ Seed failed:", err);
});

// Export for use in other scripts
export { seedEvents };
