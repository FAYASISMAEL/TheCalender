import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventsContext';
import { useAuth } from '../context/AuthContext';

function AdminPage() {
  const { addEvent, events, clearAllEvents } = useEvents();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    mapLink: '',
    category: 'Awareness',
    description: '',
    isMultiDay: false,
    endDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Set today's date as default
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, date: today }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (formData.isMultiDay && !formData.endDate) {
      newErrors.endDate = 'End date is required for multi-day events';
    }

    if (formData.isMultiDay && formData.endDate && formData.endDate < formData.date) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      // Ensure date is stored as YYYY-MM-DD without timezone conversion
      const eventData = {
        title: formData.title.trim(),
        date: formData.date, // Already in YYYY-MM-DD format from input
        startTime: formData.startTime || null,
        endTime: formData.endTime || null,
        location: formData.location.trim() || null,
        mapLink: formData.mapLink.trim() || null,
        category: formData.category,
        description: formData.description.trim() || null,
        isMultiDay: formData.isMultiDay,
        endDate: formData.isMultiDay ? formData.endDate : null, // Already in YYYY-MM-DD format
      };

      await addEvent(eventData);

      // Show success message
      setSubmitSuccess(true);

      // Reset form
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        title: '',
        date: today,
        startTime: '',
        endTime: '',
        location: '',
        mapLink: '',
        category: 'Awareness',
        description: '',
        isMultiDay: false,
        endDate: '',
      });

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error adding event:', error);
      setErrors({ submit: 'Failed to add event. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ['Awareness', 'Fundraising', 'Volunteering', 'Meeting'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Panel
              </h1>
              <p className="mt-2 text-gray-600">
                Manage events and activities
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                View Calendar
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Event added successfully! Changes are visible immediately.
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {errors.submit}
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Add New Event
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ngo-primary focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Community Health Awareness Day"
                required
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Date and Multi-day */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ngo-primary focus:border-transparent ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                )}
              </div>

              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isMultiDay"
                    checked={formData.isMultiDay}
                    onChange={handleChange}
                    className="w-4 h-4 text-ngo-primary border-gray-300 rounded focus:ring-ngo-primary"
                  />
                  <span className="text-sm font-medium text-gray-700">Multi-day event</span>
                </label>
                {formData.isMultiDay && (
                  <div className="mt-2">
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      min={formData.date}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ngo-primary focus:border-transparent ${
                        errors.endDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ngo-primary focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ngo-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ngo-primary focus:border-transparent"
                placeholder="e.g., Community Center, Main Street"
              />
            </div>

            {/* Map Link */}
            <div>
              <label htmlFor="mapLink" className="block text-sm font-medium text-gray-700 mb-2">
                Map Link <span className="text-gray-500 text-xs">(Optional)</span>
              </label>
              <input
                type="url"
                id="mapLink"
                name="mapLink"
                value={formData.mapLink}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ngo-primary focus:border-transparent"
                placeholder="e.g., https://maps.google.com/... or https://goo.gl/maps/..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Add a Google Maps link or any map URL. If not provided, location will open a Google Maps search.
              </p>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ngo-primary focus:border-transparent ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ngo-primary focus:border-transparent"
                placeholder="Provide details about the event..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-ngo-primary text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-ngo-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Adding...' : 'Add Event'}
              </button>
            </div>
          </form>
        </div>

        {/* Recent Events List */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Recent Events ({events.length})
            </h2>
            {events.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete all events? This action cannot be undone.')) {
                    clearAllEvents();
                  }
                }}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm font-medium"
              >
                Clear All Events
              </button>
            )}
          </div>
          <div className="space-y-3">
            {events
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 10)
              .map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{event.title}</h3>
                    <p className="text-sm text-gray-600">
                      {(() => {
                        // Parse YYYY-MM-DD format without timezone conversion
                        const [year, month, day] = event.date.split('-').map(Number);
                        const date = new Date(year, month - 1, day);
                        return date.toLocaleDateString();
                      })()} • {event.category}
                    </p>
                  </div>
                  <span className={`event-badge ${event.category.toLowerCase()}`}>
                    {event.category}
                  </span>
                </div>
              ))}
            {events.length === 0 && (
              <p className="text-center text-gray-500 py-8">No events yet. Add your first event above!</p>
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
    </div>
  );
}

export default AdminPage;
