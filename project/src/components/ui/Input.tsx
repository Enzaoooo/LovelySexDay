import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`input-field ${error ? 'border-rose' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-rose">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
