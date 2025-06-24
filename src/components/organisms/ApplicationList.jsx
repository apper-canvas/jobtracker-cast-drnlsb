import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import SearchBar from '@/components/molecules/SearchBar';
import Select from '@/components/atoms/Select';
import jobApplicationService from '@/services/api/jobApplicationService';

const ApplicationList = ({ applications = [], onUpdate }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('appliedDate');
  const [sortOrder, setSortOrder] = useState('desc');

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'applied', label: 'Applied' },
    { value: 'phone_screen', label: 'Phone Screen' },
    { value: 'interviewed', label: 'Interviewed' },
    { value: 'offer', label: 'Offer' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const sortOptions = [
    { value: 'appliedDate', label: 'Applied Date' },
    { value: 'company', label: 'Company' },
    { value: 'title', label: 'Job Title' },
    { value: 'status', label: 'Status' }
  ];

  // Filter and sort applications
  const filteredApplications = applications
    .filter(app => {
      const matchesSearch = !searchTerm || 
        app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.location?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
.sort((a, b) => {
      let aValue = a[sortBy === 'appliedDate' ? 'applied_date' : sortBy] || a[sortBy];
      let bValue = b[sortBy === 'appliedDate' ? 'applied_date' : sortBy] || b[sortBy];
      
      if (sortBy === 'appliedDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleDelete = async (applicationId, event) => {
    event.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this application?')) {
      return;
    }

    try {
      await jobApplicationService.delete(applicationId);
      toast.success('Application deleted successfully');
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      toast.error('Failed to delete application');
    }
  };

  const handleStatusChange = async (applicationId, newStatus, event) => {
    event.stopPropagation();
    
    try {
      await jobApplicationService.update(applicationId, { status: newStatus });
      toast.success('Status updated successfully');
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return null;
    
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
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          placeholder="Search applications..."
          onSearch={setSearchTerm}
          className="flex-1"
        />
        
        <div className="flex gap-3">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-40"
            placeholder="Filter by status"
          />
          
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-36"
          />
          
          <Button
            variant="ghost"
            icon={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'}
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3"
          />
        </div>
      </div>

      {/* Application Cards */}
      <div className="space-y-4">
        {filteredApplications.map((application, index) => (
          <motion.div
            key={application.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              hover
              onClick={() => navigate(`/applications/${application.Id}`)}
              className="cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {application.title}
                      </h3>
                      <p className="text-gray-600 font-medium">{application.company}</p>
                    </div>
                    
                    <div className="flex items-center gap-3 ml-4">
                      <Badge variant={application.status}>
                        {application.status.replace('_', ' ')}
                      </Badge>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/applications/${application.Id}`);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Trash2"
                          onClick={(e) => handleDelete(application.Id, e)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-error hover:text-error"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                    {application.location && (
                      <div className="flex items-center gap-1">
                        <ApperIcon name="MapPin" size={14} />
                        <span>{application.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
<span>Applied {format(new Date(application.applied_date || application.appliedDate), 'MMM d, yyyy')}</span>
                    </div>
                    
{formatSalary({
                      min: application.salary_min,
                      max: application.salary_max,
                      currency: application.salary_currency
                    }) && (
                      <div className="flex items-center gap-1">
                        <ApperIcon name="DollarSign" size={14} />
                        <span>{formatSalary({
                          min: application.salary_min,
                          max: application.salary_max,
                          currency: application.salary_currency
                        })}</span>
                      </div>
                    )}
                  </div>

                  {application.notes && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {application.notes}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="Search" size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first job application to get started'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ApplicationList;