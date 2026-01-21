import React from 'react';

const EventCard = ({ event, onClick }) => {
  const formatDate = (dateStr) => {
    // Parse YYYY-MM-DD format without timezone conversion
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };
  
  const getCategoryColor = (category) => {
    const colors = {
      Awareness: 'awareness',
      Fundraising: 'fundraising',
      Volunteering: 'volunteering',
      Meeting: 'meeting'
    };
    return colors[category] || 'awareness';
  };
  
  const isUpcoming = () => {
    // Compare dates as strings to avoid timezone issues
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = String(today.getMonth() + 1).padStart(2, '0');
    const todayDay = String(today.getDate()).padStart(2, '0');
    const todayStr = `${todayYear}-${todayMonth}-${todayDay}`;
    return event.date >= todayStr;
  };
  
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer border-l-4 ${
        isUpcoming() ? 'border-l-green-500' : 'border-l-gray-300'
      }`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Event: ${event.title}. Click to view details`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800 flex-1 mr-2">
          {event.title}
        </h3>
        <span className={`event-badge ${getCategoryColor(event.category)} flex-shrink-0`}>
          {event.category}
        </span>
      </div>
      
      <div className="space-y-1 text-sm text-gray-600">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatDate(event.date)}</span>
          {event.isMultiDay && event.endDate && (
            <span className="ml-1">- {formatDate(event.endDate)}</span>
          )}
        </div>
        
        {(event.startTime || event.endTime) && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              {event.startTime && formatTime(event.startTime)}
              {event.endTime && ` - ${formatTime(event.endTime)}`}
            </span>
          </div>
        )}
        
        {event.location && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <a
              href={event.mapLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {event.location}
            </a>
          </div>
        )}
      </div>
      
      {event.isMultiDay && (
        <div className="mt-2 text-xs text-blue-600 font-medium">
          Multi-day event
        </div>
      )}
    </div>
  );
};

export default EventCard;
