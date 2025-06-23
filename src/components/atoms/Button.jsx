import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ children, variant = 'primary', size = 'md', icon, iconPosition = 'left', disabled = false, loading = false, className = '', ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 focus:ring-primary/50 shadow-sm",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary/50",
    outline: "border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500/50",
    success: "bg-success text-white hover:bg-success/90 focus:ring-success/50 shadow-sm",
    warning: "bg-warning text-white hover:bg-warning/90 focus:ring-warning/50 shadow-sm",
    error: "bg-error text-white hover:bg-error/90 focus:ring-error/50 shadow-sm"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  const disabledClasses = disabled || loading ? "opacity-50 cursor-not-allowed" : "";

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`;

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 20 : 18;

  const renderIcon = (iconName) => (
    loading ? (
      <ApperIcon name="Loader2" size={iconSize} className="animate-spin" />
    ) : (
      <ApperIcon name={iconName} size={iconSize} />
    )
  );

  return (
    <motion.button
      whileHover={disabled || loading ? {} : { scale: 1.02 }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className={children ? 'mr-2' : ''}>
          {renderIcon(icon)}
        </span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className={children ? 'ml-2' : ''}>
          {renderIcon(icon)}
        </span>
      )}
    </motion.button>
  );
};

export default Button;