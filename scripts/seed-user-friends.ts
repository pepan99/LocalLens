import { db } from "@/db";
import { friendRequests } from "@/db/schemas/friend-requests";
import { friends } from "@/db/schemas/friends";
import { users } from "@/db/schemas/users";
import { eq, or, SQLWrapper } from "drizzle-orm";

// CLI example: bun run .\scripts\seed-user-friends.ts --email=john.doe@gmail.com
const args = process.argv.slice(2).reduce(
  (acc, arg) => {
    const [key, val] = arg.replace(/^--/, "").split("=");
    acc[key] = val;
    return acc;
  },
  {} as Record<string, string>,
);

const email: string | null = args.email ?? null;
const id: string | null = args.id ?? null;
const name: string | null = args.name ?? null;

if (!email && !id && !name) {
  console.error("❌ Please provide --email (TODO support --id and --name) ");
  process.exit(1);
}

const main = async () => {
  console.log("🔍 Finding user...");

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .then(rows => rows[0]);

  if (!user) {
    console.error("❌ User not found with the given criteria");
    process.exit(1);
  }

  console.log(`✅ Found user: ${user.name} (${user.email})`);

  const allUsers = await db.select().from(users);
  const otherUsers = allUsers.filter(u => u.id !== user.id);

  if (otherUsers.length < 4) {
    console.error("❌ Not enough users to create relationships");
    process.exit(1);
  }

  const shuffled = [...otherUsers].sort(() => 0.5 - Math.random());
  const [to1, to2, from, friend] = shuffled;

  await db.insert(friendRequests).values([
    { fromUserId: user.id, toUserId: to1.id, status: "pending" },
    { fromUserId: user.id, toUserId: to2.id, status: "pending" },
  ]);
  console.log(`➡️ Sent friend requests to ${to1.name} and ${to2.name}`);

  await db.insert(friendRequests).values({
    fromUserId: from.id,
    toUserId: user.id,
    status: "pending",
  });
  console.log(`⬅️ Received friend request from ${from.name}`);

  await db.insert(friends).values([
    { userId: user.id, friendId: friend.id },
    { userId: friend.id, friendId: user.id },
  ]);
  console.log(`🤝 Created mutual friendship with ${friend.name}`);
};

main()
  .catch(err => {
    console.error("💥 Error:", err);
    process.exit(1);
  })
  .finally(() => {
    console.log("🎉 Friend seeding complete");
  });
