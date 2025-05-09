"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpDown,
  Calendar,
  ChevronDown,
  Clock,
  Filter,
  Heart,
  MapPin,
  Search,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock data for places
const MOCK_PLACES = [
  {
    id: "1",
    name: "Impact Hub Brno",
    category: "Coworking Space",
    address: "Cyrilská 7, 602 00 Brno, Czech Republic",
    coordinates: [49.1924, 16.6124],
    rating: 4.7,
    reviewCount: 28,
    image: "/placeholder-place-1.jpg",
    isFavorite: false,
    distance: 0.5,
    openingHours: "8:00 - 20:00",
    upcomingEvents: 2,
  },
  {
    id: "2",
    name: "Café Mitte",
    category: "Café",
    address: "Pekařská 23, 602 00 Brno, Czech Republic",
    coordinates: [49.1914, 16.6064],
    rating: 4.5,
    reviewCount: 42,
    image: "/placeholder-place-2.jpg",
    isFavorite: true,
    distance: 0.8,
    openingHours: "8:00 - 22:00",
    upcomingEvents: 1,
  },
  {
    id: "3",
    name: "The Immigrant",
    category: "Restaurant",
    address: "Veveří 57, 602 00 Brno, Czech Republic",
    coordinates: [49.202, 16.5974],
    rating: 4.8,
    reviewCount: 35,
    image: "/placeholder-place-3.jpg",
    isFavorite: false,
    distance: 1.2,
    openingHours: "11:00 - 23:00",
    upcomingEvents: 0,
  },
  {
    id: "4",
    name: "Industra Art",
    category: "Art Gallery",
    address: "Masná 9, 602 00 Brno, Czech Republic",
    coordinates: [49.1885, 16.6184],
    rating: 4.6,
    reviewCount: 19,
    image: "/placeholder-place-4.jpg",
    isFavorite: false,
    distance: 1.0,
    openingHours: "12:00 - 18:00",
    upcomingEvents: 3,
  },
  {
    id: "5",
    name: "Cabaret des Péchés",
    category: "Bar",
    address: "Jakubské náměstí 5, 602 00 Brno, Czech Republic",
    coordinates: [49.1965, 16.6094],
    rating: 4.4,
    reviewCount: 56,
    image: "/placeholder-place-5.jpg",
    isFavorite: true,
    distance: 0.3,
    openingHours: "18:00 - 02:00",
    upcomingEvents: 4,
  },
  {
    id: "6",
    name: "Moravian Gallery",
    category: "Museum",
    address: "Husova 18, 602 00 Brno, Czech Republic",
    coordinates: [49.1935, 16.6044],
    rating: 4.9,
    reviewCount: 47,
    image: "/placeholder-place-6.jpg",
    isFavorite: false,
    distance: 0.7,
    openingHours: "10:00 - 18:00",
    upcomingEvents: 2,
  },
];

// Available categories for filtering
const CATEGORIES = [
  "All Categories",
  "Restaurant",
  "Café",
  "Bar",
  "Coworking Space",
  "Museum",
  "Art Gallery",
  "Park",
  "Shopping",
  "Entertainment",
];

const PlacesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("distance");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [places, setPlaces] = useState(MOCK_PLACES);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showWithEventsOnly, setShowWithEventsOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

  // Filter places based on search query, category, and other filters
  const filteredPlaces = places.filter(place => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      place.category === selectedCategory;
    const matchesFavorites = !showFavoritesOnly || place.isFavorite;
    const matchesEvents = !showWithEventsOnly || place.upcomingEvents > 0;
    const matchesRating = place.rating >= minRating;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesFavorites &&
      matchesEvents &&
      matchesRating
    );
  });

  // Sort filtered places
  const sortedPlaces = [...filteredPlaces].sort((a, b) => {
    switch (sortBy) {
      case "distance":
        return a.distance - b.distance;
      case "rating-desc":
        return b.rating - a.rating;
      case "rating-asc":
        return a.rating - b.rating;
      case "reviews":
        return b.reviewCount - a.reviewCount;
      case "events":
        return b.upcomingEvents - a.upcomingEvents;
      default:
        return a.distance - b.distance;
    }
  });

  // Toggle favorite status for a place
  const toggleFavorite = (placeId: string) => {
    setPlaces(
      places.map(place =>
        place.id === placeId
          ? { ...place, isFavorite: !place.isFavorite }
          : place,
      ),
    );
  };

  // Reset filters to default values
  const resetFilters = () => {
    setSelectedCategory("All Categories");
    setShowFavoritesOnly(false);
    setShowWithEventsOnly(false);
    setMinRating(0);
    setIsFilterOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MapPin className="h-6 w-6" />
              Places
            </h1>
            <p className="text-gray-500 mt-1">
              Discover interesting places around you
            </p>
          </div>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search places by name or location..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    {selectedCategory}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {CATEGORIES.map(category => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    Sort By
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort Places</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortBy("distance")}>
                    Nearest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("rating-desc")}>
                    Highest Rated
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("rating-asc")}>
                    Lowest Rated
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("reviews")}>
                    Most Reviewed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("events")}>
                    Most Events
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" onClick={() => setIsFilterOpen(true)}>
                More Filters
              </Button>
            </div>
          </div>

          {(selectedCategory !== "All Categories" ||
            showFavoritesOnly ||
            showWithEventsOnly ||
            minRating > 0) && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500">Active filters:</span>

              {selectedCategory !== "All Categories" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Category: {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("All Categories")}
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
              )}

              {showFavoritesOnly && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Favorites Only
                  <button
                    onClick={() => setShowFavoritesOnly(false)}
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
              )}

              {showWithEventsOnly && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  With Events Only
                  <button
                    onClick={() => setShowWithEventsOnly(false)}
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
              )}

              {minRating > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Min Rating: {minRating}★
                  <button
                    onClick={() => setMinRating(0)}
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
              )}

              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Reset All
              </Button>
            </div>
          )}
        </div>

        <Tabs defaultValue="grid">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="map">Map View</TabsTrigger>
            </TabsList>
            <div className="text-sm text-gray-500">
              {sortedPlaces.length}{" "}
              {sortedPlaces.length === 1 ? "place" : "places"} found
            </div>
          </div>

          <TabsContent value="grid">
            {sortedPlaces.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No places found</h3>
                <p className="mt-1 text-gray-500">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedPlaces.map(place => (
                  <Card key={place.id} className="overflow-hidden">
                    <div className="relative h-40 bg-gray-200">
                      {place.image && (
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${place.image})` }}
                        />
                      )}
                      <button
                        className={`absolute top-2 right-2 p-1.5 rounded-full ${
                          place.isFavorite
                            ? "bg-primary text-white"
                            : "bg-white/80 text-gray-700"
                        }`}
                        onClick={() => toggleFavorite(place.id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${place.isFavorite ? "fill-white" : ""}`}
                        />
                      </button>
                      <div className="absolute bottom-2 left-2">
                        <Badge variant="secondary">{place.category}</Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/places/${place.id}`}
                          className="hover:underline"
                        >
                          <CardTitle className="text-lg">
                            {place.name}
                          </CardTitle>
                        </Link>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                          <span className="font-medium">{place.rating}</span>
                          <span className="text-gray-500 text-xs ml-1">
                            ({place.reviewCount})
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{place.address}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{place.openingHours}</span>
                        </div>
                        <span className="text-gray-500">
                          {place.distance} km away
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center bg-gray-50 px-4 py-3 border-t">
                      {place.upcomingEvents > 0 ? (
                        <Badge variant="outline" className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {place.upcomingEvents}{" "}
                          {place.upcomingEvents === 1 ? "event" : "events"}
                        </Badge>
                      ) : (
                        <span className="text-gray-500 text-sm">
                          No upcoming events
                        </span>
                      )}
                      <Button size="sm" asChild>
                        <Link href={`/places/${place.id}`}>View Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="map">
            <div className="rounded-lg overflow-hidden bg-gray-100 h-[500px] flex items-center justify-center">
              <p className="text-gray-500">
                Map view will be implemented using the react-leaflet component
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Filters Sheet */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Filter Places</SheetTitle>
            <SheetDescription>
              Narrow down places based on your preferences
            </SheetDescription>
          </SheetHeader>
          <div className="py-4 space-y-5">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.slice(1).map(category => (
                  <Badge
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="text-sm font-medium">Preferences</h3>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="favorites-only"
                  checked={showFavoritesOnly}
                  onChange={e => setShowFavoritesOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="favorites-only" className="ml-2 text-sm">
                  Show favorites only
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="events-only"
                  checked={showWithEventsOnly}
                  onChange={e => setShowWithEventsOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="events-only" className="ml-2 text-sm">
                  Places with events only
                </label>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="text-sm font-medium">Minimum Rating</h3>
              <div className="space-y-2">
                <div className="flex gap-2">
                  {[0, 3, 3.5, 4, 4.5].map(rating => (
                    <Button
                      key={rating}
                      variant={minRating === rating ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMinRating(rating)}
                    >
                      {rating > 0 ? `${rating}+` : "Any"}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            <div className="pt-4 flex gap-2">
              <Button className="flex-1" onClick={() => setIsFilterOpen(false)}>
                Apply Filters
              </Button>
              <Button variant="outline" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default PlacesPage;
