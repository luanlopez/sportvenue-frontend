import { useRouter } from "next/navigation";
import { LockClosedIcon } from "@heroicons/react/24/outline";

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthRequiredModal({ isOpen, onClose }: AuthRequiredModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleLogin = () => {
    router.push(`/login?redirect=${window.location.pathname}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
        <div className="text-center mb-6">
          <div className="mb-4 inline-flex p-3 bg-primary-50 rounded-full">
            <LockClosedIcon className="w-6 h-6 text-primary-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Autenticação Necessária
          </h3>
          <p className="text-gray-600">
            Para fazer uma reserva, você precisa estar logado na sua conta.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleLogin}
            className="w-full px-4 py-3 text-white rounded-lg
              bg-primary-500 hover:bg-primary-600
              transition-colors duration-200
              font-medium"
          >
            Fazer Login
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-3 text-gray-700 rounded-lg
              bg-gray-100 hover:bg-gray-200
              transition-colors duration-200
              font-medium"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
} 