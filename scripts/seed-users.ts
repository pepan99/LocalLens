import { randomUUID } from "crypto";
import { db } from "@/db";
import { userLocation } from "@/db/schemas/user-locations";
import { users } from "@/db/schemas/users";
import { faker } from "@faker-js/faker";

// Brno base coordinates
const BRNO_LAT = 49.1951;
const BRNO_LON = 16.6068;

// Optional: list of Brno districts
const brnoDistricts = [
  "Brno-střed",
  "Žabovřesky",
  "Královo Pole",
  "Komín",
  "Líšeň",
  "Bystrc",
  "Bohunice",
  "Černovice",
  "Židenice",
  "Slatina",
];

// Helper to generate a unique email
const generateUniqueEmail = (generatedEmails: Set<string>) => {
  let email;
  do {
    email = faker.internet.email();
  } while (generatedEmails.has(email)); // Keep generating until a unique email is found

  generatedEmails.add(email); // Add the new email to the set
  return email;
};

// Generate users around Brno
async function seedUsers() {
  // Fetch existing emails from the database
  const existingEmailsResult = await db
    .select({ email: users.email })
    .from(users);

  // Filter out any null emails and map to a set of strings
  const existingEmailSet = new Set(
    existingEmailsResult
      .filter((x: { email: string | null }) => x.email !== null)
      .map(x => x.email!),
  );

  // Now, create a set that starts with existing emails
  const generatedEmails = new Set<string>(existingEmailSet);

  const fakeUsers = Array.from({ length: 30 }).map(() => {
    const lat = BRNO_LAT + faker.number.float({ min: -0.02, max: 0.02 });
    const lon = BRNO_LON + faker.number.float({ min: -0.02, max: 0.02 });

    return {
      id: randomUUID(),
      name: faker.person.fullName(),
      username: faker.internet.username(),
      email: generateUniqueEmail(generatedEmails),
      emailVerified: new Date(),
      image: faker.image.avatar(),
      imageUrl: faker.image.url(),
      location: faker.helpers.arrayElement(brnoDistricts),
      isOnline: true,
      lastActive: new Date(),
      isSharingLocation: true,
      coordinates: `${lat},${lon}`,
    };
  });

  // Insert users into users table
  await db.insert(users).values(fakeUsers);

  // Insert corresponding locations into user_location table
  const userLocationData = fakeUsers.map(user => ({
    userId: user.id,
    latitude: BRNO_LAT + faker.number.float({ min: -0.02, max: 0.02 }),
    longitude: BRNO_LON + faker.number.float({ min: -0.02, max: 0.02 }),
    updatedAt: new Date().toISOString(),
  }));

  // Insert locations into user_location table
  await db.insert(userLocation).values(userLocationData);
}

// Main seed runner
async function main() {
  await seedUsers();
}

main().catch(err => {
  console.error("❌ Seed failed:", err);
});

// Export for use in other scripts
export { seedUsers };
