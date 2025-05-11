"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CreateEventFormValues } from "@/modules/events/schemas/schemas";
import { ImageIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { EVENT_CATEGORIES } from "./utils";

interface BasicInfoStepProps {
  form: UseFormReturn<CreateEventFormValues>;
}

const BasicInfoStep = ({ form }: BasicInfoStepProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Title</FormLabel>
            <FormControl>
              <Input placeholder="Tech Meetup in Brno" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tell people about your event..."
                className="resize-none min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {EVENT_CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === "Food"
                      ? "Food & Drink"
                      : category === "Arts"
                        ? "Arts & Culture"
                        : category === "Sports"
                          ? "Sports & Fitness"
                          : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="imageUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cover Image URL (optional)</FormLabel>
            <FormControl>
              <div className="flex">
                <Input
                  placeholder="https://example.com/image.jpg"
                  {...field}
                  value={field.value || ""}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="ml-2"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </div>
            </FormControl>
            <FormDescription>
              Add an image URL or upload an image for your event
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BasicInfoStep;
