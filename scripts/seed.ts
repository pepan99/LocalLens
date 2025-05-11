import { randomUUID } from "crypto";
import { db } from "@/db";
import { eventAttendance } from "@/db/schemas/event-attendance";
import { events } from "@/db/schemas/events";
import {
  accounts,
  authenticators,
  sessions,
  users,
  verificationTokens,
} from "@/db/schemas/users";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";

/**
 * LocalLens Seed Script
 *
 * This script populates the database with mock data for:
 * - Users
 * - Auth-related tables (accounts, sessions, etc.)
 * - Events
 * - Event attendance records
 */

//
// Initialize the database connection using Bun's SQLite
// Update the path to your SQLite database file if different

// Create a separate seed.json file for tracking seed status

const main = async () => {
  // Check for --force flag

  console.log("🌱 Starting database seeding...");

  // Optional: Run migrations to ensure the database is up-to-date
  // await migrate(db, { migrationsFolder: "./drizzle" });

  // Use transaction for better performance and atomicity
  await db.transaction(async tx => {
    // Clear existing data (comment if not needed)
    await clearExistingData(tx);
    // 1. Insert mock users
    console.log("Creating users...");
    const createdUsers = await createUsers(tx);

    // 2. Create mock auth data
    console.log("Creating auth-related data...");
    await createAuthData(tx, createdUsers);

    // 3. Create mock events
    console.log("Creating events...");
    const createdEvents = await createEvents(tx, createdUsers);

    // 4. Create mock event attendance records
    console.log("Creating event attendance records...");
    await createEventAttendance(tx, createdUsers, createdEvents);
  });

  // Mark as seeded

  console.log("✅ Seeding completed successfully!");
};

const clearExistingData = async tx => {
  // Delete in reverse order of dependencies
  console.log("Clearing existing data...");

  await tx.delete(eventAttendance);
  await tx.delete(events);
  await tx.delete(authenticators);
  await tx.delete(sessions);
  await tx.delete(verificationTokens);
  await tx.delete(accounts);
  await tx.delete(users);

  console.log("Existing data cleared");
};

