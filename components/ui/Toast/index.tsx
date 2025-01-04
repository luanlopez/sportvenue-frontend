'use client';

import { Toaster } from 'react-hot-toast';

export function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: {
          background: '#fff',
          color: '#1f2937', // gray-900
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        },
        success: {
          iconTheme: {
            primary: '#22c55e', // success-500
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444', // error-500
            secondary: '#fff',
          },
        },
      }}
    />
  );
}

export { showToast } from './showToast'; 