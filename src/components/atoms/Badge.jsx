import ApperIcon from '@/components/ApperIcon';

const Badge = ({ children, variant = 'default', size = 'md', icon, className = '', ...props }) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
    info: "bg-info/10 text-info",
    applied: "bg-blue-100 text-blue-800",
    phone_screen: "bg-yellow-100 text-yellow-800",
    interviewed: "bg-purple-100 text-purple-800",
    offer: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base"
  };

  const badgeClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 14;

  return (
    <span className={badgeClasses} {...props}>
      {icon && (
        <ApperIcon name={icon} size={iconSize} className="mr-1" />
      )}
      {children}
    </span>
  );
};

export default Badge;