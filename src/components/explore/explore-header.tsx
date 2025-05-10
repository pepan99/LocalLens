"use client";

import { ChevronDown, Filter } from "lucide-react";

interface ExploreHeaderProps {
  onFilterClick: () => void;
}

const ExploreHeader = ({ onFilterClick }: ExploreHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800">
        Events Near You
      </h2>
      <button
        className="flex items-center text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors"
        onClick={onFilterClick}
      >
        <Filter size={16} className="mr-1" />
        Filter
        <ChevronDown size={16} className="ml-1" />
      </button>
    </div>
  );
};

export default ExploreHeader;
