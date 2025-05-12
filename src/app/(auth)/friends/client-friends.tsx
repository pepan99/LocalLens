"use client";

// Import dialog components
import AddFriendDialog from "@/components/friends/add-friend-dialog";
import AddMembersDialog from "@/components/friends/add-members-dialog";
import CreateGroupDialog from "@/components/friends/create-group-dialog";
import DeleteGroupDialog from "@/components/friends/delete-group-dialog";
import EditGroupDialog from "@/components/friends/edit-group-dialog";
import FriendGroupsList from "@/components/friends/sections/friend-groups-list";
// Import section components
import FriendsList from "@/components/friends/sections/friends-list";
import LocationSharingSettings from "@/components/friends/sections/location-sharing-settings";
import PendingRequestsList from "@/components/friends/sections/pending-requests-list";
// Import types and mock data
import {
  Friend,
  FriendGroup,
  FriendRequest,
  LocationSharingSettingsType as LocationSettings,
} from "@/components/friends/types";
import ViewGroupDialog from "@/components/friends/view-group-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  rejectFriendRequest,
  removeFriend,
  sendFriendRequest,
} from "@/modules/friends/actions/friends";
import { Group, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MOCK_FRIEND_GROUPS, MOCK_LOCATION_SETTINGS } from "./mock_friends";

type Props = {
  initialFriends: Friend[];
  initialPendingRequests: FriendRequest[];
};

