import toast, { Toast } from 'react-hot-toast';
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface ToastProps {
  t: Toast;
  title: string;
  message: string;
  type: 'success' | 'error';
}

export function CustomToast({ t, title, message, type }: ToastProps) {
  return (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black/5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            {type === 'success' ? (
              <CheckCircleIcon className="h-6 w-6 text-success-500" />
            ) : (
              <XCircleIcon className="h-6 w-6 text-error-500" />
            )}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-text-primary">
              {title}
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              {message}
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-secondary-100">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-primary-500 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
} 