interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={props.name} 
          className="block text-sm font-medium text-gray-900 mb-1"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          {...props}
          className={`
            block w-full rounded-lg px-4 py-2.5
            text-gray-900 placeholder:text-gray-500
            border transition-colors
            focus:outline-none focus:ring-2
            ${error 
              ? 'border-error-500 focus:border-error-500 focus:ring-error-500' 
              : 'border-gray-200 focus:border-primary-500 focus:ring-primary-500'
            }
          `}
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-error-500">
          {error}
        </p>
      )}
    </div>
  );
} 