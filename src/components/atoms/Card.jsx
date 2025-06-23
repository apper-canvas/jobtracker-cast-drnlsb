import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = false, padding = 'md', ...props }) => {
  const baseClasses = "bg-white rounded-xl shadow-sm border border-gray-200";
  
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  };

  const hoverClasses = hover ? "hover:shadow-md hover:-translate-y-1 cursor-pointer" : "";
  
  const cardClasses = `${baseClasses} ${paddings[padding]} ${hoverClasses} ${className}`;

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
        transition={{ duration: 0.2 }}
        className={cardClasses}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;