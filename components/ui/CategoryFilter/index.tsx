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
      <div className="relative flex-1 w-full bg-white rounded-2xl shadow-sm border border-gray-100">
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 
              bg-white rounded-full p-2 shadow-lg hover:shadow-xl
              transition-all duration-300 ease-out
              hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Scroll left"
          >
            <FaChevronLeft className="w-4 h-4 text-gray-600" />
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
                min-w-fit hover:shadow-md
                ${selectedCategory === category.value
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }
              `}
            >
              <category.icon 
                className={`w-4 h-4 ${
                  selectedCategory === category.value
                    ? 'text-white'
                    : 'text-gray-500'
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
              bg-white rounded-full p-2 shadow-lg hover:shadow-xl
              transition-all duration-300 ease-out
              hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Scroll right"
          >
            <FaChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        )}
      </div>

      <div className="relative group">
        <button
          disabled
          className="flex items-center gap-2 px-4 py-2.5 rounded-full
            bg-white border border-gray-200 cursor-not-allowed
            transition-all duration-200 hover:shadow-md
            text-gray-400 hover:text-gray-500
            shadow-sm"
        >
          <FaFilter className="w-4 h-4" />
          <span className="text-sm font-medium">Filtros</span>
        </button>

        <div className="absolute bottom-full right-0 mb-2 
          opacity-0 group-hover:opacity-100 transform group-hover:-translate-y-1
          transition-all duration-200 pointer-events-none z-[200]"
        >
          <div className="bg-primary-500 text-white px-4 py-2 rounded-lg shadow-lg
            text-sm font-medium relative whitespace-nowrap"
          >
            Disponível em breve
            <div className="absolute -bottom-1 right-6 w-2 h-2 
              bg-primary-500 transform rotate-45"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 