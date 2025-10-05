import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`input-field min-h-[120px] resize-y ${error ? 'border-rose' : ''} ${className} textarea-black-text`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-rose">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
