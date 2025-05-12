"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface FilterMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  maxDistance: number;
  categories: string[];
}

const CATEGORIES = [
  "Food",
  "Arts",
  "Music",
  "Tech",
  "Literature",
  "Sports",
  "Other",
];

const FilterMenu = ({ isOpen, onClose, onApplyFilters }: FilterMenuProps) => {
  const [maxDistance, setMaxDistance] = useState(5);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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
    onClose();
  };

  const handleReset = () => {
    setMaxDistance(5);
    setSelectedCategories([]);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[300px] sm:w-[400px] pl-4 rounded-l-xl">
        <SheetHeader>
          <SheetTitle>Filter Events</SheetTitle>
          <SheetDescription>
            Apply filters to find events that match your preferences.
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Distance Filter */}
          <div className="space-y-3">
            <Label className="font-medium">Maximum Distance</Label>
            <div className="space-y-1">
              <Slider
                value={[maxDistance]}
                onValueChange={values => setMaxDistance(values[0])}
                max={10}
                step={0.5}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>0 km</span>
                <span>{maxDistance} km</span>
                <span>10 km</span>
              </div>
            </div>
          </div>

          {/* Categories Filter */}
          <div className="space-y-3">
            <Label className="font-medium">Categories</Label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(category => (
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

        <SheetFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FilterMenu;
