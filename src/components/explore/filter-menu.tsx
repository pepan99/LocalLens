"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { EVENT_CATEGORIES } from "../events/utils";

interface FilterMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  locationStatus?: {
    loading: boolean;
    error: string | null;
    available: boolean;
  };
}

export interface FilterOptions {
  maxDistance: number;
  categories: string[];
}

const FilterMenu = ({
  isOpen,
  onClose,
  onApplyFilters,
  locationStatus,
}: FilterMenuProps) => {
  const [maxDistance, setMaxDistance] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [open, setOpen] = useState(isOpen);

  // Sync with parent state
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      onClose();
    }
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category],
    );
  };

  const handleApply = () => {
    onApplyFilters({
      maxDistance,
      categories: selectedCategories,
    });
    handleOpenChange(false);
  };

  const handleReset = () => {
    setMaxDistance(0);
    setSelectedCategories([]);
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors">
          <Filter size={16} className="mr-1" />
          Filter
          <ChevronDown size={16} className="ml-1" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[280px] p-4" align="end">
        <DropdownMenuLabel className="font-bold text-base">
          Filter Events
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="py-4 space-y-6">
          {/* Distance Filter */}
          <div className="space-y-3">
            <Label className="font-medium">Maximum Distance</Label>
            {locationStatus && (
              <div className="mb-2">
                {locationStatus.available ? (
                  <div className="text-xs text-green-600 flex items-center">
                    <span className="mr-1">✓</span>
                    Location available
                  </div>
                ) : locationStatus.loading ? (
                  <div className="text-xs text-yellow-600 flex items-center">
                    <span className="mr-1 animate-spin">◌</span>
                    Getting your location...
                  </div>
                ) : locationStatus.error ? (
                  <div className="text-xs text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    Location access required for distance filtering
                  </div>
                ) : (
                  <div className="text-xs text-yellow-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    Waiting for location data
                  </div>
                )}
              </div>
            )}
            <div className="space-y-1">
              <Slider
                value={[maxDistance]}
                onValueChange={values => setMaxDistance(values[0])}
                max={200}
                step={0.5}
                disabled={locationStatus && !locationStatus.available}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>0 km</span>
                <span>{maxDistance} km</span>
                <span>200 km</span>
              </div>
              {locationStatus && !locationStatus.available && (
                <div className="text-xs text-gray-500 mt-1 italic">
                  All events will be shown until location is available
                </div>
              )}
            </div>
          </div>

          {/* Categories Filter */}
          <div className="space-y-3">
            <Label className="font-medium">Categories</Label>
            <div className="grid grid-cols-2 gap-2">
              {EVENT_CATEGORIES.map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <label
                    htmlFor={`category-${category}`}
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-2 gap-2">
          <Button variant="outline" onClick={handleReset} size="sm">
            Reset
          </Button>
          <Button onClick={handleApply} size="sm">
            Apply Filters
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterMenu;
