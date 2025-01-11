"use client";

import { FaVolleyballBall, FaUser } from "react-icons/fa";

interface UserTypeModalProps {
  isOpen: boolean;
  onSelect: (type: 'USER' | 'HOUSE_OWNER') => void;
}

export function UserTypeModal({ isOpen, onSelect }: UserTypeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-enter">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Bem-vindo ao SportVenue!
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Como você deseja usar nossa plataforma?
          </p>

          <div className="space-y-4">
            <button
              onClick={() => onSelect('USER')}
              className="w-full p-4 border-2 border-gray-200 rounded-xl
                hover:border-primary-500 hover:bg-primary-50
                transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 
                  flex items-center justify-center
                  group-hover:bg-primary-200 transition-colors">
                  <FaUser className="w-6 h-6 text-primary-500" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Usuário
                  </h3>
                  <p className="text-sm text-gray-600">
                    Quero encontrar e reservar quadras
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => onSelect('HOUSE_OWNER')}
              className="w-full p-4 border-2 border-gray-200 rounded-xl
                hover:border-primary-500 hover:bg-primary-50
                transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 
                  flex items-center justify-center
                  group-hover:bg-primary-200 transition-colors">
                  <FaVolleyballBall className="w-6 h-6 text-primary-500" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Proprietário
                  </h3>
                  <p className="text-sm text-gray-600">
                    Quero anunciar minhas quadras
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 