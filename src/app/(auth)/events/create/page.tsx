"use client";

import { CreateEventForm } from "@/components/events/event-create";
import { createEvent } from "@/modules/events/actions/events";
import { CreateEventFormValues } from "@/modules/events/schemas/schemas";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CreateEventPage = () => {
  const router = useRouter();

  // Handle form submission
  const handleSubmit = async (
    values: CreateEventFormValues,
    coordinates: [number, number],
  ) => {
    const res = await createEvent(
      {
        ...values,
      },
      coordinates,
    );

    if (res.type === "error") {
      toast.error("Error creating event");
      return;
    }

    console.log("Event created with values:", values);

    router.push("/events");
  };

  // Handle cancel button
  const handleCancel = () => {
    router.push("/events");
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <CreateEventForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
};

export default CreateEventPage;
