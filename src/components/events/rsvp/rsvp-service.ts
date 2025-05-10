"use client";

import {
  CURRENT_USER,
  mockRSVPStore,
  RSVPResponse,
  RSVPStatusEnum,
} from "./utils";

export class RSVPService {
  /**
   * Submit an RSVP for an event
   */
  static submitRSVP(
    eventId: string,
    status: RSVPStatusEnum,
    guests: number = 0,
    note?: string,
  ): Promise<RSVPResponse> {
    // In a real app, this would be an API call
    return new Promise(resolve => {
      // Simulate API delay
      setTimeout(() => {
        const response: RSVPResponse = {
          eventId,
          userId: CURRENT_USER.id,
          status,
          timestamp: new Date(),
          guests,
          note,
        };

        // Update mock store
        mockRSVPStore[eventId] = response;
        resolve(response);
      }, 500);
    });
  }

  /**
   * Get RSVP for an event
   */
  static getRSVP(eventId: string): Promise<RSVPResponse | null> {
    // In a real app, this would be an API call
    return new Promise(resolve => {
      // Simulate API delay
      setTimeout(() => {
        resolve(mockRSVPStore[eventId] || null);
      }, 200);
    });
  }

  /**
   * Cancel an RSVP for an event
   */
  static cancelRSVP(eventId: string): Promise<void> {
    // In a real app, this would be an API call
    return new Promise(resolve => {
      // Simulate API delay
      setTimeout(() => {
        delete mockRSVPStore[eventId];
        resolve();
      }, 300);
    });
  }

  /**
   * Get all RSVPs for a user
   */
  static getUserRSVPs(): Promise<RSVPResponse[]> {
    // In a real app, this would be an API call
    return new Promise(resolve => {
      // Simulate API delay
      setTimeout(() => {
        const responses = Object.values(mockRSVPStore).filter(
          rsvp => rsvp.userId === CURRENT_USER.id,
        );
        resolve(responses);
      }, 300);
    });
  }
}
