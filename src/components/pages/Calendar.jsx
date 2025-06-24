import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { addMonths, eachDayOfInterval, endOfMonth, format, isSameDay, isSameMonth, isToday, startOfMonth, subMonths } from "date-fns";
import { getScheduledInterviews, scheduleInterview } from "@/services/api/interviewService";
import jobApplicationService from "@/services/api/jobApplicationService";
import reminderService from "@/services/api/reminderService";
import ApperIcon from "@/components/ApperIcon";
import Interview from "@/components/pages/Interview";
import SkeletonLoader from "@/components/molecules/SkeletonLoader";
import EmptyState from "@/components/molecules/EmptyState";
import ErrorState from "@/components/molecules/ErrorState";
import ReminderForm from "@/components/organisms/ReminderForm";
import Textarea from "@/components/atoms/Textarea";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reminders, setReminders] = useState([]);
  const [applications, setApplications] = useState([]);
  const [scheduledInterviews, setScheduledInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [interviewFormData, setInterviewFormData] = useState({
    title: '',
    company: '',
    position: '',
    date: '',
    time: '',
    location: '',
    interviewerName: '',
    interviewerEmail: '',
    notes: ''
  });
  const [interviewFormLoading, setInterviewFormLoading] = useState(false);
  useEffect(() => {
    loadCalendarData();
  }, []);

  const loadCalendarData = async () => {
    setLoading(true);
    setError(null);
    
try {
      const [remindersData, applicationsData, interviewsData] = await Promise.all([
        reminderService.getAll(),
        jobApplicationService.getAll(),
        getScheduledInterviews()
      ]);
      
      setReminders(remindersData);
      setApplications(applicationsData);
      setScheduledInterviews(interviewsData);
    } catch (err) {
      setError(err.message || 'Failed to load calendar data');
      toast.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => 
      direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1)
    );
  };

const getEventsForDate = (date) => {
    const events = [];
    
    // Add reminders
    reminders.forEach(reminder => {
      if (isSameDay(new Date(reminder.date), date)) {
        events.push({
          ...reminder,
          type: 'reminder',
          eventType: reminder.type
        });
      }
    });
    
    // Add application dates
    applications.forEach(application => {
      if (isSameDay(new Date(application.appliedDate), date)) {
        events.push({
          ...application,
          type: 'application',
          eventType: 'applied'
        });
      }
    });
    
    // Add scheduled interviews
    scheduledInterviews.forEach(interview => {
      if (isSameDay(new Date(interview.date), date)) {
        events.push({
          ...interview,
          type: 'interview',
          eventType: 'interview'
        });
      }
    });
    
    return events;
  };

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'interview': return 'Users';
      case 'follow_up': return 'MessageCircle';
      case 'deadline': return 'Clock';
      case 'applied': return 'Send';
      default: return 'Bell';
    }
  };

  const getEventColor = (eventType) => {
    switch (eventType) {
      case 'interview': return 'primary';
      case 'follow_up': return 'warning';
      case 'deadline': return 'error';
      case 'applied': return 'info';
      default: return 'default';
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad the calendar to start on Sunday
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - monthStart.getDay());
  
  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));
  
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 rounded w-10 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-10 animate-pulse"></div>
          </div>
        </div>
        <SkeletonLoader count={1} className="h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600 mt-1">Track your application dates and upcoming events</p>
        </div>

