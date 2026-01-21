# NGO Calendar Application

A professional, accessible calendar application built with React and Vite, designed for NGOs to manage and display their events, activities, and meetings.

## Features

- **Monthly Calendar View**: Clean, intuitive calendar interface showing all events
- **Event Management**: Display events with title, date, time, location, and category
- **Event Categories**: Filter by Awareness, Fundraising, Volunteering, or Meeting
- **Multi-day Events**: Support for events spanning multiple days
- **Event Details Modal**: Click any event to view full details in a beautiful modal
- **Date Selection**: Click any date to view all events for that day
- **Visual Highlights**: 
  - Today's date is highlighted in blue
  - Upcoming events have a green border indicator
  - Multi-day events are clearly marked
- **Admin Panel** (`/admin`): Add new events with a comprehensive form
- **Real-time Updates**: Changes made in admin panel appear instantly on the calendar without page refresh
- **Cross-tab Synchronization**: Events sync across multiple browser tabs/windows
- **Local Storage Persistence**: Events are saved locally and persist across sessions
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Accessibility**: Full ARIA support and keyboard navigation

## Tech Stack

- **React 18** with Hooks
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Modern ES6+** JavaScript

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Calendar.jsx          # Main calendar component
│   │   ├── EventCard.jsx         # Event card display component
│   │   ├── EventModal.jsx        # Event details modal
│   │   └── EventFilters.jsx      # Filter and navigation controls
│   ├── context/
│   │   └── EventsContext.jsx     # Event state management with Context API
│   ├── pages/
│   │   ├── CalendarView.jsx      # Main calendar page
│   │   └── AdminPage.jsx         # Admin panel for adding events
│   ├── data/
│   │   └── events.json          # Default event data (seed data)
│   ├── App.jsx                   # Main app with routing
│   ├── main.jsx                  # Application entry point
│   └── index.css                 # Global styles and Tailwind imports
├── index.html                    # HTML template
├── package.json                  # Dependencies and scripts
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── postcss.config.js            # PostCSS configuration
```

## How the Calendar Works

### Real-time Event Management
The application uses React Context API for state management:
- **EventsContext**: Centralized state management for all events
- **LocalStorage Persistence**: Events are automatically saved to browser localStorage
- **Real-time Updates**: When admin adds an event, all components using `useEvents()` hook automatically update
- **Cross-tab Sync**: Changes sync across multiple browser tabs via storage events

### Calendar Component
The `Calendar` component generates a monthly grid view:
1. Calculates the first day of the month and determines which day of the week it falls on
2. Fills in days from the previous month to complete the first week
3. Displays all days of the current month
4. Fills in days from the next month to complete the grid (6 rows × 7 days)
5. Highlights today's date, selected date, and upcoming dates
6. Shows up to 2 events per day directly on the calendar, with a "+X more" indicator for additional events
7. Automatically updates when new events are added via Context API

### Event Filtering
- Events are filtered by category (Awareness, Fundraising, Volunteering, Meeting)
- The filter applies to both the calendar view and the events list
- "All" option shows all events regardless of category

### Date Navigation
- Previous/Next month buttons to navigate through months
- "Today" button to quickly jump to the current month
- Selected date is highlighted and shows all events for that day in the sidebar

### Event Display
- **Calendar View**: Events appear as colored badges on their respective dates
- **Event Cards**: Clickable cards showing event summary (title, date, time, location, category)
- **Event Modal**: Full-screen modal with complete event details when clicking an event card

### Multi-day Events
- Events with `isMultiDay: true` and an `endDate` span across multiple calendar days
- Displayed on all days between start and end date
- Clearly marked in both calendar and event cards

### Accessibility Features
- ARIA labels and roles for screen readers
- Keyboard navigation support (Enter/Space to select, Escape to close modal)
- Focus indicators for keyboard users
- Semantic HTML structure
- Proper heading hierarchy

## Installation & Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Access the application**:
   - Main Calendar: `http://localhost:5173/`
   - Admin Panel: `http://localhost:5173/admin`

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

## Admin Panel Usage

1. Navigate to `/admin` route
2. Fill out the event form:
   - **Title** (required): Event name
   - **Start Date** (required): When the event starts
   - **Multi-day**: Check if event spans multiple days
   - **End Date**: Required if multi-day is checked
   - **Start/End Time**: Optional time information
   - **Location**: Optional venue information
   - **Category** (required): Awareness, Fundraising, Volunteering, or Meeting
   - **Description**: Optional detailed description
3. Click "Add Event" - the event appears immediately on the calendar
4. Changes are visible in real-time without page refresh
5. Events persist in localStorage and sync across browser tabs

## Event Data Structure

Events are stored in `src/data/events.json` with the following structure:

```json
{
  "id": "unique-id",
  "title": "Event Title",
  "date": "YYYY-MM-DD",
  "startTime": "HH:MM",
  "endTime": "HH:MM",
  "location": "Event Location",
  "category": "Awareness | Fundraising | Volunteering | Meeting",
  "description": "Full event description",
  "isMultiDay": false,
  "endDate": "YYYY-MM-DD" // Optional, only for multi-day events
}
```

## Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
- `ngo-primary`: Primary brand color (blue)
- `ngo-secondary`: Secondary brand color (green)
- `ngo-accent`: Accent color (red)

### Event Categories
To add new categories:
1. Add the category name to the `categories` array in `EventFilters.jsx`
2. Add corresponding color classes in `src/index.css` and component files
3. Update events in `events.json` with the new category

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is created for NGO use and can be customized as needed.
