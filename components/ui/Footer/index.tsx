"use client";

import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";

export function Footer() {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-500 py-8 sm:py-12 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'url("/location.png")',
          backgroundRepeat: 'repeat',
          backgroundSize: '40px',
          backgroundPosition: 'center',
          transform: 'rotate(-5deg) scale(1.5)',
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center md:flex-row md:items-start gap-8">
          <div className="flex justify-center md:justify-start w-full md:w-auto">
            <Image
              src="/logo-footer.png"
              alt="SportMap"
              width={80}
              height={80}
              className="bg-tertiary-500 rounded-full"
            />
          </div>

          <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-6 w-full">
            <div className="flex flex-col items-center md:items-start gap-3">
              <h3 className="text-tertiary-500 font-bold text-lg mb-2">Sobre</h3>
              <p className="text-tertiary-500 text-sm text-center md:text-left max-w-xs">
                Encontre e reserve as melhores quadras esportivas da sua região de forma rápida e fácil.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start gap-3">
              <h3 className="text-tertiary-500 font-bold text-lg mb-2">Links Rápidos</h3>
              <div className="flex flex-col items-center md:items-start gap-2">
                <Link href="/" className="text-tertiary-500 hover:text-secondary-500 transition-colors text-sm">
                  Início
                </Link>
                <Link href={user ? "/bookings" : "/login"} className="text-tertiary-500 hover:text-secondary-500 transition-colors text-sm">
                  Minhas Reservas
                </Link>
                <Link href="/construction" className="text-tertiary-500 hover:text-secondary-500 transition-colors text-sm">
                  Termos de Uso
                </Link>
                <Link href="/construction" className="text-tertiary-500 hover:text-secondary-500 transition-colors text-sm">
                  Política de Privacidade
                </Link>
                <Link href="/construction" className="text-tertiary-500 hover:text-secondary-500 transition-colors text-sm">
                  FAQ
                </Link>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-start gap-3">
              <h3 className="text-tertiary-500 font-bold text-lg mb-2">Contato</h3>
              <div className="flex flex-col items-center md:items-start gap-2">
                <a
                  href="mailto:contato@sportmap.com"
                  className="flex items-center gap-2 text-tertiary-500 hover:text-secondary-500 transition-colors text-sm"
                >
                  <FaEnvelope className="w-4 h-4" />
                  <span>contato@sportmap.com</span>
                </a>
                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-tertiary-500 hover:text-secondary-500 transition-colors text-sm"
                >
                  <FaWhatsapp className="w-4 h-4" />
                  <span>Suporte via WhatsApp</span>
                </a>
                <div className="flex items-center gap-2 text-tertiary-500 text-sm">
                  <FaMapMarkerAlt className="w-4 h-4" />
                  <span>São Paulo, SP</span>
                </div>
                <a
                  href="https://instagram.com/sportmap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-tertiary-500 hover:text-secondary-500 transition-colors text-sm"
                >
                  <FaInstagram className="w-4 h-4" />
                  <span>@sportmap</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full border-t border-tertiary-500/30 mt-8 pt-6">
          <p className="text-tertiary-500 text-xs sm:text-sm text-center">
            © {currentYear} SportMap. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
} 