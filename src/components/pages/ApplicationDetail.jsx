import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ReminderForm from "@/components/organisms/ReminderForm";
import documentService from "@/services/api/documentService";
import jobApplicationService from "@/services/api/jobApplicationService";
import reminderService from "@/services/api/reminderService";
import ApperIcon from "@/components/ApperIcon";
import Interview from "@/components/pages/Interview";
import Documents from "@/components/pages/Documents";
import SkeletonLoader from "@/components/molecules/SkeletonLoader";
import ErrorState from "@/components/molecules/ErrorState";
import ApplicationForm from "@/components/organisms/ApplicationForm";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);
  useEffect(() => {
    if (id) {
      loadApplicationData();
    }
  }, [id]);

  const loadApplicationData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [appData, docsData, remindersData] = await Promise.all([
        jobApplicationService.getById(id),
        documentService.getByApplicationId(id),
        reminderService.getByApplicationId(id)
      ]);

      setApplication(appData);
      setDocuments(docsData);
      setReminders(remindersData);
    } catch (err) {
      setError(err.message || 'Failed to load application details');
      toast.error('Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      return;
    }

    try {
      await jobApplicationService.delete(id);
      toast.success('Application deleted successfully');
      navigate('/applications');
    } catch (error) {
      toast.error('Failed to delete application');
    }
  };

const handleEditSuccess = () => {
    setIsEditing(false);
    loadApplicationData();
  };

  const handleReminderSuccess = () => {
    setShowReminderForm(false);
    loadApplicationData();
  };

  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return 'Not specified';
    
    const currency = salary.currency || 'USD';
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

    if (salary.min && salary.max) {
      return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}`;
    } else if (salary.min) {
      return `${formatter.format(salary.min)}+`;
    } else if (salary.max) {
      return `Up to ${formatter.format(salary.max)}`;
    }
    
    return 'Not specified';
  };

  const getReminderIcon = (type) => {
    switch (type) {
      case 'interview': return 'Users';
      case 'follow_up': return 'MessageCircle';
      case 'deadline': return 'Clock';
      default: return 'Bell';
    }
  };

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'resume': return 'FileText';
      case 'cover_letter': return 'Mail';
      case 'portfolio': return 'Folder';
      default: return 'File';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="flex gap-3">
            <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
        </div>
        <SkeletonLoader count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          title="Failed to Load Application"
          message={error}
          onRetry={loadApplicationData}
        />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="p-6">
        <ErrorState 
          title="Application Not Found"
          message="The application you're looking for doesn't exist or has been deleted."
        />
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Application</h1>
            <p className="text-gray-600 mt-1">Update your job application details</p>
          </div>
          
          <Button
            variant="secondary"
            onClick={() => setIsEditing(false)}
            icon="X"
          >
            Cancel
          </Button>
        </div>

        <ApplicationForm
          applicationId={id}
          onSuccess={handleEditSuccess}
          onCancel={() => setIsEditing(false)}
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
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              size="sm"
              icon="ArrowLeft"
              onClick={() => navigate('/applications')}
              className="flex-shrink-0"
            >
              Back
            </Button>
            <Badge variant={application.status}>
              {application.status.replace('_', ' ')}
            </Badge>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {application.title}
          </h1>
          <p className="text-xl text-gray-600">{application.company}</p>
        </div>
        
        <div className="flex items-center gap-3 ml-4">
          <Button
            variant="outline"
            icon="Edit"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
          
          <Button
            variant="outline"
            icon="Trash2"
            onClick={handleDelete}
            className="text-error hover:text-error border-error hover:border-error"
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <p className="text-gray-900">{application.title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <p className="text-gray-900">{application.company}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Badge variant={application.status}>
                  {application.status.replace('_', ' ')}
                </Badge>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Applied Date
                </label>
                <p className="text-gray-900">
                  {format(new Date(application.appliedDate), 'MMMM d, yyyy')}
                </p>
              </div>

              {application.location && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <p className="text-gray-900 flex items-center gap-1">
                    <ApperIcon name="MapPin" size={14} />
                    {application.location}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary Range
                </label>
                <p className="text-gray-900 flex items-center gap-1">
                  <ApperIcon name="DollarSign" size={14} />
                  {formatSalary(application.salary)}
                </p>
              </div>
            </div>

            {application.jobUrl && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Posting
                </label>
                <a
                  href={application.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <ApperIcon name="ExternalLink" size={16} />
                  View Original Posting
                </a>
              </div>
            )}
          </Card>

          {/* Notes */}
          {application.notes && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{application.notes}</p>
              </div>
            </Card>
          )}

          {/* Documents */}
          {documents.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Related Documents ({documents.length})
              </h2>
              
              <div className="space-y-3">
                {documents.map((document) => (
                  <div
                    key={document.Id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ApperIcon 
                        name={getDocumentIcon(document.type)} 
                        size={20} 
                        className="text-gray-400" 
                      />
                      <div>
                        <p className="font-medium text-gray-900">{document.filename}</p>
                        <p className="text-sm text-gray-500">
                          Version {document.version} • 
                          {document.type.replace('_', ' ')} • 
                          Uploaded {format(new Date(document.uploadDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Eye"
                        onClick={() => toast.info('Preview functionality would be implemented here')}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Download"
                        onClick={() => toast.info('Download functionality would be implemented here')}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Timeline</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">Application Created</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(application.createdAt || application.appliedDate), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
              
              {application.updatedAt && application.updatedAt !== application.createdAt && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-secondary rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Last Updated</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(application.updatedAt), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Reminders */}
          {reminders.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Reminders ({reminders.length})
              </h2>
              
              <div className="space-y-3">
                {reminders.map((reminder) => (
                  <div
                    key={reminder.Id}
                    className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg"
                  >
                    <ApperIcon 
                      name={getReminderIcon(reminder.type)} 
                      size={16} 
                      className="text-primary mt-0.5" 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {reminder.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(reminder.date), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="Calendar"
                onClick={() => navigate('/calendar')}
              >
                Schedule Interview
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="FileText"
                onClick={() => navigate('/documents')}
              >
                Upload Documents
              </Button>
              
<Button
                variant="outline"
                className="w-full justify-start"
                icon="Bell"
                onClick={() => setShowReminderForm(true)}
              >
                Add Reminder
              </Button>
            </div>
</Card>
        </div>
      </div>

      {/* Reminder Form Modal */}
      {showReminderForm && (
        <ReminderForm
          applicationId={id}
          onSuccess={handleReminderSuccess}
          onCancel={() => setShowReminderForm(false)}
        />
      )}
    </motion.div>
  );
};

export default ApplicationDetail;