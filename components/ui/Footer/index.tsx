"use client";

import Link from "next/link";
import { FaInstagram, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";

export function Footer() {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
            SportMap
            </h3>
            <p className="text-gray-600 text-sm">
              Encontre e reserve as melhores quadras esportivas da sua região de forma rápida e fácil.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Links Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary-500 text-sm">
                  Início
                </Link>
              </li>
              <li>
                <Link href={user ? "/bookings" : "/login"} className="text-gray-600 hover:text-primary-500 text-sm">
                  Minhas Reservas
                </Link>
              </li>
              <li>
                <Link href="/construction" className="text-gray-600 hover:text-primary-500 text-sm">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/construction" className="text-gray-600 hover:text-primary-500 text-sm">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/construction" className="text-gray-600 hover:text-primary-500 text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contato
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-600 text-sm">
                <FaEnvelope className="w-4 h-4 mr-2" />
                contato@sportmap.com
              </li>
              <li className="flex items-center text-gray-600 text-sm">
                <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                São Paulo, SP
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Redes Sociais
            </h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-primary-500 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8">
          <p className="text-center text-gray-600 text-sm">
            © {currentYear} SportMap. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
} 