"use client";

import { FilterTab, THEME_COLOR } from "./utils";

interface FilterTabsProps {
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
}

const FilterTabs = ({ activeTab, onTabChange }: FilterTabsProps) => {
  const activeTabClasses = `border-b-2 border-${THEME_COLOR}-500 text-${THEME_COLOR}-600`;
  const inactiveTabClasses = "text-gray-500 hover:text-gray-700";

  return (
    <div className="flex border-b border-gray-200 mb-4">
      <button
        onClick={() => onTabChange("All")}
        className={`px-4 py-2 text-sm font-medium ${
          activeTab === "All" ? activeTabClasses : inactiveTabClasses
        }`}
      >
        All
      </button>
      <button
        onClick={() => onTabChange("Today")}
        className={`px-4 py-2 text-sm font-medium ${
          activeTab === "Today" ? activeTabClasses : inactiveTabClasses
        }`}
      >
        Today
      </button>
      <button
        onClick={() => onTabChange("This Week")}
        className={`px-4 py-2 text-sm font-medium ${
          activeTab === "This Week" ? activeTabClasses : inactiveTabClasses
        }`}
      >
        This Week
      </button>
    </div>
  );
};

export default FilterTabs;
