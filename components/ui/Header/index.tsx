"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { FaVolleyballBall } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  HiOutlineBell,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineRectangleGroup,
} from "react-icons/hi2";
import { NotificationsDropdown } from "@/components/ui/NotificationsDropdown";
import { useQuery } from "@tanstack/react-query";
import { notificationService } from "@/services/notifications";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function Header() {
  const { user, signOut, ownerPendingInvoices } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();

  const hasPending = user?.userType === "HOUSE_OWNER" && ownerPendingInvoices;

  const { data: unreadCountData } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => notificationService.getUnreadCount(),
    enabled: !!user,
  });

  const unreadCount = unreadCountData?.count || 0;
  const totalUnreadCount = unreadCount + (hasPending ? 1 : 0);

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

  const houseOwner = user?.userType === "HOUSE_OWNER";

  return (
    <header className="bg-white w-full sticky top-0 z-[100] shadow-lg transition-all duration-500 ease-in-out border-b border-slate-100">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:hidden py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex-shrink-0 select-none">
              <Image
                src="/logo-blue.svg"
                alt="SportMap"
                width={120}
                height={30}
                className="h-8 w-auto"
              />
            </Link>

            <div className="flex items-center gap-2">
              {user && (
                <div className="relative notifications-container">
                  <button
                    onClick={() => setShowNotifications((v) => !v)}
                    className="relative p-2 rounded-full bg-slate-100 border border-slate-200 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                    aria-label="Notificações"
                  >
                    <HiOutlineBell className="h-5 w-5 text-slate-700" />
                    {totalUnreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white text-xs text-white flex items-center justify-center font-bold">
                        {totalUnreadCount > 9 ? "9+" : totalUnreadCount}
                      </span>
                    )}
                  </button>
                  <NotificationsDropdown
                    isOpen={showNotifications}
                    onClose={() => setShowNotifications(false)}
                    hasPendingInvoices={!!hasPending}
                  />
                </div>
              )}

              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 border border-slate-200 rounded-full p-2 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition"
                >
                  <Bars3Icon className="h-5 w-5 text-slate-700" />
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                    {user?.picture ? (
                      <Image
                        src={user.picture}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <span className="text-sm text-slate-700 font-medium">
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
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl py-4 z-[151] border border-slate-100">
                      {user ? (
                        <>
                          <button
                            className="w-full flex items-center gap-3 text-left px-6 py-2.5 hover:bg-slate-100 transition"
                            onClick={() => {
                              router.push("/bookings");
                              setIsDropdownOpen(false);
                            }}
                          >
                            <HiOutlineCalendar className="w-5 h-5 text-slate-700" />
                            <div>
                              <div className="font-medium text-slate-700 text-sm">
                                Minhas Reservas
                              </div>
                              <div className="text-xs text-slate-400">
                                Histórico e próximas reservas
                              </div>
                            </div>
                          </button>
                          <button
                            className="w-full flex items-center gap-3 text-left px-6 py-2.5 hover:bg-slate-100 transition"
                            onClick={() => {
                              router.push("/profile");
                              setIsDropdownOpen(false);
                            }}
                          >
                            <HiOutlineUser className="w-5 h-5 text-slate-700" />
                            <div>
                              <div className="font-medium text-slate-700 text-sm">
                                Minha Conta
                              </div>
                              <div className="text-xs text-slate-400">
                                Gerencie seus dados pessoais
                              </div>
                            </div>
                          </button>
                          {houseOwner && (
                            <button
                              className="w-full flex items-center gap-3 text-left px-6 py-2.5 hover:bg-slate-100 transition"
                              onClick={() => {
                                router.push("/dashboards");
                                setIsDropdownOpen(false);
                              }}
                            >
                              <HiOutlineChartBar className="w-5 h-5 text-slate-700" />
                              <div>
                                <div className="font-medium text-slate-700 text-sm">
                                  Dashboards
                                </div>
                                <div className="text-xs text-slate-400">
                                  Visão geral dos seus dados
                                </div>
                              </div>
                            </button>
                          )}
                          {!houseOwner && (
                            <button
                              className="w-full flex items-center gap-3 text-left px-6 py-2.5 hover:bg-slate-100 transition"
                              onClick={() => {
                                router.push("/owner-plans");
                                setIsDropdownOpen(false);
                              }}
                            >
                              <HiOutlineRectangleGroup className="w-7 h-7 text-slate-700" />
                              <div>
                                <div className="font-medium text-slate-700 text-sm">
                                  Anuncie sua quadra
                                </div>
                                <div className="text-xs text-slate-400">
                                  É fácil começar a alugar sua quadra, oferecer
                                  experiências esportivas e ganhar uma renda
                                  extra.
                                </div>
                              </div>
                            </button>
                          )}
                          <div className="border-t my-3 border-slate-200" />
                          <button
                            onClick={() => {
                              signOut();
                              setIsDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-3 text-left px-6 py-2.5 text-slate-700 hover:bg-slate-100 transition"
                          >
                            <HiOutlineArrowLeftOnRectangle className="w-5 h-5 text-slate-700" />
                            Sair da conta
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="w-full flex items-center gap-3 text-left px-6 py-2.5 hover:bg-slate-100 transition font-medium text-slate-700"
                            onClick={() => {
                              router.push("/login");
                              setIsDropdownOpen(false);
                            }}
                          >
                            <HiOutlineUser className="w-5 h-5 text-slate-700" />
                            <div>
                              <div className="font-medium text-slate-700 text-sm">
                                Entrar
                              </div>
                              <div className="text-xs text-slate-400">
                                Acesse sua conta para reservar quadras e eventos
                              </div>
                            </div>
                          </button>
                          <button
                            className="w-full flex items-center gap-3 text-left px-6 py-2.5 hover:bg-slate-100 transition font-medium text-slate-700"
                            onClick={() => {
                              router.push("/register");
                              setIsDropdownOpen(false);
                            }}
                          >
                            <HiOutlineUser className="w-5 h-5 text-slate-700" />
                            <div>
                              <div className="font-medium text-slate-700 text-sm">
                                Cadastrar
                              </div>
                              <div className="text-xs text-slate-400">
                                Crie uma conta gratuita para aproveitar todos os
                                recursos
                              </div>
                            </div>
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center justify-between h-20">
          <Link href="/" className="flex-shrink-0 select-none">
            <Image
              src="/logo-blue.svg"
              alt="SportMap"
              width={160}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          <div className="flex items-center gap-4">
            {(!user ||
              (houseOwner && user.subscriptionPlanId === "undefined")) && (
              <Link
                href="/owner-plans"
                className="hidden md:flex items-center gap-2 px-6 py-3 text-sm font-medium
                  text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-all duration-200"
              >
                <FaVolleyballBall className="w-4 h-4" />
                <span>Anuncie seu espaço</span>
              </Link>
            )}

            {user && (
              <div className="relative notifications-container">
                <button
                  onClick={() => setShowNotifications((v) => !v)}
                  className="relative p-2 rounded-full bg-slate-100 border border-slate-200 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                  aria-label="Notificações"
                >
                  <HiOutlineBell className="h-5 w-5 text-slate-700" />
                  {totalUnreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white text-xs text-white flex items-center justify-center font-bold">
                      {totalUnreadCount > 9 ? "9+" : totalUnreadCount}
                    </span>
                  )}
                </button>
                <NotificationsDropdown
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                  hasPendingInvoices={!!hasPending}
                />
              </div>
            )}

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 border border-slate-200 rounded-full p-2 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition"
              >
                <Bars3Icon className="h-5 w-5 text-slate-700" />
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                  {user?.picture ? (
                    <Image
                      src={user.picture}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="text-sm text-slate-700 font-medium">
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
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl py-4 z-[151] border border-slate-100">
                    {user ? (
                      <>
                        <button
                          className="w-full flex items-center gap-3 text-left px-6 py-2.5 hover:bg-slate-100 transition"
                          onClick={() => {
                            router.push("/bookings");
                            setIsDropdownOpen(false);
                          }}
                        >
                          <HiOutlineCalendar className="w-5 h-5 text-slate-700" />
                          <div>
                            <div className="font-medium text-slate-700 text-sm">
                              Minhas Reservas
                            </div>
                            <div className="text-xs text-slate-400">
                              Histórico e próximas reservas
                            </div>
                          </div>
                        </button>
                        <button
                          className="w-full flex items-center gap-3 text-left px-6 py-2.5 hover:bg-slate-100 transition"
                          onClick={() => {
                            router.push("/profile");
                            setIsDropdownOpen(false);
                          }}
                        >
                          <HiOutlineUser className="w-5 h-5 text-slate-700" />
                          <div>
                            <div className="font-medium text-slate-700 text-sm">
                              Minha Conta
                            </div>
                            <div className="text-xs text-slate-400">
                              Gerencie seus dados pessoais
                            </div>
                          </div>
                        </button>
                        {houseOwner && (
                          <button
                            className="w-full flex items-center gap-3 text-left px-6 py-2.5 hover:bg-slate-100 transition"
                            onClick={() => {
                              router.push("/dashboards");
                              setIsDropdownOpen(false);
                            }}
                          >
                            <HiOutlineChartBar className="w-5 h-5 text-slate-700" />
                            <div>
                              <div className="font-medium text-slate-700 text-sm">
                                Dashboards
                              </div>
                              <div className="text-xs text-slate-400">
                                Visão geral dos seus dados
                              </div>
                            </div>
                          </button>
                        )}
                        {!houseOwner && (
                          <button
                            className="w-full flex items-center gap-3 text-left px-6 py-2.5 hover:bg-slate-100 transition"
                            onClick={() => {
                              router.push("/owner-plans");
                              setIsDropdownOpen(false);
                            }}
                          >
                            <HiOutlineRectangleGroup className="w-7 h-7 text-slate-700" />
                            <div>
                              <div className="font-medium text-slate-700 text-sm">
                                Anuncie sua quadra
                              </div>
                              <div className="text-xs text-slate-400">
                                É fácil começar a alugar sua quadra, oferecer
                                experiências esportivas e ganhar uma renda
                                extra.
                              </div>
                            </div>
                          </button>
                        )}
                        <div className="border-t my-3 border-slate-200" />
                        <button
                          onClick={() => {
                            signOut();
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 text-left px-6 py-2.5 text-slate-700 hover:bg-slate-100 transition"
                        >
                          <HiOutlineArrowLeftOnRectangle className="w-5 h-5 text-slate-700" />
                          Sair da conta
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="w-full flex items-center gap-3 text-left px-6 py-2.5 hover:bg-slate-100 transition font-medium text-slate-700"
                          onClick={() => {
                            router.push("/login");
                            setIsDropdownOpen(false);
                          }}
                        >
                          <HiOutlineUser className="w-5 h-5 text-slate-700" />
                          <div>
                            <div className="font-medium text-slate-700 text-sm">
                              Entrar
                            </div>
                            <div className="text-xs text-slate-400">
                              Acesse sua conta para reservar quadras e eventos
                            </div>
                          </div>
                        </button>
                        <button
                          className="w-full flex items-center gap-3 text-left px-6 py-2.5 hover:bg-slate-100 transition font-medium text-slate-700"
                          onClick={() => {
                            router.push("/register");
                            setIsDropdownOpen(false);
                          }}
                        >
                          <HiOutlineUser className="w-5 h-5 text-slate-700" />
                          <div>
                            <div className="font-medium text-slate-700 text-sm">
                              Cadastrar
                            </div>
                            <div className="text-xs text-slate-400">
                              Crie uma conta gratuita para aproveitar todos os
                              recursos
                            </div>
                          </div>
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
