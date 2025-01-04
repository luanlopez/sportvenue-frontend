'use client';

import { useField } from 'formik';
import { useState } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
}

export function Password({ label, ...props }: PasswordInputProps) {
  const [field, meta] = useField(props.name);
  const [showPassword, setShowPassword] = useState(false);
  const hasError = meta.touched && meta.error;

  const togglePassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPassword(prev => !prev);
  };

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
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          className={`
            w-full px-4 py-2 rounded-md border
            bg-background-primary
            text-black
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-primary-500
            ${hasError 
              ? 'border-error-500 focus:border-error-500 focus:ring-error-500' 
              : 'border-secondary-100 focus:border-primary-500'
            }
            pr-12
          `}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          {hasError ? (
            <div className="pr-3">
              <ExclamationCircleIcon className="h-5 w-5 text-error-500" />
            </div>
          ) : (
            <button
              type="button"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className="pr-3 focus:outline-none hover:text-black"
              onClick={togglePassword}
              tabIndex={0}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-secondary-500 hover:text-secondary-700" />
              ) : (
                <EyeIcon className="h-5 w-5 text-secondary-500 hover:text-secondary-700" />
              )}
            </button>
          )}
        </div>
      </div>

      {hasError && (
        <p className="mt-1 text-sm text-error-500">
          {meta.error}
        </p>
      )}
    </div>
  );
} 