const createUsers = async tx => {
  const mockUsers = [
    {
      id: randomUUID(),
      name: "Alice Johnson",
      email: "alice@example.com",
      emailVerified: new Date(),
      image: "https://randomuser.me/api/portraits/women/12.jpg",
    },
    {
      id: randomUUID(),
      name: "Bob Smith",
      email: "bob@example.com",
      emailVerified: new Date(),
      image: "https://randomuser.me/api/portraits/men/15.jpg",
    },
    {
      id: randomUUID(),
      name: "Charlie Garcia",
      email: "charlie@example.com",
      emailVerified: new Date(),
      image: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    {
      id: randomUUID(),
      name: "Diana Lee",
      email: "diana@example.com",
      emailVerified: new Date(),
      image: "https://randomuser.me/api/portraits/women/32.jpg",
    },
    {
      id: randomUUID(),
      name: "Ethan Williams",
      email: "ethan@example.com",
      emailVerified: new Date(),
      image: "https://randomuser.me/api/portraits/men/42.jpg",
    },
    {
      id: randomUUID(),
      name: "Fiona Chen",
      email: "fiona@example.com",
      emailVerified: new Date(),
      image: "https://randomuser.me/api/portraits/women/52.jpg",
    },
    {
      id: randomUUID(),
      name: "George Patel",
      email: "george@example.com",
      emailVerified: new Date(),
      image: "https://randomuser.me/api/portraits/men/62.jpg",
    },
    {
      id: randomUUID(),
      name: "Hannah Kim",
      email: "hannah@example.com",
      emailVerified: new Date(),
      image: "https://randomuser.me/api/portraits/women/72.jpg",
    },
  ];

  // Insert users with Drizzle batch insert
  await tx.insert(users).values(mockUsers);

  console.log(`${mockUsers.length} users created`);
  return mockUsers;
};

const createAuthData = async (tx, mockUsers) => {
  // Prepare batch arrays for each table
  const accountsData = [];
  const sessionsData = [];
  const verificationTokensData = [];
  const authenticatorsData = [];

  // Create accounts for each user
  for (const user of mockUsers) {
    // Google account
    accountsData.push({
      userId: user.id,
      type: "oauth",
      provider: "google",
      providerAccountId: `google_${Math.random().toString(36).substring(2, 15)}`,
      access_token: `access_${Math.random().toString(36).substring(2, 15)}`,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: "Bearer",
      scope: "openid profile email",
      id_token: `id_token_${Math.random().toString(36).substring(2, 15)}`,
    });

    // Create session for each user
    sessionsData.push({
      sessionToken: `session_${Math.random().toString(36).substring(2, 15)}`,
      userId: user.id,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
    });

    // Add a verification token for some users (not all)
    if (Math.random() > 0.7) {
      verificationTokensData.push({
        identifier: user.email,
        token: `token_${Math.random().toString(36).substring(2, 15)}`,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours from now
      });
    }

    // Add authenticator for some users (simulating webauthn)
    if (Math.random() > 0.5) {
      authenticatorsData.push({
        credentialID: `cred_${Math.random().toString(36).substring(2, 15)}`,
        userId: user.id,
        providerAccountId: `provider_${Math.random().toString(36).substring(2, 15)}`,
        credentialPublicKey: `key_${Math.random().toString(36).substring(2, 30)}`,
        counter: Math.floor(Math.random() * 100),
        credentialDeviceType:
          Math.random() > 0.5 ? "platform" : "cross-platform",
        credentialBackedUp: Math.random() > 0.7 ? 1 : 0,
        transports: Math.random() > 0.5 ? "usb,ble,nfc" : "internal",
      });
    }
  }

  // Batch insert all data
  if (accountsData.length > 0) {
    await tx.insert(accounts).values(accountsData);
  }

  if (sessionsData.length > 0) {
    await tx.insert(sessions).values(sessionsData);
  }

  if (verificationTokensData.length > 0) {
    await tx.insert(verificationTokens).values(verificationTokensData);
  }

  if (authenticatorsData.length > 0) {
    await tx.insert(authenticators).values(authenticatorsData);
  }

  console.log("Auth data created for users");
};

const createEvents = async (tx, mockUsers) => {
  // Event categories
  const categories = [
    "Social",
    "Community",
    "Arts",
    "Sports",
    "Education",
    "Technology",
    "Food",
    "Music",
    "Networking",
    "Health",
  ];

  // Event locations - using real Brno locations
  const locations = [
    {
      name: "Špilberk Castle",
      lat: 49.1944,
      lng: 16.6,
    },
    {
      name: "Freedom Square (Náměstí Svobody)",
      lat: 49.1951,
      lng: 16.6068,
    },
    {
      name: "Brno Exhibition Centre (Brněnské výstaviště)",
      lat: 49.1869,
      lng: 16.5778,
    },
    {
      name: "Lužánky Park",
      lat: 49.2077,
      lng: 16.6064,
    },
    {
      name: "Moravian Gallery in Brno",
      lat: 49.1971,
      lng: 16.6078,
    },
    {
      name: "Cathedral of St. Peter and Paul",
      lat: 49.1911,
      lng: 16.6078,
    },
    {
      name: "Brno Lake (Brněnská přehrada)",
      lat: 49.2356,
      lng: 16.5139,
    },
    {
      name: "Masaryk University",
      lat: 49.2099,
      lng: 16.5989,
    },
    {
      name: "Mendel Museum",
      lat: 49.1901,
      lng: 16.5992,
    },
    {
      name: "Brno Observatory and Planetarium",
      lat: 49.2047,
      lng: 16.5839,
    },
    {
      name: "VIDA! Science Centre",
      lat: 49.1855,
      lng: 16.5789,
    },
    {
      name: "Old Town Hall",
      lat: 49.1943,
      lng: 16.6082,
    },
    {
      name: "Cabbage Market (Zelný trh)",
      lat: 49.193,
      lng: 16.6074,
    },
    {
      name: "Villa Tugendhat",
      lat: 49.2071,
      lng: 16.6161,
    },
    {
      name: "Denis Gardens",
      lat: 49.1906,
      lng: 16.6068,
    },
  ];

  // Generate random times for events
  const generateRandomTime = () => {
    const hours = Math.floor(Math.random() * 12) + 1;
    const minutes = Math.random() > 0.5 ? "00" : "30";
    const period = Math.random() > 0.5 ? "AM" : "PM";
    return `${hours}:${minutes} ${period}`;
  };

  // Generate random future date in the next 30 days
  const generateRandomFutureDate = () => {
    const now = new Date();
    const futureDate = new Date(
      now.getTime() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
    );
    return futureDate;
  };

  // Create 20 mock events
  const mockEvents = [];

  const eventDescriptions = [
    "Join us for a fun gathering in Brno where we'll connect with like-minded people. Bring your enthusiasm and be ready to make new friends!",
    "An exciting opportunity to learn and grow with experts in the field right here in Brno. This event is designed for both beginners and advanced participants.",
    "Experience the beauty of collaboration and creativity in the heart of Brno. This is an inclusive space for all to share ideas and develop new skills.",
    "Dive deep into discussions about the future of our Brno community. Your voice matters, and we want to hear your thoughts!",
    "A casual meetup in Brno focused on networking and relationship building. Great for professionals looking to expand their connections.",
    "Celebrate local Moravian culture with this special event highlighting traditional and contemporary expressions of our shared heritage.",
    "An interactive workshop in Brno that will challenge your perceptions and help you develop new perspectives on important topics.",
    "Get active and enjoy the outdoors in beautiful Brno with this community-focused event that combines exercise with social connection.",
    "A fundraising event supporting local Brno initiatives. Your participation makes a direct impact on our community's well-being.",
    "Explore innovative ideas and cutting-edge developments in technology and science at this Brno event. Perfect for the curious mind!",
  ];

  for (let i = 0; i < 20; i++) {
    const randomLocation =
      locations[Math.floor(Math.random() * locations.length)];
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const randomCreator =
      mockUsers[Math.floor(Math.random() * mockUsers.length)];
    const randomDescription =
      eventDescriptions[Math.floor(Math.random() * eventDescriptions.length)];

    const eventDate = generateRandomFutureDate();

    const event = {
      id: randomUUID(),
      creatorId: randomCreator.id,
      title: `${randomCategory} Event: ${i + 1}`,
      time: generateRandomTime(),
      date: eventDate, // Actual Date object, not timestamp
      location: randomLocation.name,
      description: randomDescription,
      category: randomCategory,
      capacity: Math.floor(Math.random() * 50) + 10, // 10-60 capacity
      latitude: randomLocation.lat,
      longitude: randomLocation.lng,
      isPrivate: Math.random() > 0.8 ? 1 : 0, // 20% are private events
      imageUrl: `https://picsum.photos/seed/${i}/800/600`, // Random images
      createdAt: new Date(
        Date.now() - 1000 * 60 * 60 * 24 * Math.floor(Math.random() * 10),
      ), // Created 0-10 days ago
      updatedAt: new Date(),
    };

    mockEvents.push(event);
  }

  // Batch insert all events
  await tx.insert(events).values(mockEvents);

  console.log(`${mockEvents.length} events created`);
  return mockEvents;
};

const createEventAttendance = async (tx, mockUsers, mockEvents) => {
  // Status options
  const statusOptions = ["going", "interested", "not_going"];

  // Create attendance records
  const attendanceRecords = [];

  // Each user attends some events
  for (const user of mockUsers) {
    // Each user attends 1-5 random events
    const attendCount = Math.floor(Math.random() * 5) + 1;
    const attendingEvents = [...mockEvents]
      .sort(() => 0.5 - Math.random())
      .slice(0, attendCount);

    for (const event of attendingEvents) {
      // Don't let users attend their own events with 'not_going'
      const isCreator = event.creatorId === user.id;
      const status = isCreator
        ? "going"
        : statusOptions[Math.floor(Math.random() * statusOptions.length)];

      const record = {
        eventId: event.id,
        userId: user.id,
        status,
        guests: status === "going" ? Math.floor(Math.random() * 3) : 0, // 0-2 guests if going
        note:
          Math.random() > 0.7
            ? `Looking forward to ${event.title.split(":")[0].toLowerCase()} events!`
            : null,
      };

      attendanceRecords.push(record);
    }
  }

  // Batch insert all attendance records
  if (attendanceRecords.length > 0) {
    await tx.insert(eventAttendance).values(attendanceRecords);
  }

  console.log(`${attendanceRecords.length} attendance records created`);
  return attendanceRecords;
};

// Execute the seeding process
main()
  .catch(e => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Seeding script completed");
    // Bun SQLite doesn't require explicit closing
    process.exit(0);
  });
