"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Search, Users } from "lucide-react";

interface FriendsHeaderProps {
  onSearch: (query: string) => void;
  onAddFriendClick: () => void;
  activeTab: string;
  onTabChange: (value: string) => void;
  pendingRequestsCount: number;
}

const FriendsHeader = ({
  onSearch,
  onAddFriendClick,
  activeTab,
  onTabChange,
  pendingRequestsCount,
}: FriendsHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Friends</h1>
        <Button onClick={onAddFriendClick}>Add Friend</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search friends..."
          className="pl-10"
          onChange={e => onSearch(e.target.value)}
        />
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="all" className="gap-1.5">
            <Users className="h-4 w-4" />
            <span>All Friends</span>
          </TabsTrigger>
          <TabsTrigger value="requests" className="gap-1.5">
            <Bell className="h-4 w-4" />
            <span>Requests</span>
            {pendingRequestsCount > 0 && (
              <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-700">
                {pendingRequestsCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="groups" className="gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Groups</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default FriendsHeader;
