"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  GlobeAltIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { FaVolleyballBall, FaBell } from "react-icons/fa";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

const languages = [
  { code: "pt", name: "Português", flag: "🇧🇷" },
  // { code: "en", name: "English", flag: "🇺🇸" },
];

export function Header() {
  const { user, signOut, ownerPendingInvoices } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("pt");
  const [searchValue, setSearchValue] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const hasPending = user?.userType === "HOUSE_OWNER" && ownerPendingInvoices;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".notifications-container")) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchValue) {
      params.set("search", searchValue);
    } else {
      params.delete("search");
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <header className="bg-tertiary-500 fixed w-full top-0 z-[100] transition-all duration-500 ease-in-out">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="sm:hidden py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="SportMap"
                width={120}
                height={48}
                className="transition-all duration-500 ease-in-out"
                priority
              />
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLanguageModalOpen(true)}
                className="p-2 text-primary-500 hover:text-primary-600 transition-colors"
              >
                <GlobeAltIcon className="h-5 w-5" />
              </button>

              {user && (
                <div className="relative notifications-container">
                  <button
                    onClick={() => setShowNotifications((v) => !v)}
                    className="relative p-2 text-primary-500 hover:text-primary-600 transition-colors"
                    aria-label="Notificações"
                  >
                    <FaBell className="h-5 w-5" />
                    {hasPending && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-tertiary-500"></span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-red-300 rounded-xl shadow-2xl z-50 p-5 animate-enter">
                      {hasPending ? (
                        <div className="flex items-start gap-3">
                          <span className="mt-1 text-red-500 animate-pulse">
                            <FaBell className="w-6 h-6" />
                          </span>
                          <div>
                            <div className="font-bold text-red-700 text-lg mb-1 flex items-center gap-2">
                              Boletos pendentes
                              <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                            </div>
                            <div className="text-sm text-red-900 mb-3">
                              Você possui boletos pendentes.<br />
                              <span className="font-semibold">Entre em contato com o suporte para regularizar sua situação.</span>
                            </div>
                            <a
                              href="mailto:sportmap@suporte.com.br?subject=Regularização%20de%20Boletos%20Pendentes"
                              className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition-colors text-sm"
                            >
                              Enviar e-mail para o suporte
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm text-center">
                          Nenhuma notificação.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 border border-primary-500 rounded-full p-2 hover:shadow-md transition"
                >
                  <Bars3Icon className="h-5 w-5 text-primary-500" />
                  <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                    {user?.picture ? (
                      <Image
                        src={user.picture}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <span className="text-sm text-tertiary-500 font-medium">
                        {user ? getInitials(user.name) : "?"}
                      </span>
                    )}
                  </div>
                </button>

                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[150]"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-tertiary-500 rounded-xl shadow-lg py-2 z-[151] border">
                      {user ? (
                        <>
                          <Link
                            href="/bookings"
                            className="px-4 py-2 hover:bg-primary-500 hover:text-tertiary-500 text-sm block text-gray-900"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            Minhas Reservas
                          </Link>
                          <Link
                            href="/profile"
                            className="px-4 py-2 hover:bg-primary-500 hover:text-tertiary-500 text-sm block text-gray-900"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            Minha Conta
                          </Link>
                          {user?.userType === "HOUSE_OWNER" && (
                            <Link
                              href="/payments"
                              className="px-4 py-2 hover:bg-primary-500 hover:text-tertiary-500 text-sm block text-gray-900"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              Pagamentos
                            </Link>
                          )}
                          {user?.userType === "HOUSE_OWNER" && (
                            <Link
                              href="/dashboards"
                              className="px-4 py-2 hover:bg-primary-500 hover:text-tertiary-500 text-sm block text-gray-900"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              Dashboards
                            </Link>
                          )}
                          <div className="border-t my-1" />
                          <button
                            onClick={() => {
                              signOut();
                              setIsDropdownOpen(false);
                            }}
                            className="px-4 py-2 hover:bg-gray-100 text-sm text-left w-full text-red-600"
                          >
                            Sair
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/login"
                            className="px-4 py-2 hover:bg-primary-500 hover:text-tertiary-500 text-sm font-medium block text-primary-500"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            Entrar
                          </Link>
                          <Link
                            href="/register"
                            className="px-4 py-2 hover:bg-primary-500 hover:text-tertiary-500 text-sm block text-primary-500"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            Cadastrar
                          </Link>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex items-center border-2 border-primary-500 rounded-full 
              transition-all duration-500 ease-in-out py-2 px-4 bg-tertiary-500"
          >
            <input
              type="text"
              placeholder="Busque uma quadra..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-1 bg-tertiary-500 border-none outline-none text-primary-500 placeholder-primary-500/50 text-sm"
            />
            <button
              type="submit"
              className="p-1 rounded-full text-primary-500 hover:text-primary-600 transition-colors"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </form>
        </div>

        <div className="hidden sm:flex items-center justify-between h-24">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="SportMap"
              width={150}
              height={60}
              className="transition-all duration-500 ease-in-out"
              priority
            />
          </Link>

          <div className="flex-1 max-w-2xl lg:max-w-3xl mx-auto px-4 lg:px-8">
            <form
              onSubmit={handleSearch}
              className="flex items-center border-2 border-primary-500 rounded-full 
                transition-all duration-500 ease-in-out py-2 px-4 bg-tertiary-500"
            >
              <input
                type="text"
                placeholder="Busque uma quadra..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="flex-1 bg-tertiary-500 border-none outline-none text-primary-500 placeholder-primary-500/50"
              />
              <button
                type="submit"
                className="p-2 rounded-full text-primary-500 hover:text-primary-600 transition-colors"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </form>
          </div>

          <div className="flex items-center gap-4">
            {(!user ||
              (user.userType === "HOUSE_OWNER" &&
                user.subscriptionPlanId === "undefined")) && (
              <Link
                href="/owner-plans"
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium
                  text-primary-500 hover:text-tertiary-500
                  hover:bg-primary-500 rounded-full transition-all duration-200"
              >
                <FaVolleyballBall className="w-4 h-4" />
                <span>Anuncie seu espaço</span>
              </Link>
            )}

            <button
              onClick={() => setIsLanguageModalOpen(true)}
              className="p-2 text-primary-500 hover:text-primary-600 transition-colors"
            >
              <GlobeAltIcon className="h-6 w-6" />
            </button>

            {user && (
              <div className="relative notifications-container">
                <button
                  onClick={() => setShowNotifications((v) => !v)}
                  className="relative p-2 text-primary-500 hover:text-primary-600 transition-colors"
                  aria-label="Notificações"
                >
                  <FaBell className="h-6 w-6" />
                  {hasPending && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-tertiary-500"></span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-red-300 rounded-xl shadow-2xl z-50 p-5 animate-enter">
                    {hasPending ? (
                      <div className="flex items-start gap-3">
                        <span className="mt-1 text-red-500 animate-pulse">
                          <FaBell className="w-6 h-6" />
                        </span>
                        <div>
                          <div className="font-bold text-red-700 text-lg mb-1 flex items-center gap-2">
                            Boletos pendentes
                            <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                          </div>
                          <div className="text-sm text-red-900 mb-3">
                            Você possui boletos pendentes.<br />
                            <span className="font-semibold">Entre em contato com o suporte para regularizar sua situação.</span>
                          </div>
                          <a
                            href="https://sportmap.atlassian.net/servicedesk/customer/portal/1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition-colors text-sm"
                          >
                            Enviar e-mail para o suporte
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm text-center">
                        Nenhuma notificação.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 border border-primary-500 rounded-full p-2 hover:shadow-md transition"
              >
                <Bars3Icon className="h-5 w-5 text-primary-500" />
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                  {user?.picture ? (
                    <Image
                      src={user.picture}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="text-sm text-tertiary-500 font-medium">
                      {user ? getInitials(user.name) : "?"}
                    </span>
                  )}
                </div>
              </button>

              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-[150]"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-tertiary-500 rounded-xl shadow-lg py-2 z-[151] border">
                    {user ? (
                      <>
                        <Link
                          href="/bookings"
                          className="px-4 py-2 hover:bg-primary-500 hover:text-tertiary-500 text-sm block text-gray-900"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Minhas Reservas
                        </Link>
                        <Link
                          href="/profile"
                          className="px-4 py-2 hover:bg-primary-500 hover:text-tertiary-500 text-sm block text-gray-900"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Minha Conta
                        </Link>
                        {user?.userType === "HOUSE_OWNER" && (
                          <Link
                            href="/payments"
                            className="px-4 py-2 hover:bg-primary-500 hover:text-tertiary-500 text-sm block text-gray-900"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            Pagamentos
                          </Link>
                        )}
                        {user?.userType === "HOUSE_OWNER" && (
                          <Link
                            href="/dashboards"
                            className="px-4 py-2 hover:bg-primary-500 hover:text-tertiary-500 text-sm block text-gray-900"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            Dashboards
                          </Link>
                        )}
                        <div className="border-t my-1" />
                        <button
                          onClick={() => {
                            signOut();
                            setIsDropdownOpen(false);
                          }}
                          className="px-4 py-2 hover:bg-primary-500 hover:text-tertiary-500 text-sm text-left w-full text-gray-600"
                        >
                          Sair
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="px-4 py-2 hover:bg-primary-500 hover:text-tertiary-500 text-sm font-medium block text-primary-500"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Entrar
                        </Link>
                        <Link
                          href="/register"
                          className="px-4 py-2 hover:bg-primary-500 hover:text-tertiary-500 text-sm block text-primary-500"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Cadastrar
                        </Link>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {isLanguageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]">
          <div className="bg-tertiary-500 rounded-xl shadow-xl max-w-sm w-full mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-primary-500">
                  Escolha seu idioma
                </h2>
                <button
                  onClick={() => setIsLanguageModalOpen(false)}
                  className="text-primary-500 hover:text-primary-600"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`
                      w-full px-4 py-3 flex items-center space-x-3
                      rounded-lg transition-colors
                      ${
                        selectedLanguage === lang.code
                          ? "bg-primary-500 text-tertiary-500"
                          : "hover:bg-primary-500 text-primary-500"
                      }
                    `}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                    {selectedLanguage === lang.code && (
                      <svg
                        className="w-5 h-5 ml-auto"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
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
