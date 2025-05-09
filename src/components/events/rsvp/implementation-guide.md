# RSVP Functionality Implementation Guide

This guide explains how the RSVP functionality is implemented and how to test it in your application.

## Components Overview

1. **RSVPButton** - A button component that shows the current RSVP status and opens the RSVP dialog.
2. **RSVPDialog** - A modal dialog for selecting RSVP status, guests, and adding a note.
3. **RSVPStatus** - A badge component that shows the current RSVP status.
4. **RSVPManager** - A wrapper component that manages the RSVP state and dialog.
5. **RSVPAttendees** - A component that displays the list of attendees for an event.
6. **RSVPService** - A service layer for handling RSVP operations (mock implementation).

## Integration Points

The RSVP functionality has been integrated in two main places:

1. **Event Cards** - Each event card has an RSVP button for quick RSVPs
2. **Event Detail Page** - Full RSVP functionality with attendee list

## Mock Data for Testing

The implementation includes mock data for testing:

- **Mock RSVP Store** - A simulated database of RSVPs
- **Mock Attendees** - Sample attendees for the attendee list
- **CURRENT_USER** - A mock user for testing

## How to Test the RSVP Functionality

### Basic RSVP Flow

1. Navigate to the events list page
2. Find an event you don't own (indicated by an RSVP button rather than edit/delete buttons)
3. Click the RSVP button
4. In the dialog, select your response (Going, Maybe, Not Going)
5. Add the number of guests if applicable
6. Optionally add a note
7. Click "Confirm"
8. The button should update to show your response

### Event Detail Page RSVP

1. Navigate to an event detail page for an event you don't own
2. Click the RSVP button in the actions card
3. Complete the RSVP flow as above
4. You should see a toast notification confirming your response
5. The attendee list should show you as attending (note: in this mock implementation, the attendee list is static)

### Viewing Attendees

1. Navigate to an event detail page
2. If you're the event owner, the attendee list appears in the right column
3. If you're not the owner, the attendee list appears under the event information
4. Switch between the "Going" and "Maybe" tabs to see different groups of attendees

## Implementation Details

### State Management

The RSVP functionality uses a combination of local state and a mock service layer:

- **Local State** - Components manage their own UI state (dialog open/closed, selected status)
- **Mock Service** - RSVPService handles "API calls" to a mock data store

### Event Handling

The components use several event handlers:

- **onOpenDialog** - Opens the RSVP dialog
- **onRSVP** - Handles RSVP submission
- **onRSVPChange** - Callback for when RSVP status changes (for parent components)

### Integration with Event Components

The RSVP functionality is integrated into:

- **EventCard** - In `src/components/events/components/event-card.tsx`
- **EventActions** - In `src/components/events/event-detail/event-actions.tsx`
- **EventDetailPage** - In `src/app/(auth)/events/[id]/page.tsx`

## Production Usage

For production use, you would need to:

1. Replace the mock service with real API calls
2. Implement proper authentication for RSVP actions
3. Add real-time updates for attendee lists
4. Add validations for capacity limits
5. Implement email notifications for RSVPs
