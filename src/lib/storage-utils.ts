"use client";

/**
 * Utility functions for working with browser storage
 */

/**
 * Check if localStorage is available in the current environment
 */
export const isStorageAvailable = (
  type: "localStorage" | "sessionStorage",
): boolean => {
  try {
    const storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
};

// In-memory fallback storage when localStorage is not available
const memoryStorage: Record<string, string> = {};

/**
 * Get an item from storage with fallback to memory storage
 */
export const getStorageItem = (key: string): string | null => {
  if (typeof window === "undefined") return null; // SSR check

  if (isStorageAvailable("localStorage")) {
    return localStorage.getItem(key);
  } else {
    return memoryStorage[key] || null;
  }
};

/**
 * Set an item in storage with fallback to memory storage
 */
export const setStorageItem = (key: string, value: string): void => {
  if (typeof window === "undefined") return; // SSR check

  if (isStorageAvailable("localStorage")) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(
        "localStorage setItem failed, falling back to memory storage",
        e,
      );
      memoryStorage[key] = value;
    }
  } else {
    memoryStorage[key] = value;
  }
};

/**
 * Remove an item from storage with fallback to memory storage
 */
export const removeStorageItem = (key: string): void => {
  if (typeof window === "undefined") return; // SSR check

  if (isStorageAvailable("localStorage")) {
    localStorage.removeItem(key);
  } else {
    delete memoryStorage[key];
  }
};

/**
 * Get all items from storage that match a prefix
 */
export const getStorageItemsByPrefix = (
  prefix: string,
): Record<string, string> => {
  if (typeof window === "undefined") return {}; // SSR check

  const result: Record<string, string> = {};

  if (isStorageAvailable("localStorage")) {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        const value = localStorage.getItem(key);
        if (value) result[key] = value;
      }
    }
  } else {
    // Check memory storage
    Object.keys(memoryStorage).forEach(key => {
      if (key.startsWith(prefix)) {
        result[key] = memoryStorage[key];
      }
    });
  }

  return result;
};

/**
 * Clear all items from storage that match a prefix
 */
export const clearStorageItemsByPrefix = (prefix: string): void => {
  if (typeof window === "undefined") return; // SSR check

  if (isStorageAvailable("localStorage")) {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
  } else {
    // Clear from memory storage
    Object.keys(memoryStorage).forEach(key => {
      if (key.startsWith(prefix)) {
        delete memoryStorage[key];
      }
    });
  }
};
