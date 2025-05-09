"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Check,
  Clock,
  Group,
  MapPin,
  Plus,
  Search,
  Share,
  User,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

// Mock data for friends
const MOCK_FRIENDS = [
  {
    id: "1",
    name: "Marie Novotná",
    username: "marie_novotna",
    imageUrl: "/placeholder-user-1.jpg",
    location: "Brno, Czech Republic",
    isOnline: true,
    lastActive: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    isSharingLocation: true,
    coordinates: [49.197, 16.608],
  },
  {
    id: "2",
    name: "Jan Svoboda",
    username: "jan_svoboda",
    imageUrl: "/placeholder-user-2.jpg",
    location: "Prague, Czech Republic",
    isOnline: false,
    lastActive: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    isSharingLocation: true,
    coordinates: [49.199, 16.599],
  },
  {
    id: "3",
    name: "Eva Dvořáková",
    username: "eva_dvorakova",
    imageUrl: "/placeholder-user-3.jpg",
    location: "Brno, Czech Republic",
    isOnline: false,
    lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isSharingLocation: false,
    coordinates: null,
  },
];

// Mock data for pending friend requests
const MOCK_PENDING_REQUESTS = [
  {
    id: "4",
    name: "Petr Novák",
    username: "petr_novak",
    imageUrl: "/placeholder-user-4.jpg",
    location: "Ostrava, Czech Republic",
    sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    direction: "incoming" as const,
  },
  {
    id: "5",
    name: "Lucie Procházková",
    username: "lucie_prochazkova",
    imageUrl: "/placeholder-user-5.jpg",
    location: "Brno, Czech Republic",
    sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    direction: "outgoing" as const,
  },
];

// Mock data for friend groups
const MOCK_FRIEND_GROUPS = [
  {
    id: "1",
    name: "Close Friends",
    memberCount: 5,
    members: MOCK_FRIENDS.slice(0, 2),
  },
  {
    id: "2",
    name: "Work Colleagues",
    memberCount: 8,
    members: MOCK_FRIENDS.slice(1, 3),
  },
  {
    id: "3",
    name: "Hiking Buddies",
    memberCount: 4,
    members: MOCK_FRIENDS.slice(0, 1),
  },
];

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hr ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  return date.toLocaleDateString();
};

const FriendsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [_selectedFriendId, setSelectedFriendId] = useState<string | null>(
    null,
  );
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedFriendsForGroup, setSelectedFriendsForGroup] = useState<
    string[]
  >([]);
  const [locationSharingEnabled, setLocationSharingEnabled] = useState(true);

  // Filter friends based on search query
  const filteredFriends = MOCK_FRIENDS.filter(friend => {
    return (
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Handle removing a friend
  const handleRemoveFriend = (friendId: string) => {
    // In a real app, this would call an API to remove the friend
    console.log(`Removing friend with ID: ${friendId}`);
  };

  // Handle accepting a friend request
  const handleAcceptRequest = (requestId: string) => {
    // In a real app, this would call an API to accept the request
    console.log(`Accepting friend request with ID: ${requestId}`);
  };

  // Handle rejecting a friend request
  const handleRejectRequest = (requestId: string) => {
    // In a real app, this would call an API to reject the request
    console.log(`Rejecting friend request with ID: ${requestId}`);
  };

  // Handle cancelling an outgoing friend request
  const handleCancelRequest = (requestId: string) => {
    // In a real app, this would call an API to cancel the request
    console.log(`Cancelling friend request with ID: ${requestId}`);
  };

  // Handle creating a new friend group
  const handleCreateGroup = () => {
    // In a real app, this would call an API to create the group
    console.log(
      `Creating group "${newGroupName}" with friends: ${selectedFriendsForGroup.join(", ")}`,
    );
    setIsCreateGroupDialogOpen(false);
    setNewGroupName("");
    setSelectedFriendsForGroup([]);
  };

  // Toggle friend selection for group creation
  const toggleFriendSelection = (friendId: string) => {
    if (selectedFriendsForGroup.includes(friendId)) {
      setSelectedFriendsForGroup(
        selectedFriendsForGroup.filter(id => id !== friendId),
      );
    } else {
      setSelectedFriendsForGroup([...selectedFriendsForGroup, friendId]);
    }
  };

  // Handle sending a friend request
  const handleSendFriendRequest = (username: string) => {
    // In a real app, this would call an API to send the request
    console.log(`Sending friend request to: ${username}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6" />
              Friends
            </h1>
            <p className="text-gray-500 mt-1">Manage your friends and groups</p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsCreateGroupDialogOpen(true)}
            >
              <Group className="h-4 w-4 mr-2" />
              Create Group
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Friend
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Add a Friend</SheetTitle>
                  <SheetDescription>
                    Send a friend request to connect with someone on LocalLens
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium">
                      Username or Email
                    </label>
                    <div className="relative">
                      <Input
                        id="username"
                        placeholder="e.g. john_doe or john@example.com"
                        className="pl-10"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => handleSendFriendRequest("username")}
                  >
                    Send Friend Request
                  </Button>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">QR Code</h3>
                    <p className="text-sm text-gray-500">
                      Have your friend scan your unique QR code to connect
                    </p>
                    <div className="bg-gray-100 aspect-square rounded-lg flex items-center justify-center p-4">
                      <div className="w-48 h-48 bg-gray-300 rounded-md flex items-center justify-center">
                        <p className="text-gray-600 text-sm">
                          QR Code Placeholder
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <Button variant="outline" size="sm">
                        <Share className="h-4 w-4 mr-2" />
                        Share Profile Link
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="relative mb-6">
          <Input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        <Tabs defaultValue="friends">
          <TabsList className="mb-6">
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="location">Location Sharing</TabsTrigger>
          </TabsList>

          <TabsContent value="friends">
            {filteredFriends.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <User className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No friends found</h3>
                <p className="mt-1 text-gray-500">
                  Try adjusting your search or add new friends
                </p>
                <Button className="mt-4" asChild>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button>Add Friend</Button>
                    </SheetTrigger>
                    {/* Sheet content would be here (same as above) */}
                  </Sheet>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFriends.map(friend => (
                  <Card key={friend.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={friend.imageUrl} />
                            <AvatarFallback>
                              <User className="h-6 w-6" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">
                              {friend.name}
                            </CardTitle>
                            <p className="text-sm text-gray-500">
                              @{friend.username}
                            </p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
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
                              >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setSelectedFriendId(friend.id)}
                            >
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>Send Message</DropdownMenuItem>
                            <DropdownMenuItem>Invite to Event</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleRemoveFriend(friend.id)}
                              className="text-red-600"
                            >
                              Remove Friend
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{friend.location}</span>
                      </div>
                      <div className="flex items-center text-sm mb-2">
                        {friend.isOnline ? (
                          <span className="flex items-center text-green-600">
                            <span className="h-2 w-2 bg-green-500 rounded-full mr-1.5" />
                            Online
                          </span>
                        ) : (
                          <span className="flex items-center text-gray-500">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            Last active {formatTimeAgo(friend.lastActive)}
                          </span>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                      {friend.isSharingLocation ? (
                        <Badge
                          variant="outline"
                          className="flex items-center text-green-600 bg-green-50 border-green-200"
                        >
                          <MapPin className="h-3 w-3 mr-1" />
                          Sharing location
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="flex items-center text-gray-500"
                        >
                          <MapPin className="h-3 w-3 mr-1" />
                          Not sharing
                        </Badge>
                      )}
                      <Button variant="outline" size="sm">
                        Message
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_PENDING_REQUESTS.map(request => (
                <Card key={request.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={request.imageUrl} />
                          <AvatarFallback>
                            <User className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            {request.name}
                            <Badge
                              variant={
                                request.direction === "incoming"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {request.direction === "incoming"
                                ? "Incoming"
                                : "Sent"}
                            </Badge>
                          </CardTitle>
                          <p className="text-sm text-gray-500">
                            @{request.username}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{request.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        {request.direction === "incoming" ? "Received" : "Sent"}{" "}
                        {formatTimeAgo(request.sentAt)}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 px-4 py-3 flex justify-end items-center gap-2">
                    {request.direction === "incoming" ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectRequest(request.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAcceptRequest(request.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelRequest(request.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel Request
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="groups">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_FRIEND_GROUPS.map(group => (
                <Card key={group.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <p className="text-sm text-gray-500">
                          {group.memberCount} members
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
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
                            >
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="12" cy="5" r="1" />
                              <circle cx="12" cy="19" r="1" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View All Members</DropdownMenuItem>
                          <DropdownMenuItem>Add Members</DropdownMenuItem>
                          <DropdownMenuItem>Edit Group</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Delete Group
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex -space-x-2 overflow-hidden">
                      {group.members.map(member => (
                        <Avatar
                          key={member.id}
                          className="h-8 w-8 border-2 border-white"
                        >
                          <AvatarImage src={member.imageUrl} />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {group.memberCount > group.members.length && (
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 border-2 border-white">
                          <span className="text-xs font-medium">
                            +{group.memberCount - group.members.length}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                    <Button variant="default" size="sm">
                      <Bell className="h-4 w-4 mr-1" />
                      Invite to Event
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="location">
            <Card>
              <CardHeader>
                <CardTitle>Location Sharing Settings</CardTitle>
                <CardDescription>
                  Manage how you share your location with friends on LocalLens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-medium">Share My Location</h3>
                    <p className="text-sm text-gray-500">
                      Allow friends to see your location on the map
                    </p>
                  </div>
                  <Switch
                    checked={locationSharingEnabled}
                    onCheckedChange={setLocationSharingEnabled}
                  />
                </div>

                <Separator />

                {locationSharingEnabled && (
                  <>
                    <div className="space-y-4">
                      <h3 className="text-base font-medium">Share With</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-gray-500" />
                            <span>All Friends</span>
                          </div>
                          <Switch defaultChecked={false} />
                        </div>
                        {MOCK_FRIEND_GROUPS.map(group => (
                          <div
                            key={group.id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <Group className="h-5 w-5 text-gray-500" />
                              <span>{group.name}</span>
                            </div>
                            <Switch defaultChecked={group.id === "1"} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-base font-medium">
                        Privacy Settings
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <h4 className="text-sm font-medium">
                              Location History
                            </h4>
                            <p className="text-xs text-gray-500">
                              Keep history of your location
                            </p>
                          </div>
                          <Switch defaultChecked={false} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <h4 className="text-sm font-medium">
                              Location Precision
                            </h4>
                            <p className="text-xs text-gray-500">
                              Share exact location vs approximate area
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <h4 className="text-sm font-medium">
                              Background Tracking
                            </h4>
                            <p className="text-xs text-gray-500">
                              Update location even when app is closed
                            </p>
                          </div>
                          <Switch defaultChecked={false} />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2 bg-gray-50 px-6 py-4">
                <Button variant="outline">Reset to Default</Button>
                <Button>Save Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Group Dialog */}
      <Dialog
        open={isCreateGroupDialogOpen}
        onOpenChange={setIsCreateGroupDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Friend Group</DialogTitle>
            <DialogDescription>
              Create a new group to organize your friends and share with them
              easily.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="group-name" className="text-sm font-medium">
                Group Name
              </label>
              <Input
                id="group-name"
                placeholder="e.g. Close Friends, Work Colleagues"
                value={newGroupName}
                onChange={e => setNewGroupName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">Select Friends</span>
              <div className="border rounded-md max-h-60 overflow-y-auto">
                {MOCK_FRIENDS.map(friend => (
                  <div
                    key={friend.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={friend.imageUrl} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <span>{friend.name}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedFriendsForGroup.includes(friend.id)}
                      onChange={() => toggleFriendSelection(friend.id)}
                      className="h-4 w-4 rounded border-gray-300 text-primary"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateGroupDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateGroup}
              disabled={
                !newGroupName.trim() || selectedFriendsForGroup.length === 0
              }
            >
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FriendsPage;
