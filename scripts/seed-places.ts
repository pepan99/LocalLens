import { randomUUID, UUID } from "crypto";
import { db } from "@/db";
import {
  amenities,
  openingHours,
  placeAmenities,
  placeCategories,
  placeCategoryRelations,
  places,
} from "@/db/schemas/places";
import { and, eq } from "drizzle-orm";

// Function to create a UUID
const uuid = () => randomUUID();

async function seedPlaces() {
  try {
    // SEED CATEGORIES
    const CATEGORIES = [
      {
        id: uuid(),
        name: "Coworking Space",
        description:
          "Shared working spaces for professionals, freelancers, and remote workers",
      },
      {
        id: uuid(),
        name: "Park",
        description: "Public green spaces for recreation and leisure",
      },
      {
        id: uuid(),
        name: "Museum",
        description:
          "Institutions preserving and displaying cultural, artistic, historical, or scientific artifacts",
      },
      {
        id: uuid(),
        name: "Castle",
        description:
          "Historic fortified structures with cultural and historical significance",
      },
      {
        id: uuid(),
        name: "University",
        description:
          "Higher education institutions offering academic degrees and research opportunities",
      },
      {
        id: uuid(),
        name: "Transport",
        description:
          "Facilities and infrastructure for public or private transportation",
      },
      {
        id: uuid(),
        name: "Cultural",
        description:
          "Venues and spaces dedicated to arts, music, and cultural activities",
      },
      {
        id: uuid(),
        name: "Exhibition",
        description:
          "Venues for displaying art, products, or informational content to the public",
      },
      {
        id: uuid(),
        name: "Architecture",
        description:
          "Noteworthy buildings and structures with significant design or historical importance",
      },
      {
        id: uuid(),
        name: "Square",
        description:
          "Public open spaces in urban areas, often serving as gathering spots",
      },
      {
        id: uuid(),
        name: "Historical",
        description: "Places with significant historical value or heritage",
      },
      {
        id: uuid(),
        name: "Entertainment",
        description: "Venues offering leisure activities and entertainment",
      },
    ];

    // Create a map for easy lookup of category IDs by name
    const categoryMap = new Map(
      CATEGORIES.map(category => [category.name, category.id]),
    );

    // Insert categories one by one to avoid unique constraint errors
    for (const category of CATEGORIES) {
      try {
        // Check if category already exists
        const existingCategory = await db
          .select({ id: placeCategories.id })
          .from(placeCategories)
          .where(eq(placeCategories.name, category.name));

        if (existingCategory.length === 0) {
          await db.insert(placeCategories).values(category);
        } else {
          // Update our map with the existing ID
          categoryMap.set(category.name, existingCategory[0].id as UUID);
        }
      } catch (error) {
        if (error instanceof Error)
          console.log(
            `Error with category ${category.name}, skipping: ${error.message}`,
          );
      }
    }

    // SEED AMENITIES
    const AMENITIES = [
      { id: uuid(), name: "WiFi" },
      { id: uuid(), name: "Parking" },
      { id: uuid(), name: "Restrooms" },
      { id: uuid(), name: "Café" },
      { id: uuid(), name: "Restaurant" },
      { id: uuid(), name: "Accessible" },
      { id: uuid(), name: "Meeting Rooms" },
      { id: uuid(), name: "Events Space" },
      { id: uuid(), name: "Gift Shop" },
      { id: uuid(), name: "Garden" },
      { id: uuid(), name: "Playground" },
      { id: uuid(), name: "Tours" },
      { id: uuid(), name: "Information Desk" },
      { id: uuid(), name: "Study Area" },
      { id: uuid(), name: "Exhibition Space" },
      { id: uuid(), name: "Library" },
    ];

    // Create a map for easy lookup of amenity IDs by name
    const amenityMap = new Map(
      AMENITIES.map(amenity => [amenity.name, amenity.id]),
    );

    // Insert amenities one by one
    for (const amenity of AMENITIES) {
      try {
        // Check if amenity already exists
        const existingAmenity = await db
          .select({ id: amenities.id })
          .from(amenities)
          .where(eq(amenities.name, amenity.name));

        if (existingAmenity.length === 0) {
          await db.insert(amenities).values(amenity);
        } else {
          // Update our map with the existing ID
          amenityMap.set(amenity.name, existingAmenity[0].id as UUID);
        }
      } catch (error) {
        if (error instanceof Error)
          console.log(
            `Error with amenity ${amenity.name}, skipping: ${error.message}`,
          );
      }
    }

    // Define opening hours templates
    const weekdayHours = [
      { day: "Monday", hours: "09:00 - 18:00" },
      { day: "Tuesday", hours: "09:00 - 18:00" },
      { day: "Wednesday", hours: "09:00 - 18:00" },
      { day: "Thursday", hours: "09:00 - 18:00" },
      { day: "Friday", hours: "09:00 - 18:00" },
      { day: "Saturday", hours: "10:00 - 16:00" },
      { day: "Sunday", hours: "Closed" },
    ];

    const extendedHours = [
      { day: "Monday", hours: "08:00 - 20:00" },
      { day: "Tuesday", hours: "08:00 - 20:00" },
      { day: "Wednesday", hours: "08:00 - 20:00" },
      { day: "Thursday", hours: "08:00 - 20:00" },
      { day: "Friday", hours: "08:00 - 20:00" },
      { day: "Saturday", hours: "09:00 - 18:00" },
      { day: "Sunday", hours: "09:00 - 18:00" },
    ];

    const parkHours = [
      { day: "Monday", hours: "06:00 - 22:00" },
      { day: "Tuesday", hours: "06:00 - 22:00" },
      { day: "Wednesday", hours: "06:00 - 22:00" },
      { day: "Thursday", hours: "06:00 - 22:00" },
      { day: "Friday", hours: "06:00 - 22:00" },
      { day: "Saturday", hours: "06:00 - 22:00" },
      { day: "Sunday", hours: "06:00 - 22:00" },
    ];

    const trainStationHours = [
      { day: "Monday", hours: "00:00 - 24:00" },
      { day: "Tuesday", hours: "00:00 - 24:00" },
      { day: "Wednesday", hours: "00:00 - 24:00" },
      { day: "Thursday", hours: "00:00 - 24:00" },
      { day: "Friday", hours: "00:00 - 24:00" },
      { day: "Saturday", hours: "00:00 - 24:00" },
      { day: "Sunday", hours: "00:00 - 24:00" },
    ];

    // Define place data
    const PLACES = [
      {
        id: uuid(),
        name: "Impact Hub Brno",
        address: "Cyrilská 7, 602 00 Brno, Czech Republic",
        description:
          "Impact Hub Brno is a coworking space and innovation lab that offers a unique ecosystem of resources, inspiration, and collaboration opportunities to help start and scale initiatives that address societal challenges.",
        website: "https://www.hubbrno.cz",
        phone: "+420 734 641 914",
        categories: ["Coworking Space", "Cultural", "Entertainment"],
        amenities: [
          "WiFi",
          "Meeting Rooms",
          "Café",
          "Events Space",
          "Accessible",
        ],
        hours: extendedHours,
        latitude: "49.19",
        longitude: "16.61",
        image:
          "https://www.hubbrno.cz/wp-content/uploads/2021/04/Impact-Hub-Brno.jpg",
      },
      {
        id: uuid(),
        name: "Freedom Square",
        address: "náměstí Svobody, 602 00 Brno, Czech Republic",
        description:
          "Freedom Square (náměstí Svobody) is the main square in Brno and a popular meeting point. It features the iconic astronomical clock and hosts various markets and events throughout the year.",
        website: "https://www.gotobrno.cz/en/place/freedom-square/",
        phone: null,
        categories: ["Square", "Historical", "Cultural"],
        amenities: ["Restrooms", "Accessible", "Information Desk"],
        hours: parkHours,
        latitude: "49.1953",
        longitude: "16.6083",
        image:
          "https://www.gotobrno.cz/wp-content/uploads/2017/05/07-No%C4%8Dn%C3%AD-%C5%BEivot-v-ulici%C3%ADch-HD-1.jpg",
      },
      {
        id: uuid(),
        name: "Moravian Gallery",
        address: "Husova 18, 662 26 Brno, Czech Republic",
        description:
          "The Moravian Gallery in Brno is the second largest art museum in the Czech Republic, boasting a rich collection of modern and historic art across multiple buildings including the Pražák Palace, the Museum of Applied Arts, and the Governor's Palace.",
        website: "https://www.moravska-galerie.cz/en/",
        phone: "+420 532 169 111",
        categories: ["Museum", "Cultural", "Exhibition"],
        amenities: [
          "Gift Shop",
          "Restrooms",
          "Café",
          "Exhibition Space",
          "Accessible",
        ],
        hours: weekdayHours,
        latitude: "49.1976",
        longitude: "16.6075",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/5/51/M%C3%ADstodr%C5%BEitelsk%C3%BD_pal%C3%A1c_MG.jpg",
      },
      {
        id: uuid(),
        name: "Lužánky Park",
        address: "Lidická 50, 602 00 Brno, Czech Republic",
        description:
          "Lužánky is the oldest public park in the Czech Republic, established in 1786. This expansive green space offers sports facilities, playgrounds, and a cultural center, making it a popular recreational area for locals and visitors alike.",
        website: "https://www.lesymb.cz/luzanky.html?id=31",
        phone: "+420 545 211 113",
        categories: ["Park", "Entertainment", "Cultural"],
        amenities: ["Playground", "Restrooms", "Café", "Garden", "Accessible"],
        hours: parkHours,
        latitude: "49.2097",
        longitude: "16.6158",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/0/0c/Brno-Lu%C5%BE%C3%A1nky_XIV.jpg",
      },
      {
        id: uuid(),
        name: "Music Lab Brno",
        address: "Opletalova 6, 602 00 Brno, Czech Republic",
        description:
          "Music Lab is a creative space for musicians and music enthusiasts in Brno. It offers rehearsal rooms, recording studios, and hosts various music workshops and events throughout the year.",
        website: "https://musiclab.cz/",
        phone: "+420 777 904 290",
        categories: ["Cultural", "Entertainment"],
        amenities: ["WiFi", "Restrooms", "Events Space"],
        hours: extendedHours,
        latitude: "49.1943",
        longitude: "16.6009",
        image: "https://musiclab.cz/wp-content/uploads/2020/11/Layer-5.jpg",
      },
      {
        id: uuid(),
        name: "Brno University of Technology",
        address: "Antonínská 548/1, 601 90 Brno, Czech Republic",
        description:
          "Brno University of Technology (VUT) is the oldest technical university in the Czech Republic, founded in 1899. It offers programs in engineering, technology, economics, and the arts, and is known for its research and innovation.",
        website: "https://www.vut.cz/en/",
        phone: "+420 541 141 111",
        categories: ["University", "Cultural", "Historical"],
        amenities: [
          "WiFi",
          "Restrooms",
          "Study Area",
          "Café",
          "Library",
          "Accessible",
        ],
        hours: weekdayHours,
        latitude: "49.2246",
        longitude: "16.5752",
        image: "https://msmstudy.eu/wp-content/uploads/2021/06/Sloj-12-3.jpg",
      },
      {
        id: uuid(),
        name: "Špilberk Castle",
        address: "Špilberk 1, 662 24 Brno, Czech Republic",
        description:
          "Špilberk Castle is a medieval fortress built in the 13th century on a hilltop in Brno. Once a royal castle, then a fortress and notorious prison, it now serves as a museum with exhibits on Brno history and offers panoramic views of the city.",
        website: "https://www.spilberk.cz/en/",
        phone: "+420 542 123 611",
        categories: ["Castle", "Museum", "Historical", "Architecture"],
        amenities: [
          "Tours",
          "Gift Shop",
          "Café",
          "Restrooms",
          "Exhibition Space",
          "Accessible",
        ],
        hours: extendedHours,
        latitude: "49.1947",
        longitude: "16.6006",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/3/3c/%C5%A0pilberk_%2802%29.jpg",
      },
      {
        id: uuid(),
        name: "Villa Tugendhat",
        address: "Černopolní 45, 613 00 Brno, Czech Republic",
        description:
          "Villa Tugendhat is a UNESCO World Heritage site and a masterpiece of architectural functionalism. Designed by architect Ludwig Mies van der Rohe, this iconic modernist building from 1930 is known for its innovative use of space, materials, and technology.",
        website: "https://www.tugendhat.eu/en/",
        phone: "+420 515 511 015",
        categories: ["Architecture", "Museum", "Historical"],
        amenities: [
          "Tours",
          "Gift Shop",
          "Restrooms",
          "Garden",
          "Information Desk",
        ],
        hours: weekdayHours,
        latitude: "49.2134",
        longitude: "16.6158",
        image:
          "https://www.tugendhat.eu/wp-content/uploads/2022/03/tugendhat_photo_david_zidlicky_intro_CF017094.jpg",
      },
      {
        id: uuid(),
        name: "Brno Exhibition Centre",
        address: "Výstaviště 405/1, 603 00 Brno, Czech Republic",
        description:
          "The Brno Exhibition Centre is one of the largest exhibition venues in Europe, hosting international trade fairs, conferences, and cultural events. Its functionalist architecture from the 1920s is a significant part of Brno's modern heritage.",
        website: "https://www.bvv.cz/en/",
        phone: "+420 541 151 111",
        categories: ["Exhibition", "Architecture", "Cultural"],
        amenities: [
          "Parking",
          "Restrooms",
          "Restaurant",
          "Exhibition Space",
          "Information Desk",
          "Accessible",
        ],
        hours: weekdayHours,
        latitude: "49.1887",
        longitude: "16.5804",
        image:
          "https://www.gotobrno.cz/wp-content/uploads/2017/06/vystaviste-obecna-2.jpg",
      },
      {
        id: uuid(),
        name: "Brno Train Station",
        address: "Nádražní 1, 602 00 Brno, Czech Republic",
        description:
          "Brno's main railway station is a major transportation hub for the South Moravian Region. While the current station building dates to the 1960s, the station has been a vital part of the city's infrastructure since the 19th century.",
        website: "https://www.cd.cz/en//",
        phone: "+420 840 112 113",
        categories: ["Transport", "Historical"],
        amenities: [
          "WiFi",
          "Restrooms",
          "Café",
          "Restaurant",
          "Information Desk",
          "Accessible",
        ],
        hours: trainStationHours,
        latitude: "49.1905",
        longitude: "16.6128",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/b/b8/Pr%C5%AF%C4%8Del%C3%AD_hlavn%C3%ADho_n%C3%A1dra%C5%BE%C3%AD_v_Brn%C4%9B.jpg",
      },
    ];

    // Note: You would need to ensure that the variables uuid, extendedHours, parkHours,
    // weekdayHours, and trainStationHours are defined elsewhere in your code.
    // For example, using a library like 'uuid':
    // import { v4 as uuid } from 'uuid';
    // And defining the hour variables appropriately.
    // Note: You would need to ensure that the variables uuid, extendedHours, parkHours,
    // weekdayHours, and trainStationHours are defined elsewhere in your code.
    // For example, using a library like 'uuid':
    // import { v4 as uuid } from 'uuid';
    // And defining the hour variables appropriately.
    // Insert places into the database

    // SEED PLACES
    for (const place of PLACES) {
      let placeId = place.id.toString();

      // Insert or get existing place
      const existingPlace = await db
        .select({ id: places.id })
        .from(places)
        .where(eq(places.name, place.name))
        .limit(1);

      if (existingPlace.length > 0) {
        placeId = existingPlace[0].id;
      } else {
        await db.insert(places).values(place);
      }

      // Insert place-category relationships
      for (const categoryName of place.categories) {
        const categoryId = categoryMap.get(categoryName);
        if (!categoryId) continue;

        const exists = await db
          .select()
          .from(placeCategoryRelations)
          .where(
            and(
              eq(placeCategoryRelations.placeId, placeId),
              eq(placeCategoryRelations.categoryId, categoryId),
            ),
          )
          .limit(1);

        if (exists.length === 0) {
          await db.insert(placeCategoryRelations).values({
            placeId,
            categoryId,
          });
        }
      }

      // Insert place-amenity relationships
      for (const amenityName of place.amenities) {
        const amenityId = amenityMap.get(amenityName);
        if (!amenityId) continue;

        const exists = await db
          .select()
          .from(placeAmenities)
          .where(
            and(
              eq(placeAmenities.placeId, placeId),
              eq(placeAmenities.amenityId, amenityId),
            ),
          )
          .limit(1);

        if (exists.length === 0) {
          await db.insert(placeAmenities).values({
            placeId,
            amenityId,
          });
        }
      }

      // Insert opening hours
      for (const hour of place.hours) {
        const exists = await db
          .select()
          .from(openingHours)
          .where(
            and(
              eq(openingHours.placeId, placeId),
              eq(openingHours.day, hour.day),
            ),
          )
          .limit(1);

        if (exists.length === 0) {
          await db.insert(openingHours).values({
            id: uuid(),
            placeId,
            day: hour.day,
            hours: hour.hours,
          });
        }
      }
    }
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
}

// Execute if this script is run directly
if (require.main === module) {
  seedPlaces()
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
export { seedPlaces };
