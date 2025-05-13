import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type PlacesSearchBarProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
};

export const PlacesSearchBar = ({
  searchQuery,
  onSearchChange,
}: PlacesSearchBarProps) => {
  return (
    <div className="relative flex-1">
      <Input
        type="text"
        placeholder="Search places by name or location..."
        value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
        className="pl-10"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    </div>
  );
};
