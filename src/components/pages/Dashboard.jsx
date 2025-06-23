import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import StatusPipeline from '@/components/molecules/StatusPipeline';
import ProgressRing from '@/components/molecules/ProgressRing';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import jobApplicationService from '@/services/api/jobApplicationService';
import reminderService from '@/services/api/reminderService';
import { format, isToday, isTomorrow } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [applicationsData, remindersData] = await Promise.all([
        jobApplicationService.getAll(),
        reminderService.getUpcoming(7)
      ]);
      
      setApplications(applicationsData);
      setReminders(remindersData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusCounts = () => {
    return applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});
  };

  const getSuccessRate = () => {
    if (applications.length === 0) return 0;
    const successfulStatuses = ['interviewed', 'offer'];
    const successCount = applications.filter(app => 
      successfulStatuses.includes(app.status)
    ).length;
    return Math.round((successCount / applications.length) * 100);
  };

  const getRecentApplications = () => {
    return applications
      .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
      .slice(0, 5);
  };

  const formatReminderDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const getReminderIcon = (type) => {
    switch (type) {
      case 'interview': return 'Users';
      case 'follow_up': return 'MessageCircle';
      case 'deadline': return 'Clock';
      default: return 'Bell';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <SkeletonLoader key={i} type="card" />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonLoader type="card" />
          <SkeletonLoader type="card" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          title="Dashboard Error"
          message={error}
          onRetry={loadDashboardData}
        />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          icon="Briefcase"
          title="Welcome to JobTracker Pro"
          description="Start tracking your job applications and improve your success rate with organized data and insights."
          actionLabel="Add First Application"
          onAction={() => navigate('/applications')}
        />
      </div>
    );
  }

  const statusCounts = getStatusCounts();
  const successRate = getSuccessRate();
  const recentApplications = getRecentApplications();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your job search progress</p>
        </div>
        
        <Button
          onClick={() => navigate('/applications')}
          variant="primary"
          icon="Plus"
        >
          New Application
        </Button>
      </div>

      {/* Status Pipeline */}
      <StatusPipeline 
        applications={applications}
        onStatusClick={(status) => navigate('/applications', { state: { statusFilter: status } })}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {applications.length}
            </div>
            <div className="text-gray-600">Total Applications</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="text-center">
            <div className="text-3xl font-bold text-success mb-2">
              {statusCounts.offer || 0}
            </div>
            <div className="text-gray-600">Job Offers</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="text-center">
            <div className="text-3xl font-bold text-info mb-2">
              {statusCounts.interviewed || 0}
            </div>
            <div className="text-gray-600">Interviews</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="text-center flex items-center justify-center">
            <div className="flex items-center gap-4">
              <ProgressRing 
                progress={successRate} 
                size={60} 
                strokeWidth={6}
                color="#00D4AA"
                showPercentage={false}
              />
              <div className="text-left">
                <div className="text-2xl font-bold text-success">{successRate}%</div>
                <div className="text-gray-600 text-sm">Success Rate</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/applications')}
              >
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {recentApplications.map((application, index) => (
                <motion.div
                  key={application.Id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + (index * 0.1) }}
                  onClick={() => navigate(`/applications/${application.Id}`)}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {application.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-gray-600">{application.company}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-500">
                        {format(new Date(application.appliedDate), 'MMM d')}
                      </span>
                    </div>
                  </div>
                  
                  <Badge variant={application.status}>
                    {application.status.replace('_', ' ')}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Upcoming Reminders */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Reminders</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/calendar')}
              >
                View Calendar
              </Button>
            </div>

            {reminders.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Calendar" size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No upcoming reminders</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reminders.slice(0, 5).map((reminder, index) => (
                  <motion.div
                    key={reminder.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + (index * 0.1) }}
                    className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <ApperIcon 
                        name={getReminderIcon(reminder.type)} 
                        size={16} 
                        className="text-primary" 
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {reminder.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatReminderDate(reminder.date)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;