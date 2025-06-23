import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import ApplicationList from '@/components/organisms/ApplicationList';
import ApplicationForm from '@/components/organisms/ApplicationForm';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import jobApplicationService from '@/services/api/jobApplicationService';

const Applications = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await jobApplicationService.getAll();
      setApplications(data);
    } catch (err) {
      setError(err.message || 'Failed to load applications');
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    loadApplications();
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
        <SkeletonLoader count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          title="Failed to Load Applications"
          message={error}
          onRetry={loadApplications}
        />
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">New Application</h1>
            <p className="text-gray-600 mt-1">Add a new job application to track</p>
          </div>
          
          <Button
            variant="secondary"
            onClick={() => setShowForm(false)}
            icon="X"
          >
            Cancel
          </Button>
        </div>

        <ApplicationForm
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
            <p className="text-gray-600 mt-1">Track and manage your job applications</p>
          </div>
        </div>

        <EmptyState
          icon="Briefcase"
          title="No applications yet"
          description="Start tracking your job search by adding your first application. Keep all your opportunities organized in one place."
          actionLabel="Add First Application"
          onAction={() => setShowForm(true)}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
          <p className="text-gray-600 mt-1">
            {applications.length} application{applications.length !== 1 ? 's' : ''} tracked
          </p>
        </div>
        
        <Button
          onClick={() => setShowForm(true)}
          variant="primary"
          icon="Plus"
        >
          New Application
        </Button>
      </div>

      {/* Applications List */}
      <ApplicationList 
        applications={applications}
        onUpdate={loadApplications}
      />
    </motion.div>
  );
};

export default Applications;