'use client';

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useCallback } from "react";
import debounce from 'lodash/debounce';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      onSearch(searchQuery);
    }, 300),
    [onSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Busque uma quadra pelo nome..."
          className="w-full px-4 py-3 pl-12 pr-4 
            text-gray-900 rounded-full
            border border-gray-200
            shadow-sm hover:shadow-md
            focus:outline-none focus:ring-2 focus:ring-gray-200
            transition-all duration-300"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
        </div>
      </div>
    </div>
  );
} 