<ErrorState 
          title="Failed to Load Calendar"
          message={error}
          onRetry={loadCalendarData}
        />
      </div>
    );
  }

  const handleInterviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!interviewFormData.title || !interviewFormData.company || !interviewFormData.date || !interviewFormData.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    setInterviewFormLoading(true);
    try {
      await scheduleInterview(interviewFormData);
      toast.success('Interview scheduled successfully!');
      setShowInterviewForm(false);
      setInterviewFormData({
        title: '',
        company: '',
        position: '',
        date: '',
        time: '',
        location: '',
        interviewerName: '',
        interviewerEmail: '',
        notes: ''
      });
      loadCalendarData();
    } catch (err) {
      toast.error(err.message || 'Failed to schedule interview');
    } finally {
      setInterviewFormLoading(false);
    }
  };

  const handleInterviewFormChange = (field, value) => {
    setInterviewFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600 mt-1">Track your application dates and upcoming events</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <Card>
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon="ChevronLeft"
                  onClick={() => navigateMonth('prev')}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon="ChevronRight"
                  onClick={() => navigateMonth('next')}
                />
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {allDays.map(day => {
                const dayEvents = getEventsForDate(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isDayToday = isToday(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);

                return (
                  <motion.button
                    key={day.toISOString()}
                    whileHover={{ scale: 0.95 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      p-2 min-h-[80px] text-left border rounded-lg transition-all duration-200
                      ${isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 text-gray-400'}
                      ${isDayToday ? 'border-primary bg-primary/5' : 'border-gray-200'}
                      ${isSelected ? 'ring-2 ring-primary' : ''}
                      ${dayEvents.length > 0 ? 'hover:shadow-sm' : ''}
                    `}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${
                        isDayToday ? 'text-primary' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {format(day, 'd')}
                      </span>
                      {dayEvents.length > 0 && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event, index) => (
                        <div
                          key={`${event.type}-${event.Id}-${index}`}
                          className={`text-xs px-1 py-0.5 rounded truncate ${
event.type === 'reminder' 
                              ? 'bg-primary/10 text-primary' 
                              : event.type === 'interview'
                                ? 'bg-warning/10 text-warning'
                                : 'bg-info/10 text-info'
                          }`}
                        >
                          {event.type === 'reminder' 
                            ? event.message 
                            : event.type === 'interview'
                              ? event.title
                              : `Applied: ${event.title}`}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </Card>
        </div>

{/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Events */}
          {selectedDate && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {format(selectedDate, 'MMMM d, yyyy')}
              </h3>
              
              {(() => {
                const selectedDateEvents = getEventsForDate(selectedDate);
                return selectedDateEvents.length === 0 ? (
<div className="text-center py-6">
                  <ApperIcon name="Calendar" size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No events this day</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateEvents.map((event, index) => (
                    <div
                      key={`${event.type}-${event.Id}-${index}`}
                      className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg"
                    >
                      <ApperIcon 
                        name={getEventIcon(event.eventType)} 
                        size={16} 
                        className="text-primary mt-0.5" 
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {event.type === 'reminder' 
                            ? event.message 
                            : event.type === 'interview'
                              ? event.title
                              : `Applied: ${event.title}`}
                        </p>
                        {(event.type === 'application' || event.type === 'interview') && (
                          <p className="text-xs text-gray-500 mt-1">
                            {event.company}
                            {event.type === 'interview' && event.time && ` at ${event.time}`}
                          </p>
                        )}
                      </div>
                      <Badge variant={getEventColor(event.eventType)} size="sm">
                        {event.eventType.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              );
              })()}
            </Card>
          )}

          {/* Upcoming Events */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
            
            {reminders.length === 0 ? (
              <EmptyState
                icon="Calendar"
                title="No upcoming events"
                description="Your scheduled interviews and reminders will appear here."
                className="py-4"
              />
            ) : (
              <div className="space-y-3">
                {reminders
                  .filter(reminder => new Date(reminder.date) >= new Date())
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .slice(0, 5)
                  .map((reminder) => (
                    <div
                      key={reminder.Id}
                      className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <ApperIcon 
                        name={getEventIcon(reminder.type)} 
                        size={16} 
                        className="text-primary mt-0.5" 
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {reminder.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(reminder.date), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
<Button
                variant="outline"
                className="w-full justify-start"
                icon="Plus"
                onClick={() => setShowReminderForm(true)}
              >
                Add Reminder
              </Button>
<Button
                variant="outline"
                className="w-full justify-start"
                icon="Users"
                onClick={() => setShowInterviewForm(true)}
              >
                Schedule Interview
              </Button>
            </div>
          </Card>
</div>
      </div>

      {/* Reminder Form Modal */}
{/* Reminder Form Modal */}
      {showReminderForm && (
        <ReminderForm
          onSuccess={() => {
            setShowReminderForm(false);
            loadCalendarData();
          }}
          onCancel={() => setShowReminderForm(false)}
        />
      )}

      {/* Interview Scheduling Form Modal */}
      {showInterviewForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowInterviewForm(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Schedule Interview</h2>
              <button
                onClick={() => setShowInterviewForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <form onSubmit={handleInterviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interview Title *
                </label>
                <Input
                  type="text"
                  value={interviewFormData.title}
                  onChange={(e) => handleInterviewFormChange('title', e.target.value)}
                  placeholder="e.g., Frontend Developer Interview"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company *
                </label>
                <Input
                  type="text"
                  value={interviewFormData.company}
                  onChange={(e) => handleInterviewFormChange('company', e.target.value)}
                  placeholder="Company name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <Input
                  type="text"
                  value={interviewFormData.position}
                  onChange={(e) => handleInterviewFormChange('position', e.target.value)}
                  placeholder="Job position"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <Input
                    type="date"
                    value={interviewFormData.date}
                    onChange={(e) => handleInterviewFormChange('date', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time *
                  </label>
                  <Input
                    type="time"
                    value={interviewFormData.time}
                    onChange={(e) => handleInterviewFormChange('time', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <Input
                  type="text"
                  value={interviewFormData.location}
                  onChange={(e) => handleInterviewFormChange('location', e.target.value)}
                  placeholder="Office address or meeting link"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interviewer Name
                </label>
                <Input
                  type="text"
                  value={interviewFormData.interviewerName}
                  onChange={(e) => handleInterviewFormChange('interviewerName', e.target.value)}
                  placeholder="Interviewer's name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interviewer Email
                </label>
                <Input
                  type="email"
                  value={interviewFormData.interviewerEmail}
                  onChange={(e) => handleInterviewFormChange('interviewerEmail', e.target.value)}
                  placeholder="interviewer@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <Textarea
                  value={interviewFormData.notes}
                  onChange={(e) => handleInterviewFormChange('notes', e.target.value)}
                  placeholder="Additional notes about the interview..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowInterviewForm(false)}
                  disabled={interviewFormLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={interviewFormLoading}
                  disabled={interviewFormLoading}
                >
                  Schedule Interview
                </Button>
              </div>
            </form>
</motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Calendar;