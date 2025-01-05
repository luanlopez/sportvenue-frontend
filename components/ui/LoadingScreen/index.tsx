'use client';

import Image from 'next/image';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-bounce mb-4">
          <Image
            src="/logo.png"
            alt="SportVenue"
            width={100}
            height={100}
            className="drop-shadow-lg"
          />
        </div>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-primary-500 animate-[bounce_1s_infinite_100ms]" />
          <div className="w-3 h-3 rounded-full bg-primary-500 animate-[bounce_1s_infinite_200ms]" />
          <div className="w-3 h-3 rounded-full bg-primary-500 animate-[bounce_1s_infinite_300ms]" />
        </div>
      </div>
    </div>
  );
} 