"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { EventType } from "@/modules/events/types/events";
import { useMemo, useState } from "react";

type EventSelectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  events: EventType[];
  onSelect: (eventId: string) => void;
};

const EventSelectModal = ({
  isOpen,
  onClose,
  events,
  onSelect,
}: EventSelectModalProps) => {
  const [search, setSearch] = useState("");

  const filteredEvents = useMemo(() => {
    if (!search.trim()) return events;
    const lower = search.toLowerCase();
    return events.filter(e => e.title.toLowerCase().includes(lower));
  }, [search, events]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-auto">
        <DialogHeader>Select an Event</DialogHeader>

        <Input
          placeholder="Search events..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-4"
        />

        <div className="space-y-4">
          {filteredEvents.map(event => (
            <Button
              key={event.id}
              variant="outline"
              className="w-full justify-start text-left"
              onClick={() => {
                onSelect(event.id);
                onClose();
              }}
            >
              {event.title}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventSelectModal;
