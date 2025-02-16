'use client';

import { useState, useRef, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaFilter } from 'react-icons/fa';
import {
  FaFutbol,
  FaBasketballBall,
  FaVolleyballBall,
  FaTableTennis,
  FaBaseballBall,
} from "react-icons/fa";
import {
  GiTennisBall,
  GiVolleyballBall,
  GiFeather,
  GiTennisCourt,
  GiBaseballBat,
} from "react-icons/gi";

interface SportCategory {
  id: string;
  name: string;
  value: string;
  icon: React.ElementType;
}

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelect: (value: string | null) => void;
}

const categories: SportCategory[] = [
  {
    id: "futebol",
    name: "Futebol",
    value: "FOOTBALL",
    icon: FaFutbol,
  },
  {
    id: "basquete",
    name: "Basquete",
    value: "BASKETBALL",
    icon: FaBasketballBall,
  },
  {
    id: "volei",
    name: "Vôlei",
    value: "VOLLEYBALL",
    icon: FaVolleyballBall,
  },
  {
    id: "tenis",
    name: "Tênis",
    value: "TENNIS",
    icon: GiTennisBall,
  },
  {
    id: "pingpong",
    name: "Ping Pong",
    value: "PING_PONG",
    icon: FaTableTennis,
  },
  {
    id: "baseball",
    name: "Baseball",
    value: "BASEBALL",
    icon: FaBaseballBall,
  },
  {
    id: "futsal",
    name: "Futsal",
    value: "FUTSAL",
    icon: FaFutbol,
  },
  {
    id: "handball",
    name: "Handebol",
    value: "HANDBALL",
    icon: GiVolleyballBall,
  },
  {
    id: "badminton",
    name: "Badminton",
    value: "BADMINTON",
    icon: GiFeather,
  },
  {
    id: "beach-tennis",
    name: "Beach Tennis",
    value: "BEACH_TENNIS",
    icon: GiTennisCourt,
  },
  {
    id: "rugby",
    name: "Rugby",
    value: "RUGBY",
    icon: GiBaseballBat,
  },
];

export function CategoryFilter({ selectedCategory, onSelect }: CategoryFilterProps) {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 200;
    const targetScroll = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, []);

  return (
    <div className="relative w-full flex items-center gap-4">
      <div className="relative flex-1 w-full bg-primary-500 rounded-xl shadow-md border border-primary-500">
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 
              bg-tertiary-500 rounded-full p-2 
              border border-primary-500 shadow-lg
              transition-all duration-300 ease-out
              hover:scale-110 hover:shadow-xl"
            aria-label="Scroll left"
          >
            <FaChevronLeft className="w-4 h-4 text-primary-500" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-6 py-4 scroll-smooth"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelect(selectedCategory === category.value ? null : category.value)}
              className={`
                flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-200
                min-w-fit shadow-md border border-primary-500
                ${
                  selectedCategory === category.value
                    ? 'bg-primary-500 text-tertiary-500 hover:shadow-lg'
                    : 'bg-tertiary-500 hover:bg-primary-500 hover:text-tertiary-500 text-primary-500 hover:shadow-lg'
                }
              `}
            >
              <category.icon 
                className={`w-4 h-4 transition-colors duration-200 ${
                  selectedCategory === category.value
                    ? 'text-tertiary-500'
                    : 'text-primary-500 group-hover:text-tertiary-500'
                }`} 
              />
              <span className="text-sm font-medium whitespace-nowrap">
                {category.name}
              </span>
            </button>
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 
              bg-tertiary-500 rounded-full p-2
              border border-primary-500 shadow-lg
              transition-all duration-300 ease-out
              hover:scale-110 hover:shadow-xl"
            aria-label="Scroll right"
          >
            <FaChevronRight className="w-4 h-4 text-primary-500" />
          </button>
        )}
      </div>

      <button
        disabled
        className="flex items-center gap-2 px-4 py-2.5 rounded-full
          bg-secondary-500 shadow-md
          transition-all duration-200
          text-primary-500 hover:shadow-lg
          cursor-not-allowed"
      >
        <FaFilter className="w-4 h-4" />
        <span className="text-sm font-medium">Filtros</span>
      </button>
    </div>
  );
} 