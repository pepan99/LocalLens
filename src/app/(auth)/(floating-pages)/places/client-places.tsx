"use client";

import { PlacesFilters } from "@/components/places/places-filters";
import { PlacesList } from "@/components/places/places-list";
import { PlacesSearchBar } from "@/components/places/places-search-bar";
import { searchPlaces } from "@/modules/places";
import { PlaceCategoryType, PlaceType } from "@/modules/places/types/places";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ClientPlacesProps = {
  initialPlaces: PlaceType[];
  categories: PlaceCategoryType[];
  initialSearch: string;
  initialCategory: string;
  initialSort: string;
};

const ClientPlaces = ({
  initialPlaces,
  categories,
  initialSearch,
  initialCategory,
  initialSort,
}: ClientPlacesProps) => {
  const [places, setPlaces] = useState<PlaceType[]>(initialPlaces);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSort);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Handle search query changes and fetch results
  useEffect(() => {
    // Skip search if empty or matches initial search on first render
    if (
      searchQuery === "" &&
      initialSearch === "" &&
      initialPlaces.length > 0
    ) {
      return;
    }

    // Debounce search to avoid too many requests
    const timer = setTimeout(async () => {
      // Only perform a new search if the query is not empty
      if (searchQuery.trim()) {
        setIsLoading(true);
        try {
          const results = await searchPlaces(searchQuery);
          setPlaces(results);
        } catch (error) {
          console.error("Error searching places:", error);
          // toast({
          //   title: "Error",
          //   description: "Failed to search places",
          //   variant: "destructive",
          // });
        } finally {
          setIsLoading(false);
        }
      } else if (searchQuery === "" && initialSearch !== "") {
        // Reset to initial places if search is cleared
        setPlaces(initialPlaces);
      }
    }, 500); // Longer debounce time to reduce requests

    return () => clearTimeout(timer);
  }, [searchQuery, initialPlaces, initialSearch]);

  // Handle URL updates when parameters change - combined to avoid multiple refreshes
  useEffect(() => {
    // Don't update URL if values match initial props
    if (
      searchQuery === initialSearch &&
      selectedCategory === initialCategory &&
      sortBy === initialSort
    ) {
      return;
    }

    // Update URL parameters
    const params = new URLSearchParams();

    if (searchQuery) {
      params.set("search", searchQuery);
    }

    if (selectedCategory !== "All Categories") {
      params.set("category", selectedCategory);
    }

    if (sortBy !== "distance") {
      params.set("sort", sortBy);
    }

    // Replace state to avoid browser navigation history entries
    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.replace(`/places${newUrl}`, { scroll: false });
  }, [
    searchQuery,
    selectedCategory,
    sortBy,
    initialSearch,
    initialCategory,
    initialSort,
    router,
  ]);

  // Filter places based on category
  const filteredPlaces = places.filter(place => {
    return (
      selectedCategory === "All Categories" ||
      place.category === selectedCategory
    );
  });

  // Sort filtered places
  const sortedPlaces = [...filteredPlaces].sort((a, b) => {
    switch (sortBy) {
      case "distance":
        return (a.distance || 0) - (b.distance || 0);
      case "rating-desc":
        return (b.rating || 0) - (a.rating || 0);
      case "rating-asc":
        return (a.rating || 0) - (b.rating || 0);
      case "reviews":
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      case "events":
        return (b.upcomingEvents || 0) - (a.upcomingEvents || 0);
      default:
        return (a.distance || 0) - (b.distance || 0);
    }
  });

  // Create an array of category options including "All Categories"
  const categoryOptions = [
    "All Categories",
    ...categories.map(category => category.name),
  ];

  return (
    <>
      <div className="flex gap-4 space-y-4">
        <div className="flex flex-col flex-1 md:flex-row gap-4">
          <PlacesSearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        <PlacesFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onSortChange={setSortBy}
          categories={categoryOptions}
        />
      </div>

      {isLoading ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">Loading places...</p>
        </div>
      ) : sortedPlaces.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">
            No places found. Try a different search or category.
          </p>
        </div>
      ) : (
        <PlacesList places={sortedPlaces} />
      )}
    </>
  );
};

export default ClientPlaces;
