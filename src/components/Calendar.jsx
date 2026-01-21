import React from 'react';

const Calendar = ({ currentDate, onDateClick, events, selectedDate }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();
  
  const today = new Date();
  const isToday = (day) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };
  
  const isSelected = (day) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
  };
  
  const getEventsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => {
      if (event.isMultiDay && event.endDate) {
        return dateStr >= event.date && dateStr <= event.endDate;
      }
      return event.date === dateStr;
    });
  };
  
  const isUpcoming = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    // Format today's date as YYYY-MM-DD without timezone conversion
    const todayYear = today.getFullYear();
    const todayMonth = String(today.getMonth() + 1).padStart(2, '0');
    const todayDay = String(today.getDate()).padStart(2, '0');
    const todayStr = `${todayYear}-${todayMonth}-${todayDay}`;
    return dateStr >= todayStr;
  };
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const days = [];
  
  // Previous month's days
  const prevMonth = new Date(year, month, 0);
  const daysInPrevMonth = prevMonth.getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, daysInPrevMonth - i)
    });
  }
  
  // Current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      day,
      isCurrentMonth: true,
      date: new Date(year, month, day)
    });
  }
  
  // Next month's days to fill the grid
  const remainingDays = 42 - days.length; // 6 rows × 7 days
  for (let day = 1; day <= remainingDays; day++) {
    days.push({
      day,
      isCurrentMonth: false,
      date: new Date(year, month + 1, day)
    });
  }
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6" role="application" aria-label="Calendar">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {monthNames[month]} {year}
        </h2>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((dayName) => (
          <div
            key={dayName}
            className="text-center text-sm font-semibold text-gray-600 py-2"
            role="columnheader"
          >
            {dayName}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map(({ day, isCurrentMonth, date }, index) => {
          const dayEvents = isCurrentMonth ? getEventsForDay(day) : [];
          const todayClass = isCurrentMonth && isToday(day) ? 'today' : '';
          const otherMonthClass = !isCurrentMonth ? 'other-month' : '';
          const selectedClass = isCurrentMonth && isSelected(day) ? 'ring-2 ring-ngo-primary ring-offset-2' : '';
          const upcomingClass = isCurrentMonth && isUpcoming(day) && !isToday(day) ? 'border-l-4 border-l-green-500' : '';
          
          return (
            <div
              key={index}
              className={`calendar-day ${todayClass} ${otherMonthClass} ${selectedClass} ${upcomingClass} ${
                isCurrentMonth ? 'cursor-pointer' : 'cursor-default'
              }`}
              onClick={() => isCurrentMonth && onDateClick(date)}
              onKeyDown={(e) => {
                if (isCurrentMonth && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onDateClick(date);
                }
              }}
              tabIndex={isCurrentMonth ? 0 : -1}
              role="gridcell"
              aria-label={`${isCurrentMonth ? monthNames[month] : ''} ${day}, ${year}. ${dayEvents.length} events`}
              aria-selected={isCurrentMonth && isSelected(day)}
            >
              <div className="text-sm font-medium mb-1">{day}</div>
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className={`event-badge ${event.category.toLowerCase()}`}
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500 font-medium">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
