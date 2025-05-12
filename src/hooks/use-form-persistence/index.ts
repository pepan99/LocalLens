"use client";

import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from "@/lib/storage-utils";
import { useEffect, useRef } from "react";
import { Path, UseFormReturn } from "react-hook-form";

type PersistenceOptions = {
  storageKey: string;
  exclude?: string[];
  persistCoordinates?: boolean;
  debounceMs?: number;
};

/**
 * A hook to persist form data to localStorage with debouncing
 * @param form The react-hook-form instance
 * @param coordinates Optional coordinates to persist alongside form data
 * @param options Configuration options
 */
export const useFormPersistence = <T extends object>(
  form: UseFormReturn<T>,
  coordinates: [number, number] | null = null,
  options: PersistenceOptions,
) => {
  const {
    storageKey,
    exclude = [],
    persistCoordinates = false,
    debounceMs = 500,
  } = options;

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const coordinatesRef = useRef<[number, number] | null>(coordinates);

  useEffect(() => {
    coordinatesRef.current = coordinates;
  }, [coordinates]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedData = getStorageItem(storageKey);

      if (savedData) {
        const { formValues, _savedCoordinates } = JSON.parse(savedData);

        if (formValues) {
          const processedValues = { ...formValues };

          if (
            processedValues.date &&
            typeof processedValues.date === "string"
          ) {
            processedValues.date = new Date(processedValues.date);
          }

          Object.keys(processedValues).forEach(key => {
            if (!exclude.includes(key)) {
              form.setValue(key as unknown as Path<T>, processedValues[key]);
            }
          });
        }
      }
    } catch (error) {
      console.error("Error loading form data from storage:", error);
    }
  }, [storageKey, form, exclude]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saveFormData = (formValues: object) => {
      try {
        if (
          !Object.values(formValues).some(value => !!value) &&
          !coordinatesRef.current
        ) {
          return;
        }

        const filteredValues = { ...formValues };
        exclude.forEach(field => {
          delete filteredValues[field as keyof typeof filteredValues];
        });

        const dataToStore = {
          formValues: filteredValues,
          ...(persistCoordinates && {
            savedCoordinates: coordinatesRef.current,
          }),
          lastUpdated: new Date().toISOString(),
        };

        setStorageItem(storageKey, JSON.stringify(dataToStore));
      } catch (error) {
        console.error("Error saving form data to storage:", error);
      }
    };

    const debouncedSave = (formValues: object) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        saveFormData(formValues);
      }, debounceMs);
    };

    const subscription = form.watch(formValues => {
      debouncedSave(formValues);
    });

    return () => {
      subscription.unsubscribe();

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [form, storageKey, exclude, persistCoordinates, debounceMs]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!persistCoordinates || !coordinates) {
      return;
    }

    const updateCoordinates = () => {
      try {
        const savedData = getStorageItem(storageKey);
        let dataToStore;

        if (savedData) {
          dataToStore = JSON.parse(savedData);
          dataToStore.savedCoordinates = coordinates;
        } else {
          dataToStore = {
            formValues: form.getValues(),
            savedCoordinates: coordinates,
            lastUpdated: new Date().toISOString(),
          };
        }

        setStorageItem(storageKey, JSON.stringify(dataToStore));
      } catch (error) {
        console.error("Error saving coordinates to storage:", error);
      }
    };

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(updateCoordinates, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [coordinates, form, persistCoordinates, storageKey, debounceMs]);

  const clearPersistedData = () => {
    try {
      removeStorageItem(storageKey);
    } catch (error) {
      console.error("Error clearing form data from storage:", error);
    }
  };

  const saveCurrentState = () => {
    try {
      const formValues = form.getValues();

      if (
        !Object.values(formValues).some(value => !!value) &&
        !coordinatesRef.current
      ) {
        return;
      }

      const filteredValues = { ...formValues };
      exclude.forEach(field => {
        delete filteredValues[field as keyof typeof filteredValues];
      });

      const dataToStore = {
        formValues: filteredValues,
        ...(persistCoordinates && { savedCoordinates: coordinatesRef.current }),
        lastUpdated: new Date().toISOString(),
      };

      setStorageItem(storageKey, JSON.stringify(dataToStore));
    } catch (error) {
      console.error("Error force saving form data to storage:", error);
    }
  };

  return {
    clearPersistedData,
    saveCurrentState,
  };
};
