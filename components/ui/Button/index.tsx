import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-full font-bold transition focus:outline-none focus:ring-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
} 