import React, { useState, useMemo } from 'react';
import { useEvents } from '../context/EventsContext';
import Calendar from '../components/Calendar';
import EventCard from '../components/EventCard';
import EventModal from '../components/EventModal';
import EventFilters from '../components/EventFilters';

function CalendarView() {
  const { events } = useEvents();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter events based on selected category
  const filteredEvents = useMemo(() => {
    if (!selectedCategory) {
      return events;
    }
    return events.filter(event => event.category === selectedCategory);
  }, [selectedCategory, events]);
  
  // Get events for selected date
  const eventsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    
    // Format date as YYYY-MM-DD without timezone conversion
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return filteredEvents.filter(event => {
      if (event.isMultiDay && event.endDate) {
        return dateStr >= event.date && dateStr <= event.endDate;
      }
      return event.date === dateStr;
    });
  }, [selectedDate, filteredEvents]);
  
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };
  
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              NGO Calendar
            </h1>
            <p className="mt-2 text-gray-600">
              Stay informed about our upcoming events, activities, and meetings
            </p>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <EventFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <Calendar
              currentDate={currentDate}
              onDateClick={handleDateClick}
              events={filteredEvents}
              selectedDate={selectedDate}
            />
          </div>
          
          {/* Events List Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {selectedDate
                  ? `Events on ${selectedDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}`
                  : 'Select a date to view events'}
              </h2>
              
              {selectedDate ? (
                eventsForSelectedDate.length > 0 ? (
                  <div className="space-y-4">
                    {eventsForSelectedDate.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onClick={() => handleEventClick(event)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mt-2">No events scheduled for this date</p>
                  </div>
                )
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Click on a date in the calendar to view events</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* All Upcoming Events Section */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              All Upcoming Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents
                .filter(event => {
                  // Compare dates as strings (YYYY-MM-DD) to avoid timezone issues
                  const today = new Date();
                  const todayYear = today.getFullYear();
                  const todayMonth = String(today.getMonth() + 1).padStart(2, '0');
                  const todayDay = String(today.getDate()).padStart(2, '0');
                  const todayStr = `${todayYear}-${todayMonth}-${todayDay}`;
                  return event.date >= todayStr;
                })
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={() => handleEventClick(event)}
                  />
                ))}
            </div>
            {filteredEvents.filter(event => {
              const today = new Date();
              const todayYear = today.getFullYear();
              const todayMonth = String(today.getMonth() + 1).padStart(2, '0');
              const todayDay = String(today.getDate()).padStart(2, '0');
              const todayStr = `${todayYear}-${todayMonth}-${todayDay}`;
              return event.date >= todayStr;
            }).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No upcoming events found</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} NGO Calendar. All rights reserved.
          </p>
        </div>
      </footer>
      
      {/* Event Modal */}
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default CalendarView;
