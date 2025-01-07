interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'modal';
}

export function Card({ children, variant = 'default' }: CardProps) {
  return (
    <div className={`
      bg-white rounded-2xl shadow-xl 
      ${variant === 'modal' 
        ? 'w-[90%] sm:w-[440px] p-4 sm:p-6' 
        : 'w-full p-4 sm:p-8'
      }
      mx-auto
      max-h-[90vh] overflow-y-auto
      animate-enter
    `}>
      {children}
    </div>
  );
}
