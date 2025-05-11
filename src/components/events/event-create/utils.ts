"use client";

// Common location coordinates
export const locationCoordinates: Record<string, [number, number]> = {
  "Impact Hub, Brno": [49.19, 16.61],
  "Freedom Square, Brno": [49.1953, 16.6083],
  "Moravian Gallery, Brno": [49.1976, 16.6075],
  "Lužánky Park, Brno": [49.2097, 16.6158],
  "Music Lab, Brno": [49.1943, 16.6009],
  "Brno University of Technology": [49.2246, 16.5752],
  "Špilberk Castle, Brno": [49.1947, 16.6006],
  "Villa Tugendhat, Brno": [49.2134, 16.6158],
  "Brno Exhibition Centre": [49.1887, 16.5804],
  "Brno Train Station": [49.1905, 16.6128],
};

// List of available categories
export const EVENT_CATEGORIES = [
  "Technology",
  "Food",
  "Arts",
  "Sports",
  "Music",
  "Education",
  "Social",
  "Other",
];

// List of available locations
export const AVAILABLE_LOCATIONS = Object.keys(locationCoordinates);
