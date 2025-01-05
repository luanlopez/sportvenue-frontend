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
    <div className="relative w-full flex items-center">
      <div className="relative flex-1">
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform"
            aria-label="Scroll left"
          >
            <FaChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-4 py-2 -mx-4 scroll-smooth"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelect(selectedCategory === category.value ? null : category.value)}
              className={`
                flex flex-col items-center min-w-[80px] px-4 py-2
                transition-all duration-200 group
                ${selectedCategory === category.value
                  ? 'border-b-2 border-primary-500'
                  : 'border-b-2 border-transparent hover:border-gray-200'
                }
              `}
            >
              <div
                className={`
                  p-3 rounded-full mb-1 transition-colors
                  ${selectedCategory === category.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }
                `}
              >
                <category.icon className="w-5 h-5" />
              </div>
              <span
                className={`
                  text-xs font-medium whitespace-nowrap
                  ${selectedCategory === category.value
                    ? 'text-primary-500'
                    : 'text-gray-600'
                  }
                `}
              >
                {category.name}
              </span>
            </button>
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform"
            aria-label="Scroll right"
          >
            <FaChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        )}
      </div>

      <div className="relative group">
        <button
          disabled
          className="flex items-center gap-2 px-4 py-4 rounded-lg text-sm font-medium
            bg-white border border-gray-200 cursor-not-allowed
            transition-all duration-200 hover:shadow-md
            text-gray-400 hover:text-gray-500"
        >
          <FaFilter className="w-4 h-4" />
          Filtros
        </button>
        <div className="absolute bottom-full right-0 mb-2 
          opacity-0 group-hover:opacity-100 transform group-hover:-translate-y-1
          transition-all duration-200 pointer-events-none z-50"
        >
          <div className="bg-primary-500 text-white px-4 py-2 rounded-lg shadow-lg
            text-sm font-medium relative"
          >
            Disponível em breve
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-primary-500 
              transform rotate-45"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 