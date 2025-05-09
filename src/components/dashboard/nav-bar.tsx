"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Calendar,
  MapPin,
  Plus,
  Search,
  User,
  Users,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NavBar = () => {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 py-2 flex items-center justify-between z-20 sticky top-0">
      <div className="flex items-center gap-6">
        <Link href="/map" className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold">LocalLens</span>
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/explore"
            className={`flex items-center gap-1 px-3 py-2 rounded-md transition ${
              pathname.includes("explore")
                ? "bg-primary/10 text-primary"
                : "hover:bg-gray-100"
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>Explore</span>
          </Link>
          <Link
            href="/events"
            className={`flex items-center gap-1 px-3 py-2 rounded-md transition ${
              pathname.includes("/events")
                ? "bg-primary/10 text-primary"
                : "hover:bg-gray-100"
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Events</span>
          </Link>
          <Link
            href="/friends"
            className={`flex items-center gap-1 px-3 py-2 rounded-md transition ${
              pathname.includes("/friends")
                ? "bg-primary/10 text-primary"
                : "hover:bg-gray-100"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Friends</span>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <form onSubmit={handleSearch} className="relative hidden md:flex">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search events, places..."
            className="pl-8 w-64"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </form>

        <Button variant="outline" size="icon" asChild>
          <Link href="/notifications">
            <Bell className="h-5 w-5" />
          </Link>
        </Button>

        <Button variant="default" size="sm" className="gap-1" asChild>
          <Link href="/events/create">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create Event</span>
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default NavBar;