const ClientFriendsPage = ({
  initialFriends,
  initialPendingRequests,
}: Props) => {
  const [friends, setFriends] = useState<Friend[]>(initialFriends);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>(
    initialPendingRequests,
  );

  // General state
  const [searchQuery, setSearchQuery] = useState("");
  const [_selectedFriendId, setSelectedFriendId] = useState<string | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("friends");
  const [locationSettings, setLocationSettings] = useState<LocationSettings>(
    MOCK_LOCATION_SETTINGS,
  );

  // Local state for all groups
  const [groups, setGroups] = useState<FriendGroup[]>(MOCK_FRIEND_GROUPS);

  // Dialog states
  const [isAddFriendDialogOpen, setIsAddFriendDialogOpen] = useState(false);
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);

  // Group management dialog states
  const [isViewGroupDialogOpen, setIsViewGroupDialogOpen] = useState(false);
  const [isAddMembersDialogOpen, setIsAddMembersDialogOpen] = useState(false);
  const [isEditGroupDialogOpen, setIsEditGroupDialogOpen] = useState(false);
  const [isDeleteGroupDialogOpen, setIsDeleteGroupDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<FriendGroup | null>(null);

  // Filter friends based on search query
  const filteredFriends = friends.filter(friend => {
    if (!searchQuery.trim()) return true;

    return (
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleRemoveFriend = async (friendId: string) => {
    await removeFriend(friendId);
    setFriends(prev => prev.filter(f => f.id !== friendId));
    toast("The friend has been removed from your list.");
  };

  const handleAcceptRequest = async (requestId: string) => {
    await acceptFriendRequest(requestId);
    toast("You are now friends!");
  };

  const handleRejectRequest = async (requestId: string) => {
    await rejectFriendRequest(requestId);
    toast("Friend request declined.");
  };

  const handleCancelRequest = async (requestId: string) => {
    await cancelFriendRequest(requestId);
    toast("Friend request cancelled.");
  };

  const handleSendFriendRequest = async (username: string) => {
    await sendFriendRequest(username);
    toast(`We've sent a request to ${username}.`);
    setIsAddFriendDialogOpen(false);
  };

  // Group management handlers
  const handleCreateGroup = (name: string, friendIds: string[]) => {
    // In a real app, this would call an API to create the group
    console.log(
      `Creating group "${name}" with friends: ${friendIds.join(", ")}`,
    );

    // Create a new group with the selected friends
    const newGroup: FriendGroup = {
      id: `group-${Date.now()}`,
      name,
      memberCount: friendIds.length,
      members: friends.filter(friend => friendIds.includes(friend.id)),
    };

    setGroups([...groups, newGroup]);
    setIsCreateGroupDialogOpen(false);

    toast(`Your group "${name}" has been created successfully.`);

    // Switch to the Groups tab
    setActiveTab("groups");
  };

  const handleViewGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setSelectedGroup(group);
      setIsViewGroupDialogOpen(true);
    }
  };

  const handleAddMembersToGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setSelectedGroup(group);
      setIsAddMembersDialogOpen(true);
    }
  };

  const handleEditGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setSelectedGroup(group);
      setIsEditGroupDialogOpen(true);
    }
  };

  const handleEditGroupSubmit = (groupId: string, name: string) => {
    // Update the group name
    setGroups(
      groups.map(group => (group.id === groupId ? { ...group, name } : group)),
    );

    toast(`Group name has been updated to "${name}".`);
  };

  const handleRemoveMemberFromGroup = (groupId: string, memberId: string) => {
    // Find the group
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    // Remove the member
    const updatedGroup = {
      ...group,
      memberCount: group.memberCount - 1,
      members: group.members.filter(member => member.id !== memberId),
    };

    // Update state
    setGroups(groups.map(g => (g.id === groupId ? updatedGroup : g)));
    setSelectedGroup(updatedGroup);

    toast("The member has been removed from this group.");
  };

  const handleAddMembersSubmit = (groupId: string, memberIds: string[]) => {
    // Find the group
    const group = groups.find(g => g.id === groupId);
    if (!group || memberIds.length === 0) return;

    // Get the new members
    const newMembers = friends.filter(
      friend =>
        memberIds.includes(friend.id) &&
        !group.members.some(m => m.id === friend.id),
    );

    // Add the new members to the group
    const updatedGroup = {
      ...group,
      memberCount: group.memberCount + newMembers.length,
      members: [...group.members, ...newMembers],
    };

    // Update state
    setGroups(groups.map(g => (g.id === groupId ? updatedGroup : g)));
    setSelectedGroup(updatedGroup);
    setIsAddMembersDialogOpen(false);

    toast(
      `${newMembers.length} ${newMembers.length === 1 ? "member has" : "members have"} been added to the group.`,
    );
  };

  const handleDeleteGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setSelectedGroup(group);
      setIsDeleteGroupDialogOpen(true);
    }
  };

  const handleConfirmDeleteGroup = (groupId: string) => {
    // Remove the group
    setGroups(groups.filter(group => group.id !== groupId));
    setIsDeleteGroupDialogOpen(false);

    toast("The group has been permanently deleted.");
  };

  const handleInviteGroupToEvent = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    console.log(`Inviting group "${group.name}" to event`);

    toast(`Redirecting to event creation with ${group.name} selected...`);

    // In a real app, this would navigate to the event creation page with the group pre-selected
  };

  const handleShareGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    console.log(`Sharing group "${group.name}"`);

    // In a real app, this would open a share dialog or copy a link to clipboard
    toast("A link to join this group has been copied to your clipboard.");
  };

  // Location sharing handlers
  const handleLocationSettingsChange = (newSettings: LocationSettings) => {
    setLocationSettings(newSettings);
    console.log("Location settings updated:", newSettings);
  };

  const handleSaveLocationSettings = (settings: LocationSettings) => {
    // In a real app, this would call an API to save the settings
    console.log("Saving location settings:", settings);

    toast("Your location sharing settings have been updated.");
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

            <Button onClick={() => setIsAddFriendDialogOpen(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 mr-2"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              Add Friend
            </Button>
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

        <Tabs
          defaultValue="friends"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="pending">
              Pending
              {pendingRequests.length > 0 && (
                <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-700">
                  {pendingRequests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="location">Location Sharing</TabsTrigger>
          </TabsList>

          <TabsContent value="friends">
            <FriendsList
              filteredFriends={filteredFriends}
              searchQuery={searchQuery}
              onRemoveFriend={handleRemoveFriend}
              onAddFriendClick={() => setIsAddFriendDialogOpen(true)}
            />
          </TabsContent>

          <TabsContent value="pending">
            <PendingRequestsList
              requests={pendingRequests}
              onAcceptRequest={handleAcceptRequest}
              onRejectRequest={handleRejectRequest}
              onCancelRequest={handleCancelRequest}
            />
          </TabsContent>

          <TabsContent value="groups">
            <FriendGroupsList
              groups={groups}
              onViewGroup={handleViewGroup}
              onAddMembersToGroup={handleAddMembersToGroup}
              onEditGroup={handleEditGroup}
              onDeleteGroup={handleDeleteGroup}
              onInviteGroupToEvent={handleInviteGroupToEvent}
              onCreateGroupClick={() => setIsCreateGroupDialogOpen(true)}
            />
          </TabsContent>

          <TabsContent value="location">
            <LocationSharingSettings
              settings={locationSettings}
              groups={groups}
              onSettingsChanged={handleLocationSettingsChange}
              onSaveSettings={handleSaveLocationSettings}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Friend Dialogs */}
      <AddFriendDialog
        isOpen={isAddFriendDialogOpen}
        onOpenChange={setIsAddFriendDialogOpen}
        onSendRequest={handleSendFriendRequest}
      />

      {/* Group Management Dialogs */}
      <CreateGroupDialog
        isOpen={isCreateGroupDialogOpen}
        onOpenChange={setIsCreateGroupDialogOpen}
        friends={friends}
        onCreateGroup={handleCreateGroup}
      />

      <ViewGroupDialog
        isOpen={isViewGroupDialogOpen}
        onOpenChange={setIsViewGroupDialogOpen}
        group={selectedGroup}
        onEditClick={groupId => {
          setIsViewGroupDialogOpen(false);
          handleEditGroup(groupId);
        }}
        onAddMembersClick={groupId => {
          setIsViewGroupDialogOpen(false);
          handleAddMembersToGroup(groupId);
        }}
        onInviteToEventClick={handleInviteGroupToEvent}
        onShareGroupClick={handleShareGroup}
      />

      <AddMembersDialog
        isOpen={isAddMembersDialogOpen}
        onOpenChange={setIsAddMembersDialogOpen}
        group={selectedGroup}
        friends={friends}
        onAddMembers={handleAddMembersSubmit}
      />

      <EditGroupDialog
        isOpen={isEditGroupDialogOpen}
        onOpenChange={setIsEditGroupDialogOpen}
        group={selectedGroup}
        onEditGroup={handleEditGroupSubmit}
        onRemoveMember={handleRemoveMemberFromGroup}
      />

      <DeleteGroupDialog
        isOpen={isDeleteGroupDialogOpen}
        onOpenChange={setIsDeleteGroupDialogOpen}
        group={selectedGroup}
        onConfirmDelete={handleConfirmDeleteGroup}
      />
    </div>
  );
};

export default ClientFriendsPage;
