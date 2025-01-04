'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

function getInitials(name: string) {
  return name.split(' ').map(word => word[0]).join('').toUpperCase();
}

const authRoutes = ["/", "/register", "/forgot-password"];

const menuItemsByRole = {
  USER: [
    { label: "Início", href: "/home" },
    { label: "Reservas", href: "/bookings" },
  ],
  HOUSE_OWNER: [
    { label: "Início", href: "/home" },
    { label: "Reservas", href: "/bookings" },
  ],
};

const languages = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

export function Header() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('pt');

  if (authRoutes.includes(pathname) || !user) {
    return null;
  }

  const menuItems = menuItemsByRole[user?.userType];

  const handleLogout = () => {
    signOut();
    setIsDropdownOpen(false);
  };

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    document.cookie = `NEXT_LOCALE=${langCode};path=/`;
    setIsLanguageModalOpen(false);
  };

  return (
    <header className="bg-white shadow-sm py-3 fixed w-full top-0 z-[100]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/home" className="flex items-center">
            <h2 className="text-2xl font-bold text-primary-500">SportVenue</h2>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  text-[15px] font-medium transition-colors
                  ${pathname === item.href
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsLanguageModalOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Mudar idioma"
            >
              <GlobeAltIcon className="w-5 h-5 text-gray-600" />
            </button>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-medium">
                  {getInitials(user?.name)}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <ChevronDownIcon className="w-5 h-5 text-gray-500" />
              </button>

              {isDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-[150]"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-[151]">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Meu Perfil
                    </Link>
                    {/* <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Configurações
                    </Link> */}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sair
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {isLanguageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Escolha seu idioma
                </h2>
                <button
                  onClick={() => setIsLanguageModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`
                      w-full px-4 py-3 flex items-center space-x-3
                      rounded-lg transition-colors
                      ${selectedLanguage === lang.code
                        ? 'bg-primary-50 text-primary-500'
                        : 'hover:bg-gray-50 text-gray-700'
                      }
                    `}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                    {selectedLanguage === lang.code && (
                      <svg className="w-5 h-5 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 