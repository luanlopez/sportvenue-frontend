"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  HomeIcon, 
  CalendarIcon, 
  MapPinIcon, 
  UserGroupIcon,
  ClockIcon,
  HeartIcon,
  BanknotesIcon
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const authRoutes = ["/", "/register"];

interface NavbarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  icon: React.ElementType;
  label: string;
  href: string;
  userType?: 'USER' | 'HOUSE_OWNER';
}

export function Navbar({ isOpen, onClose }: NavbarProps) {
  const [showNavbar, setShowNavbar] = useState(true);
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    setShowNavbar(!authRoutes.includes(pathname));
  }, [pathname]);

  if (!showNavbar) return null;

  const menuItems: MenuItem[] = [
    { icon: HomeIcon, label: "Início", href: "/home" },
    { icon: CalendarIcon, label: "Agendamentos", href: "/bookings" },
    { icon: MapPinIcon, label: "Explorar Quadras", href: "/explore" },
    { icon: UserGroupIcon, label: "Times", href: "/teams" },
    { icon: ClockIcon, label: "Histórico", href: "/history" },
    { icon: HeartIcon, label: "Favoritos", href: "/favorites" },
    { 
      icon: BanknotesIcon, 
      label: "Pagamentos", 
      href: "/payments",
      userType: 'HOUSE_OWNER'
    },
  ];

  return (
    <>
      <aside
        className={`
          fixed inset-y-0 left-0 transform
          w-64 bg-white shadow-sm
          transition-transform duration-300 ease-in-out z-[90]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          mt-16
        `}
      >
        <div className="flex flex-col h-full">
          <nav className="flex-1 px-3 py-4">
            <div className="space-y-1">
              {menuItems
                .filter(item => !item.userType || item.userType === user?.userType)
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        flex items-center px-4 py-3 text-sm font-medium rounded-lg
                        transition-colors duration-200
                        ${isActive 
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }
                      `}
                      onClick={onClose}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
            </div>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="px-4 py-3 text-sm text-gray-500">
              © 2024 SportMap
            </div>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[89] mt-16"
          onClick={onClose}
        />
      )}
    </>
  );
}
