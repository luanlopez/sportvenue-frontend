'use client';

import { useState, useRef, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import {
  FaFutbol,
  FaBasketballBall,
  FaVolleyballBall,
  FaTableTennis,
  FaBaseballBall,
} from "react-icons/fa";
import {
  GiTennisBall,
  GiFeather,
  GiTennisCourt,
  GiBaseballBat,
  GiBoxingGlove,
  GiHockey,
  GiCricketBat,
  GiSwimfins,
  GiArcheryTarget,
  GiFist
} from "react-icons/gi";
import { MdSkateboarding, MdSurfing } from "react-icons/md";
import * as Tooltip from '@radix-ui/react-tooltip';

export interface SportCategory {
  id: string;
  name: string;
  value: string;
  icon: React.ElementType;
  disabled?: boolean;
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
    icon: GiFeather,
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
  {
    id: "boxe",
    name: "Boxe",
    value: "BOXING",
    icon: GiBoxingGlove,
    disabled: true
  },
  {
    id: "artes-marciais",
    name: "Artes Marciais",
    value: "MARTIAL_ARTS",
    icon: GiFist,
    disabled: true
  },
  {
    id: "hockey",
    name: "Hockey",
    value: "HOCKEY",
    icon: GiHockey,
    disabled: true
  },
  {
    id: "cricket",
    name: "Cricket",
    value: "CRICKET",
    icon: GiCricketBat,
    disabled: true
  },
  {
    id: "natacao",
    name: "Natação",
    value: "SWIMMING",
    icon: GiSwimfins,
    disabled: true
  },
  {
    id: "skate",
    name: "Skate",
    value: "SKATEBOARDING",
    icon: MdSkateboarding,
    disabled: true
  },
  {
    id: "surf",
    name: "Surf",
    value: "SURFING",
    icon: MdSurfing,
    disabled: true
  },
  {
    id: "tiro-com-arco",
    name: "Tiro com Arco",
    value: "ARCHERY",
    icon: GiArcheryTarget,
    disabled: true
  }
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
    <Tooltip.Provider delayDuration={200}>
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
              <Tooltip.Root key={category.id}>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={() => !category.disabled && onSelect(selectedCategory === category.value ? null : category.value)}
                    disabled={category.disabled}
                    className={`
                      flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-200
                      min-w-fit shadow-md border
                      ${
                        category.disabled
                          ? 'bg-tertiary-500/50 text-primary-500/50 border-primary-500/20 cursor-not-allowed hover:shadow-none'
                          : selectedCategory === category.value
                          ? 'bg-primary-500 text-tertiary-500 hover:shadow-lg border-primary-500'
                          : 'bg-tertiary-500 hover:bg-primary-500 hover:text-tertiary-500 text-primary-500 hover:shadow-lg border-primary-500'
                      }
                    `}
                  >
                    <category.icon 
                      className={`w-4 h-4 transition-colors duration-200 ${
                        category.disabled
                          ? 'text-primary-500/50'
                          : selectedCategory === category.value
                          ? 'text-tertiary-500'
                          : 'text-primary-500 group-hover:text-tertiary-500'
                      }`} 
                    />
                    <span className="text-sm font-medium whitespace-nowrap">
                      {category.name}
                    </span>
                  </button>
                </Tooltip.Trigger>

                {category.disabled && (
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="
                        px-3 py-2 rounded-lg text-xs font-medium
                        bg-primary-500 text-tertiary-500
                        shadow-lg border border-primary-500/20
                        animate-slideDownAndFade select-none
                        z-[100]
                      "
                      sideOffset={5}
                    >
                      Em breve disponível
                      <Tooltip.Arrow 
                        className="fill-primary-500"
                        width={10}
                        height={5}
                      />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                )}
              </Tooltip.Root>
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
      </div>
    </Tooltip.Provider>
  );
} 