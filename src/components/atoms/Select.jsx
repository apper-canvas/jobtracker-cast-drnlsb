import { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Select = forwardRef(({ 
  label, 
  error, 
  helpText, 
  options = [],
  placeholder = 'Select an option',
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  const selectClasses = `
    w-full px-3 py-2 pr-10 border rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
    appearance-none bg-white
    ${error ? 'border-error' : 'border-gray-300'}
    ${props.disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
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
      
      <div className="relative">
        <select
          ref={ref}
          className={selectClasses}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ApperIcon name="ChevronDown" size={18} className="text-gray-400" />
        </div>
      </div>
      
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

Select.displayName = 'Select';

export default Select;