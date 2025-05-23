"use client";

import EventSelectModal from "@/components/events/components/event-select-modal";
// Import dialog components
import AddFriendDialog from "@/components/friends/add-friend-dialog";
import AddMembersDialog from "@/components/friends/add-members-dialog";
import CreateGroupDialog from "@/components/friends/create-group-dialog";
import DeleteGroupDialog from "@/components/friends/delete-group-dialog";
import EditGroupDialog from "@/components/friends/edit-group-dialog";
import FriendGroupsList from "@/components/friends/sections/friend-groups-list";
// Import section components
import FriendsList from "@/components/friends/sections/friends-list";
import PendingRequestsList from "@/components/friends/sections/pending-requests-list";
// Import types and mock data
import { Friend, FriendGroup, FriendRequest } from "@/components/friends/types";
import ViewGroupDialog from "@/components/friends/view-group-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventType } from "@/modules/events/types/events";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  rejectFriendRequest,
  removeFriend,
  sendFriendRequest,
} from "@/modules/friends/actions/friends";
import {
  addMembersToGroup,
  createFriendGroup,
  deleteFriendGroup,
  removeMemberFromGroup,
  renameGroup,
} from "@/modules/groups/actions/groups";
import {
  inviteGroupToEvent,
  inviteUserToEvent,
} from "@/modules/invitations/actions/invitations";
import { Group, Search, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  friends: Friend[];
  groups: FriendGroup[];
  pendingRequests: FriendRequest[];
  events: EventType[];
};

const ClientFriendsPage = ({
  friends,
  groups,
  pendingRequests,
  events,
}: Props) => {
  const [isEventSelectOpen, setIsEventSelectOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // General state
  const [searchQuery, setSearchQuery] = useState("");

  const [activeTab, setActiveTab] = useState("friends");

  // Dialog states
  const [isAddFriendDialogOpen, setIsAddFriendDialogOpen] = useState(false);
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);

  // Group management dialog states
  const [isViewGroupDialogOpen, setIsViewGroupDialogOpen] = useState(false);
  const [isAddMembersDialogOpen, setIsAddMembersDialogOpen] = useState(false);
  const [isEditGroupDialogOpen, setIsEditGroupDialogOpen] = useState(false);
  const [isDeleteGroupDialogOpen, setIsDeleteGroupDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<FriendGroup | null>(null);

  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
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

  const handleCreateGroup = async (name: string, friendIds: string[]) => {
    try {
      await createFriendGroup(name, friendIds);
      toast(`Group "${name}" created.`);
      setIsCreateGroupDialogOpen(false);
      setActiveTab("groups");
    } catch {
      toast.error("Failed to create group.");
    }
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

  const handleEditGroupSubmit = async (groupId: string, name: string) => {
    try {
      await renameGroup(groupId, name);
      toast(`Group name updated to "${name}".`);
    } catch {
      toast.error("Failed to rename group.");
    }
  };

  const handleRemoveMemberFromGroup = async (
    groupId: string,
    memberId: string,
  ) => {
    try {
      await removeMemberFromGroup(groupId, memberId);
      toast("Member removed from the group.");
    } catch {
      toast.error("Failed to remove member.");
    }
  };

  const handleAddMembersSubmit = async (
    groupId: string,
    memberIds: string[],
  ) => {
    try {
      await addMembersToGroup(groupId, memberIds);
      toast(`${memberIds.length} member(s) added to the group.`);
      setIsAddMembersDialogOpen(false);
    } catch {
      toast.error("Failed to add members.");
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setSelectedGroup(group);
      setIsDeleteGroupDialogOpen(true);
    }
  };

  const handleConfirmDeleteGroup = async (groupId: string) => {
    try {
      await deleteFriendGroup(groupId);
      toast("Group deleted.");
      setIsDeleteGroupDialogOpen(false);
    } catch {
      toast.error("Failed to delete group.");
    }
  };

  const handleInviteGroupToEvent = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    setSelectedGroup(group);
    setIsEventSelectOpen(true);
  };

  const handleInviteToEvent = (friendId: string) => {
    setSelectedFriendId(friendId);
    setIsEventSelectOpen(true);
  };

  const handleEventSelect = async (eventId: string) => {
    setIsEventSelectOpen(false);
    setSelectedEventId(eventId);

    // If a group is selected, invite group
    if (selectedGroup) {
      const res = await inviteGroupToEvent({
        eventId,
        groupMemberIds: selectedGroup.members.map(x => x.id),
      });

      toast.success(
        `Invited ${res.invitedCount} members of "${selectedGroup.name}"`,
      );
      setSelectedGroup(null);
    }

    // If a friend is selected, invite friend
    if (selectedFriendId) {
      const res = await inviteUserToEvent({
        eventId,
        invitedUserId: selectedFriendId,
      });

      if (res.success) {
        toast.success("Invitation sent!");
      } else {
        toast.warning(res.message ?? "Could not invite");
      }

      setSelectedFriendId(null);
    }
  };

  const handleShareGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    console.log(`Sharing group "${group.name}"`);

    // In a real app, this would open a share dialog or copy a link to clipboard
    toast("A link to join this group has been copied to your clipboard.");
  };

  return (
    <div className="container">
      <div className="bg-gradient-to-br from-white to-green-100/95 backdrop-blur-sm rounded-lg shadow-md p-6">
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
          </TabsList>
          <ScrollArea className="h-[570px]">
            <TabsContent value="friends">
              <FriendsList
                filteredFriends={filteredFriends}
                searchQuery={searchQuery}
                onRemoveFriend={handleRemoveFriend}
                onAddFriendClick={() => setIsAddFriendDialogOpen(true)}
                onInviteToEvent={handleInviteToEvent}
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
          </ScrollArea>
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

      <EventSelectModal
        isOpen={isEventSelectOpen}
        onClose={() => setIsEventSelectOpen(false)}
        events={events}
        onSelect={handleEventSelect}
      />
    </div>
  );
};

export default ClientFriendsPage;
