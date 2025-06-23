import { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Textarea = forwardRef(({ 
  label, 
  error, 
  helpText, 
  rows = 4,
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  const textareaClasses = `
    w-full px-3 py-2 border rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
    resize-vertical
    ${error ? 'border-error' : 'border-gray-300'}
    ${props.disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'}
    ${className}
  `;

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        rows={rows}
        className={textareaClasses}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-error flex items-center gap-1">
          <ApperIcon name="AlertCircle" size={14} />
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;