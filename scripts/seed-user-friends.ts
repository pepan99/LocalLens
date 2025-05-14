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

  if (otherUsers.length < 10) {
    console.error("❌ Not enough users to create relationships");
    process.exit(1);
  }

  const shuffled = [...otherUsers].sort(() => 0.5 - Math.random());
  const [
    to1,
    to2,
    to3,
    from1,
    from2,
    friend1,
    friend2,
    friend3,
    friend4,
    friend5,
  ] = shuffled;

  await db.insert(friendRequests).values([
    { fromUserId: user.id, toUserId: to1.id, status: "pending" },
    { fromUserId: user.id, toUserId: to2.id, status: "pending" },
    { fromUserId: user.id, toUserId: to3.id, status: "pending" },
  ]);
  console.log(`➡️ Sent friend requests`);

  await db.insert(friendRequests).values([
    { fromUserId: from1.id, toUserId: user.id, status: "pending" },
    { fromUserId: from2.id, toUserId: user.id, status: "pending" },
  ]);
  console.log(`⬅️ Received friend requests`);

  await db.insert(friends).values([
    { userId: user.id, friendId: friend1.id },
    { userId: friend1.id, friendId: user.id },

    { userId: user.id, friendId: friend2.id },
    { userId: friend2.id, friendId: user.id },

    { userId: user.id, friendId: friend3.id },
    { userId: friend3.id, friendId: user.id },

    { userId: user.id, friendId: friend4.id },
    { userId: friend4.id, friendId: user.id },

    { userId: user.id, friendId: friend5.id },
    { userId: friend5.id, friendId: user.id },
  ]);
  console.log(`🤝 Created mutual friendships`);
};

main()
  .catch(err => {
    console.error("💥 Error:", err);
    process.exit(1);
  })
  .finally(() => {
    console.log("🎉 Friend seeding complete");
  });
