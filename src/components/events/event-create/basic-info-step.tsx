"use client";

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
import { cn } from "@/lib/utils";
import { CreateEventFormValues } from "@/modules/events/schemas/schemas";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { EVENT_CATEGORIES } from "./utils";

interface BasicInfoStepProps {
  form: UseFormReturn<CreateEventFormValues>;
}

const BasicInfoStep = ({ form }: BasicInfoStepProps) => {
  // Validate fields on mount
  useEffect(() => {
    // Trigger validation for existing values if any
    if (
      form.getValues("title") ||
      form.getValues("description") ||
      form.getValues("category")
    ) {
      form.trigger(["title", "description", "category"]);
    }
  }, [form]);

  // Check if fields are valid
  const isTitleValid = !form.formState.errors.title && form.getValues("title");
  const isDescriptionValid =
    !form.formState.errors.description && form.getValues("description");
  const isCategoryValid =
    !form.formState.errors.category && form.getValues("category");

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Event Title
              <span className="text-red-500 ml-1">*</span>
              {isTitleValid && (
                <Check className="h-4 w-4 ml-2 text-green-500" />
              )}
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Tech Meetup in Brno"
                className={cn(
                  form.formState.errors.title ? "border-red-300" : "",
                  isTitleValid ? "border-green-300" : "",
                )}
                {...field}
                onChange={e => {
                  field.onChange(e);
                  // Trigger validation after change
                  form.trigger("title");
                }}
              />
            </FormControl>
            <FormDescription>
              A clear, concise title for your event
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Description
              {isDescriptionValid && (
                <Check className="h-4 w-4 ml-2 text-green-500" />
              )}
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tell people about your event..."
                className={cn(
                  "resize-none min-h-[120px]",
                  form.formState.errors.description ? "border-red-300" : "",
                  isDescriptionValid ? "border-green-300" : "",
                )}
                {...field}
                onChange={e => {
                  field.onChange(e);
                  // Trigger validation after change
                  form.trigger("description");
                }}
              />
            </FormControl>
            <FormDescription>
              Minimum 10 characters. Provide details about what attendees can
              expect.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Category
              {isCategoryValid && (
                <Check className="h-4 w-4 ml-2 text-green-500" />
              )}
            </FormLabel>
            <Select
              onValueChange={value => {
                field.onChange(value);
                form.trigger("category");
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger
                  className={cn(
                    form.formState.errors.category ? "border-red-300" : "",
                    isCategoryValid ? "border-green-300" : "",
                  )}
                >
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
            <FormDescription>
              Choose the category that best fits your event
            </FormDescription>
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
              </div>
            </FormControl>
            <FormDescription>Add an image URL</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BasicInfoStep;
