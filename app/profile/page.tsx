"use client";

import { useAuth } from "@/hooks/useAuth";


function getInitials(name: string) {
  return name.split(' ').map(word => word[0]).join('').toUpperCase();
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4" />
        <p className="text-gray-500">Carregando perfil...</p>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-32 h-32 rounded-full bg-primary-500 flex items-center justify-center text-white text-4xl font-medium shadow-lg mb-4">
                {getInitials(user.name)}
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.name}
              </h1>
              <span className="text-gray-500 mt-1">{user.email}</span>
            </div>

            <div className="border-t border-gray-100 my-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Informações de Contato
                  </h2>
                  <div className="mt-2 space-y-2">
                    <p className="text-gray-900">
                      <span className="font-medium">Email:</span> {user.email}
                    </p>
                    <p className="text-gray-900">
                      <span className="font-medium">Telefone:</span> {user.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Detalhes da Conta
                  </h2>
                  <div className="mt-2 space-y-2">
                    <p className="text-gray-900">
                      <span className="font-medium">Tipo de Usuário:</span>{" "}
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {user.userType === "HOUSE_OWNER" ? "Proprietário" : "Usuário"}
                      </span>
                    </p>
                    <p className="text-gray-900">
                      <span className="font-medium">Nome Completo:</span>{" "}
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-8 py-4">
            <div className="flex justify-end">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Editar Perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 