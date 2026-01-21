import React from 'react';

const EventFilters = ({ 
  selectedCategory, 
  onCategoryChange, 
  currentDate, 
  onDateChange 
}) => {
  const categories = ['All', 'Awareness', 'Fundraising', 'Volunteering', 'Meeting'];
  
  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onDateChange(newDate);
  };
  
  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onDateChange(newDate);
  };
  
  const handleToday = () => {
    onDateChange(new Date());
  };
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6" role="region" aria-label="Event filters">
      {/* Category Filter */}
      <div className="mb-6">
        <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Event Type
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Event category filter">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category === 'All' ? null : category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                (selectedCategory === category) || (selectedCategory === null && category === 'All')
                  ? 'bg-ngo-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-pressed={(selectedCategory === category) || (selectedCategory === null && category === 'All')}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Date Navigation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Navigate Calendar
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={handlePreviousMonth}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-ngo-primary focus:ring-offset-2"
            aria-label="Previous month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex-1 text-center">
            <span className="text-lg font-semibold text-gray-800">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
          </div>
          
          <button
            onClick={handleNextMonth}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-ngo-primary focus:ring-offset-2"
            aria-label="Next month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <button
            onClick={handleToday}
            className="ml-4 px-4 py-2 bg-ngo-secondary text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-ngo-secondary focus:ring-offset-2"
            aria-label="Go to today"
          >
            Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventFilters;
