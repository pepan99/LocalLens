import { randomUUID } from "crypto";
import { db } from "@/db";
import { events, LocationSourceTypes } from "@/db/schemas/events";
import { places } from "@/db/schemas/places";
import { users } from "@/db/schemas/users";
import { faker } from "@faker-js/faker";

// Brno base coordinates
const BRNO_LAT = 49.1951;
const BRNO_LON = 16.6068;

const eventTitles = [
  // Music Event Titles
  "Summer Beats Festival",
  "Indie Music Night",
  "Jazz in the Park",
  "Live Electronic Showcase",
  "Acoustic Sunset Concert",
  "Rock on the River",
  "Classical Nights",

  // Tech Event Titles
  "AI Innovators Summit",
  "Future of Tech Expo",
  "Code & Coffee Meetup",
  "Blockchain Breakthroughs",
  "Tech Talks: The Future",
  "Tech Hackathon",
  "Virtual Reality Immersion",

  // Food Event Titles
  "Brno Food Festival",
  "Tasting Night at the Market",
  "Vegan Food Adventure",
  "BBQ & Beats",
  "Gourmet Cooking Class",
  "Cultural Food Tour",
  "Street Food Night",

  // Art Event Titles
  "Art Walk in the City",
  "Modern Art Exhibition",
  "Creative Minds Meetup",
  "Sculpture Garden Showcase",
  "Photography & Painting Workshop",
  "Urban Art Festival",
  "Exhibition Opening: Abstract Vision",
];

const imageUrls = [
  "https://picsum.photos/400/300?random=1", // Nature/Scenery
  "https://picsum.photos/400/300?random=2", // Nature/Scenery
  "https://picsum.photos/400/300?random=3", // Nature/Scenery
  "https://source.unsplash.com/400x300/?architecture", // Architecture/Cityscape
  "https://source.unsplash.com/400x300/?food", // Food
  "https://source.unsplash.com/400x300/?technology", // Technology
  "https://source.unsplash.com/400x300/?music", // Music
  "https://source.unsplash.com/400x300/?art", // Art
  "https://source.unsplash.com/400x300/?abstract", // Abstract
  "https://source.unsplash.com/400x300/?sports", // Sports
];

const eventDescriptions = [
  "Join us for an exciting evening of music and dance. Don’t miss out on the fun!",
  "A day filled with creative workshops and hands-on experiences. Perfect for art lovers!",
  "Get ready for an inspiring talk from industry leaders. Don’t miss this tech event!",
  "Come enjoy delicious food and meet new people in a cozy atmosphere.",
  "Explore the latest in cutting-edge technology at this exclusive event.",
  "Get your groove on at our live music show. A night to remember!",
  "A weekend of delicious food and drink tastings. Perfect for foodies!",
  "Get creative at this fun art workshop. All levels welcome!",
  "Connect with like-minded individuals at our networking event.",
  "Join us for a day of fun and excitement at the sports extravaganza!",
  "Explore innovative solutions at this tech showcase. A must-see for all tech enthusiasts.",
  "Relax and unwind at this wellness retreat. Take care of your mind and body.",
  "Enjoy a night of theater and performance in an intimate setting.",
  "Dive into the world of digital art at our latest exhibition. See the future of creativity.",
  "An afternoon of local art, food, and live music. Bring your friends and family!",
  "A community event to support local businesses and artisans. Shop and explore!",
  "Join us for a weekend of outdoor adventure, from hiking to extreme sports.",
  "A family-friendly event featuring games, music, and fun activities for all ages.",
  "Celebrate the power of innovation at our annual tech conference.",
  "Join us for an art gallery tour and enjoy an evening of visual storytelling.",
];

async function seedEvents() {
  // Get existing places from DB
  const existingPlaces = await db.select().from(places);

  const existingUsers = await db.select({ email: users.id }).from(users);

  const userIds = existingUsers.map(x => x.email);

  const totalEvents = 30;
  const eventsWithPlaces = faker.number.int({ min: 5, max: 10 });

  const fakeEvents = Array.from({ length: totalEvents }).map((_, index) => {
    const isUsingPlace = index < eventsWithPlaces && existingPlaces.length > 0;

    const eventTitle = faker.helpers.arrayElement(eventTitles);

    // Randomly select an image URL from the array
    const randomImageUrl =
      imageUrls[Math.floor(Math.random() * imageUrls.length)];

    // Randomly select an event description
    const randomEventDescription =
      eventDescriptions[Math.floor(Math.random() * eventDescriptions.length)];

    if (isUsingPlace) {
      const selectedPlace = faker.helpers.arrayElement(existingPlaces);
      return {
        id: randomUUID(),
        creatorId: faker.helpers.arrayElement(userIds),
        title: eventTitle,
        time: faker.date.future().toISOString(),
        date: new Date(),
        location: selectedPlace.name || faker.location.streetAddress(),
        locationSource: LocationSourceTypes.PLACE,
        placeId: selectedPlace.id,
        description: randomEventDescription,
        category: faker.helpers.arrayElement(["Music", "Tech", "Food", "Art"]),
        capacity: faker.number.int({ min: 10, max: 100 }),
        latitude: Number(selectedPlace.latitude),
        longitude: Number(selectedPlace.longitude),
        isPrivate: false,
        imageUrl: randomImageUrl,
      };
    }

    const lat = BRNO_LAT + faker.number.float({ min: -0.02, max: 0.02 });
    const lon = BRNO_LON + faker.number.float({ min: -0.02, max: 0.02 });

    return {
      id: randomUUID(),
      creatorId: faker.helpers.arrayElement(userIds),
      title: eventTitle,
      time: faker.date.future().toISOString(),
      date: new Date(),
      location: faker.location.streetAddress({ useFullAddress: false }),
      locationSource: LocationSourceTypes.CUSTOM,
      placeId: null,
      description: randomEventDescription,
      category: faker.helpers.arrayElement(["Music", "Tech", "Food", "Art"]),
      capacity: faker.number.int({ min: 10, max: 100 }),
      latitude: lat,
      longitude: lon,
      isPrivate: false,
      imageUrl: randomImageUrl,
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
