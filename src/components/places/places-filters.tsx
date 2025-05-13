import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, ChevronDown, Filter } from "lucide-react";

// Default categories as fallback
const DEFAULT_CATEGORIES = [
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

type PlacesFiltersProps = {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
  categories?: string[];
};

export const PlacesFilters = ({
  selectedCategory,
  onCategoryChange,
  onSortChange,
  categories = DEFAULT_CATEGORIES,
}: PlacesFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
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
          {categories.map(category => (
            <DropdownMenuItem
              key={category}
              onClick={() => onCategoryChange(category)}
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
          <DropdownMenuItem onClick={() => onSortChange("distance")}>
            Nearest First
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("rating-desc")}>
            Highest Rated
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("rating-asc")}>
            Lowest Rated
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("reviews")}>
            Most Reviewed
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("events")}>
            Most Events
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
