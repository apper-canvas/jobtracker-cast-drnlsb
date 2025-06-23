import { motion } from 'framer-motion';
import Badge from '@/components/atoms/Badge';

const StatusPipeline = ({ applications = [], onStatusClick }) => {
  const statusConfig = {
    applied: { label: 'Applied', color: 'applied', icon: 'Send' },
    phone_screen: { label: 'Phone Screen', color: 'phone_screen', icon: 'Phone' },
    interviewed: { label: 'Interviewed', color: 'interviewed', icon: 'Users' },
    offer: { label: 'Offer', color: 'offer', icon: 'CheckCircle' },
    rejected: { label: 'Rejected', color: 'rejected', icon: 'XCircle' }
  };

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-wrap gap-4 lg:gap-6">
      {Object.entries(statusConfig).map(([status, config], index) => {
        const count = statusCounts[status] || 0;
        
        return (
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex-1 min-w-0"
          >
            <button
              onClick={() => onStatusClick && onStatusClick(status)}
              className="w-full bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant={config.color} icon={config.icon}>
                  {config.label}
                </Badge>
                <span className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                  {count}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {count === 1 ? 'application' : 'applications'}
              </div>
            </button>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatusPipeline;