"use client";

import Link from "next/link";
import Image from "next/image";
import { FaInstagram } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";

export function Footer() {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
        <footer className="bg-white border-t border-slate-100 pt-12 pb-6 text-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center md:justify-start mb-8">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo-blue.svg"
              alt="SportMap"
              width={180}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-8">
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-slate-800 mb-4 text-base">Atendimento</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://sportmap.atlassian.net/servicedesk/customer/portal/1" 
                  className="text-slate-600 hover:text-blue-600 transition-colors duration-200 text-sm"
                >
                  Central de Ajuda
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="font-semibold text-slate-800 mb-4 text-base">Sobre</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-slate-600 hover:text-blue-600 transition-colors duration-200 text-sm"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link 
                  href={user ? "/bookings" : "/login"} 
                  className="text-slate-600 hover:text-blue-600 transition-colors duration-200 text-sm"
                >
                  Minhas Reservas
                </Link>
              </li>
              <li>
                <Link 
                  href="/construction" 
                  className="text-slate-600 hover:text-blue-600 transition-colors duration-200 text-sm"
                >
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link 
                  href="/construction" 
                  className="text-slate-600 hover:text-blue-600 transition-colors duration-200 text-sm"
                >
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="font-semibold text-slate-800 mb-4 text-base">Contato</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://sportmap.atlassian.net/servicedesk/customer/portal/1" 
                  className="text-slate-600 hover:text-blue-600 transition-colors duration-200 text-sm"
                >
                  Suporte SportMap
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/5511954079252" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-600 hover:text-blue-600 transition-colors duration-200 text-sm"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a 
                  href="https://www.instagram.com/sportmap.oficial/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-600 hover:text-blue-600 transition-colors duration-200 text-sm"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500 text-center sm:text-left">
              © {currentYear} SportMap. Todos os direitos reservados.
            </p>
            
            <div className="flex items-center gap-4">
              <a 
                href="https://www.instagram.com/sportmap.oficial/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                className="text-slate-400 hover:text-blue-600 transition-colors duration-200 p-2 rounded-full hover:bg-slate-100"
              >
                <FaInstagram className="text-lg" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 