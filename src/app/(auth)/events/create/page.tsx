"use client";

import {
  CreateEventForm,
  CreateEventFormValues,
} from "@/components/events/event-create";
import { useRouter } from "next/navigation";

const CreateEventPage = () => {
  const router = useRouter();

  // Handle form submission
  const handleSubmit = (
    values: CreateEventFormValues,
    coordinates: [number, number] | null,
  ) => {
    console.log("Creating event:", { ...values, coordinates });

    setTimeout(() => {
      router.push("/events");
    }, 1000);
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
