'use client';

import { useField } from 'formik';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
}

export function Input({ label, ...props }: InputProps) {
  const [field, meta] = useField(props.name);
  const hasError = meta.touched && meta.error;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={props.name} 
          className="block text-sm font-medium text-black mb-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          {...field}
          {...props}
          className={`
            w-full px-4 py-2 rounded-md border
            bg-background-primary text-black
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-primary-500
            ${hasError 
              ? 'border-error-500 focus:border-error-500 focus:ring-error-500' 
              : 'border-secondary-100 focus:border-primary-500'
            }
          `}
        />
        
        {hasError && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon className="h-5 w-5 text-error-500" />
          </div>
        )}
      </div>

      {hasError && (
        <p className="mt-1 text-sm text-error-500">
          {meta.error}
        </p>
      )}
    </div>
  );
}
