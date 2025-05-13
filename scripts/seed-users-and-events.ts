import { randomUUID } from "crypto";
import { db } from "@/db";
import { users } from "@/db/schemas/users";
import { faker } from "@faker-js/faker";
import { events } from "../migrations/schema";

// Generate 20 users
async function seedUsers() {
  const fakeUsers = Array.from({ length: 20 }).map(() => {
    return {
      id: randomUUID(),
      name: faker.person.fullName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      emailVerified: new Date(),
      image: faker.image.avatar(),
      imageUrl: faker.image.url(),
      location: faker.location.city(),
      isOnline: false,
      lastActive: new Date(),
      isSharingLocation: false,
      coordinates: `${faker.location.latitude()},${faker.location.longitude()}`,
    };
  });

  await db.insert(users).values(fakeUsers);

  console.log("✅ 20 users created");
  return fakeUsers.map(user => user.id); // return IDs for event creator
}

// Generate 10 events around Brno
async function seedEvents(userIds: string[]) {
  const brnoLat = 49.1951;
  const brnoLon = 16.6068;

  const fakeEvents = Array.from({ length: 10 }).map(() => {
    const lat = brnoLat + faker.number.float({ min: -0.02, max: 0.02 });
    const lon = brnoLon + faker.number.float({ min: -0.02, max: 0.02 });

    return {
      id: randomUUID(),
      creatorId: faker.helpers.arrayElement(userIds),
      title: faker.lorem.words(3),
      time: faker.date.future().toISOString(),
      date: Math.floor(Date.now() / 1000),
      location: faker.location.streetAddress(),
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

  console.log("✅ 10 events created");
}

async function main() {
  const userIds = await seedUsers();
  await seedEvents(userIds);
}

main().catch(err => {
  console.error("❌ Seed failed:", err);
});
