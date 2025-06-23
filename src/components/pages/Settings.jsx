import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';

const Settings = () => {
  const [settings, setSettings] = useState({
    profile: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA'
    },
    preferences: {
      emailNotifications: true,
      reminderFrequency: 'daily',
      defaultSalaryCurrency: 'USD',
      dateFormat: 'MM/dd/yyyy'
    },
    privacy: {
      dataRetention: '12',
      analytics: true,
      publicProfile: false
    }
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'preferences', label: 'Preferences', icon: 'Settings' },
    { id: 'privacy', label: 'Privacy', icon: 'Shield' },
    { id: 'data', label: 'Data', icon: 'Database' }
  ];

  const reminderOptions = [
    { value: 'none', label: 'None' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const currencyOptions = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'CAD', label: 'CAD (C$)' }
  ];

  const dateFormatOptions = [
    { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY' },
    { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY' },
    { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD' }
  ];

  const retentionOptions = [
    { value: '6', label: '6 months' },
    { value: '12', label: '1 year' },
    { value: '24', label: '2 years' },
    { value: 'never', label: 'Never delete' }
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleExportData = () => {
    toast.success('Data export started. You will receive an email when ready.');
  };

  const handleDeleteData = () => {
    if (window.confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      toast.success('Data deletion scheduled. You will receive a confirmation email.');
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={settings.profile.name}
            onChange={(e) => handleInputChange('profile', 'name', e.target.value)}
          />
          <Input
            label="Email Address"
            type="email"
            value={settings.profile.email}
            onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
          />
          <Input
            label="Phone Number"
            value={settings.profile.phone}
            onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
          />
          <Input
            label="Location"
            value={settings.profile.location}
            onChange={(e) => handleInputChange('profile', 'location', e.target.value)}
            placeholder="City, State/Country"
          />
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Email Notifications</label>
              <p className="text-sm text-gray-500">Receive updates about your applications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.preferences.emailNotifications}
                onChange={(e) => handleInputChange('preferences', 'emailNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <Select
            label="Reminder Frequency"
            value={settings.preferences.reminderFrequency}
            onChange={(e) => handleInputChange('preferences', 'reminderFrequency', e.target.value)}
            options={reminderOptions}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Default Currency"
            value={settings.preferences.defaultSalaryCurrency}
            onChange={(e) => handleInputChange('preferences', 'defaultSalaryCurrency', e.target.value)}
            options={currencyOptions}
          />
          <Select
            label="Date Format"
            value={settings.preferences.dateFormat}
            onChange={(e) => handleInputChange('preferences', 'dateFormat', e.target.value)}
            options={dateFormatOptions}
          />
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
        <div className="space-y-4">
          <Select
            label="Data Retention Period"
            value={settings.privacy.dataRetention}
            onChange={(e) => handleInputChange('privacy', 'dataRetention', e.target.value)}
            options={retentionOptions}
            helpText="How long to keep your application data"
          />
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Usage Analytics</label>
              <p className="text-sm text-gray-500">Help improve the app by sharing anonymous usage data</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.analytics}
                onChange={(e) => handleInputChange('privacy', 'analytics', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Public Profile</label>
              <p className="text-sm text-gray-500">Allow others to view your public profile</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.publicProfile}
                onChange={(e) => handleInputChange('privacy', 'publicProfile', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Export</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <ApperIcon name="Download" size={20} className="text-gray-400 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Export Your Data</h4>
              <p className="text-sm text-gray-600 mt-1">
                Download a copy of all your application data, documents, and settings.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                icon="Download"
                onClick={handleExportData}
              >
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-error mb-4">Danger Zone</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <ApperIcon name="AlertTriangle" size={20} className="text-error mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-error">Delete All Data</h4>
              <p className="text-sm text-red-600 mt-1">
                Permanently delete all your applications, documents, and account data. This action cannot be undone.
              </p>
              <Button
                variant="error"
                size="sm"
                className="mt-3"
                icon="Trash2"
                onClick={handleDeleteData}
              >
                Delete All Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileTab();
      case 'preferences': return renderPreferencesTab();
      case 'privacy': return renderPrivacyTab();
      case 'data': return renderDataTab();
      default: return renderProfileTab();
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card padding="sm">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ApperIcon name={tab.icon} size={18} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <Card>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>

            {/* Save Button */}
            {activeTab !== 'data' && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-end">
                  <Button
                    onClick={handleSave}
                    loading={saving}
                    variant="primary"
                    icon="Save"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;