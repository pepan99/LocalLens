"use client";

import { Badge } from "@/components/ui/badge";
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
import { ChevronDown, Filter, ListFilter } from "lucide-react";

type EventFiltersProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
};

const EventFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  setSortBy,
}: EventFiltersProps) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search events by title or location..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {selectedCategory || "All Categories"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSelectedCategory(null)}>
                All Categories
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedCategory("Technology")}
              >
                Technology
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategory("Food")}>
                Food & Drink
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategory("Arts")}>
                Arts & Culture
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategory("Sports")}>
                Sports & Fitness
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategory("Music")}>
                Music
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <ListFilter className="h-4 w-4" />
                Sort By
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort Events</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortBy("date-asc")}>
                Date (Ascending)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("date-desc")}>
                Date (Descending)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("rating")}>
                Highest Rated
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("popularity")}>
                Most Popular
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {selectedCategory && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Active filters:</span>
          <Badge variant="secondary" className="flex items-center gap-1">
            {selectedCategory}
            <button
              onClick={() => setSelectedCategory(null)}
              className="ml-1 hover:text-gray-900 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </Badge>
        </div>
      )}
    </div>
  );
};

export default EventFilters;
