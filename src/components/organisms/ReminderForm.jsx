import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import reminderService from '@/services/api/reminderService';
import FormField from '@/components/molecules/FormField';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';

const ReminderForm = ({ applicationId, onSuccess, onCancel, reminderId = null }) => {
  const [formData, setFormData] = useState({
    message: '',
    date: '',
    type: 'follow_up',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const typeOptions = [
    { value: 'interview', label: 'Interview' },
    { value: 'follow_up', label: 'Follow Up' },
    { value: 'deadline', label: 'Deadline' },
    { value: 'phone_screen', label: 'Phone Screen' },
    { value: 'thank_you', label: 'Thank You Note' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.message.trim()) {
      newErrors.message = 'Reminder message is required';
    }

    if (!formData.date) {
      newErrors.date = 'Reminder date and time is required';
    } else {
      const selectedDate = new Date(formData.date);
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.date = 'Reminder date must be in the future';
      }
    }

    if (!formData.type) {
      newErrors.type = 'Reminder type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setLoading(true);

    try {
      const reminderData = {
        ...formData,
        applicationId: parseInt(applicationId, 10),
        date: new Date(formData.date).toISOString()
      };

      if (reminderId) {
        await reminderService.update(reminderId, reminderData);
        toast.success('Reminder updated successfully');
      } else {
        await reminderService.create(reminderData);
        toast.success('Reminder created successfully');
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving reminder:', error);
      toast.error(error.message || 'Failed to save reminder');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onCancel?.()}
    >
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {reminderId ? 'Edit Reminder' : 'Add New Reminder'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            icon="X"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            label="Reminder Message"
            error={errors.message}
            required
          >
            <Textarea
              placeholder="Enter reminder message..."
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              rows={3}
              className={errors.message ? 'border-error focus:border-error focus:ring-error' : ''}
            />
          </FormField>

          <FormField
            label="Date & Time"
            error={errors.date}
            required
          >
            <Input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className={errors.date ? 'border-error focus:border-error focus:ring-error' : ''}
            />
          </FormField>

          <FormField
            label="Reminder Type"
            error={errors.type}
            required
          >
            <Select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className={errors.type ? 'border-error focus:border-error focus:ring-error' : ''}
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Priority"
            error={errors.priority}
          >
            <Select
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormField>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              icon={reminderId ? "Save" : "Plus"}
            >
              {reminderId ? 'Update Reminder' : 'Add Reminder'}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default ReminderForm;