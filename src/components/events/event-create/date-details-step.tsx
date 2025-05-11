"use client";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CreateEventFormValues } from "@/modules/events/schemas/schemas";
import { format } from "date-fns";
import { CalendarIcon, Check, Clock, Users } from "lucide-react";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

interface DateDetailsStepProps {
  form: UseFormReturn<CreateEventFormValues>;
}

const DateDetailsStep = ({ form }: DateDetailsStepProps) => {
  // Trigger validation on mount
  useEffect(() => {
    // Validate existing values
    const hasDate = form.getValues("date");
    const hasTime = form.getValues("time");
    const hasCapacity = form.getValues("capacity");

    if (hasDate || hasTime || hasCapacity) {
      form.trigger(["date", "time", "capacity"]);
    }
  }, [form]);

  // Check if fields are valid
  const isDateValid = !form.formState.errors.date && form.getValues("date");
  const isTimeValid = !form.formState.errors.time && form.getValues("time");
  const isCapacityValid =
    !form.formState.errors.capacity && form.getValues("capacity");

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="flex items-center">
              Date
              <span className="text-red-500 ml-1">*</span>
              {isDateValid && <Check className="h-4 w-4 ml-2 text-green-500" />}
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground",
                      form.formState.errors.date ? "border-red-300" : "",
                      isDateValid ? "border-green-300" : "",
                    )}
                  >
                    {field.value ? (
                      <span className="flex items-center">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(field.value, "PPP")}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Pick a date
                      </span>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={date => {
                    field.onChange(date);
                    if (date) {
                      form.trigger("date");
                    }
                  }}
                  initialFocus
                  disabled={date => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }} // Disable past dates
                />
              </PopoverContent>
            </Popover>
            <FormDescription>
              Select the event date (must be in the future)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="time"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Time
              <span className="text-red-500 ml-1">*</span>
              {isTimeValid && <Check className="h-4 w-4 ml-2 text-green-500" />}
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Clock className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="time"
                  className={cn(
                    "pl-8",
                    form.formState.errors.time ? "border-red-300" : "",
                    isTimeValid ? "border-green-300" : "",
                  )}
                  {...field}
                  onChange={e => {
                    field.onChange(e);
                    if (e.target.value) {
                      form.trigger("time");
                    }
                  }}
                />
              </div>
            </FormControl>
            <FormDescription>
              Select the start time for your event
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="capacity"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Capacity
              <span className="text-red-500 ml-1">*</span>
              {isCapacityValid && (
                <Check className="h-4 w-4 ml-2 text-green-500" />
              )}
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Users className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="number"
                  placeholder="50"
                  min="1"
                  className={cn(
                    "pl-8",
                    form.formState.errors.capacity ? "border-red-300" : "",
                    isCapacityValid ? "border-green-300" : "",
                  )}
                  {...field}
                  onChange={e => {
                    field.onChange(e);
                    if (e.target.value) {
                      form.trigger("capacity");
                    }
                  }}
                />
              </div>
            </FormControl>
            <FormDescription>Maximum number of attendees</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="isPrivate"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-4">
            <FormControl>
              <input
                type="checkbox"
                checked={field.value}
                onChange={field.onChange}
                className="h-4 w-4 mt-1 rounded border-gray-300 text-primary"
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Private Event</FormLabel>
              <FormDescription>
                Only invited people can see and join this event
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

export default DateDetailsStep;
