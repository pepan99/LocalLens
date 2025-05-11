"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RSVPStatusEnum } from "@/db/schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarCheck, CalendarClock, CalendarX } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { mockRSVPStore } from "./utils";

// Schema for RSVP form
const rsvpFormSchema = z.object({
  status: z.string(),
  guests: z.number().min(0).max(10).optional(),
  note: z.string().max(200).optional(),
});

type RSVPFormValues = z.infer<typeof rsvpFormSchema>;

interface RSVPDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  onRSVP: (
    eventId: string,
    status: RSVPStatusEnum,
    guests?: number,
    note?: string,
  ) => void;
}

const RSVPDialog = ({
  isOpen,
  onClose,
  eventId,
  eventTitle,
  onRSVP,
}: RSVPDialogProps) => {
  const [selectedStatus, setSelectedStatus] = useState<RSVPStatusEnum>(
    mockRSVPStore[eventId]?.status || RSVPStatusEnum.GOING,
  );

  // Get initial values from store if they exist
  const initialValues = mockRSVPStore[eventId]
    ? {
        status: mockRSVPStore[eventId].status,
        guests: mockRSVPStore[eventId].guests || 0,
        note: mockRSVPStore[eventId].note || "",
      }
    : {
        status: RSVPStatusEnum.GOING,
        guests: 0,
        note: "",
      };

  const form = useForm<RSVPFormValues>({
    resolver: zodResolver(rsvpFormSchema),
    defaultValues: initialValues,
  });

  const handleStatusSelect = (status: RSVPStatusEnum) => {
    setSelectedStatus(status);
    form.setValue("status", status);
  };

  const handleSubmit = (values: RSVPFormValues) => {
    onRSVP(eventId, selectedStatus, values.guests, values.note);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">RSVP to Event</DialogTitle>
          <DialogDescription>
            Let the organizer know if you&apos;ll attend &quot;{eventTitle}
            &quot;
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div>
                <Label className="text-base">Your response</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  <Button
                    type="button"
                    variant={
                      selectedStatus === RSVPStatusEnum.GOING
                        ? "default"
                        : "outline"
                    }
                    className={`flex flex-col items-center justify-center h-20 ${
                      selectedStatus === RSVPStatusEnum.GOING
                        ? "border-2 border-primary"
                        : ""
                    }`}
                    onClick={() => handleStatusSelect(RSVPStatusEnum.GOING)}
                  >
                    <CalendarCheck className="h-6 w-6 mb-1" />
                    <span>Going</span>
                  </Button>
                  <Button
                    type="button"
                    variant={
                      selectedStatus === RSVPStatusEnum.MAYBE
                        ? "default"
                        : "outline"
                    }
                    className={`flex flex-col items-center justify-center h-20 ${
                      selectedStatus === RSVPStatusEnum.MAYBE
                        ? "border-2 border-primary"
                        : ""
                    }`}
                    onClick={() => handleStatusSelect(RSVPStatusEnum.MAYBE)}
                  >
                    <CalendarClock className="h-6 w-6 mb-1" />
                    <span>Maybe</span>
                  </Button>
                  <Button
                    type="button"
                    variant={
                      selectedStatus === RSVPStatusEnum.NOT_GOING
                        ? "default"
                        : "outline"
                    }
                    className={`flex flex-col items-center justify-center h-20 ${
                      selectedStatus === RSVPStatusEnum.NOT_GOING
                        ? "border-2 border-primary"
                        : ""
                    }`}
                    onClick={() => handleStatusSelect(RSVPStatusEnum.NOT_GOING)}
                  >
                    <CalendarX className="h-6 w-6 mb-1" />
                    <span>Not Going</span>
                  </Button>
                </div>
              </div>

              {selectedStatus !== RSVPStatusEnum.NOT_GOING && (
                <FormField
                  control={form.control}
                  name="guests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Guests</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          onChange={e =>
                            field.onChange(parseInt(e.target.value))
                          }
                          value={field.value || 0}
                        />
                      </FormControl>
                      <FormDescription>
                        How many additional guests will you bring?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add a note to the organizer..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Confirm</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RSVPDialog;
