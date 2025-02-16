"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/users";
import { showToast } from "@/components/ui/Toast";
import Image from "next/image";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-tertiary-500 flex justify-center items-center">
      <div className="bg-primary-500 p-8 rounded-2xl shadow-md flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500 mb-4" />
        <p className="text-tertiary-500">Carregando perfil...</p>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await userService.updateUser(formData);
      setIsEditing(false);

      showToast.success("Sucesso", "Perfil atualizado com sucesso!");
      window.location.reload();
    } catch {
      showToast.error("Erro", "Não foi possível atualizar o perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!user) return <LoadingState />;

  return (
    <div className="min-h-screen bg-tertiary-500 px-20 py-20">
      <div className="container max-w-2xl mx-auto px-4 mt-10">
        <div className="bg-tertiary-500 border border-primary-500 rounded-2xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-32 h-32 rounded-full bg-secondary-500 flex items-center justify-center text-primary-500 text-4xl font-bold shadow-lg mb-4">
                {user?.picture ? (
                  <Image
                    src={user.picture}
                    alt="Profile Picture"
                    width={128}
                    height={128}
                    className="rounded-full"
                  />
                ) : (
                  getInitials(user.name)
                )}
              </div>
              <h1 className="text-2xl font-bold text-primary-500">{user.name}</h1>
              <span className="text-primary-500/80 mt-1">{user.email}</span>
            </div>

            <div className="border-t border-primary-500/20 my-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-secondary-500 uppercase tracking-wider">
                    Informações de Contato
                  </h2>
                  <div className="mt-2 space-y-2">
                    <p className="text-primary-500">
                      <span className="font-bold">Email:</span> {user.email}
                    </p>
                    <p className="text-primary-500">
                      <span className="font-bold">Telefone:</span>{" "}
                      {user.phone || "Não informado"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-secondary-500 uppercase tracking-wider">
                    Detalhes da Conta
                  </h2>
                  <div className="mt-2 space-y-2">
                    <p className="text-primary-500">
                      <span className="font-bold">Tipo de Usuário:</span>{" "}
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary-500 text-primary-500">
                        {user.userType === "HOUSE_OWNER"
                          ? "Proprietário"
                          : "Usuário"}
                      </span>
                    </p>
                    <p className="text-primary-500">
                      <span className="font-bold">Nome Completo:</span>{" "}
                      {user.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-tertiary-500 px-8 py-4">
            <div className="flex justify-end">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="w-full space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Nome"
                      className="px-4 py-2 border rounded-lg bg-tertiary-500 text-primary-500 placeholder-primary-500/50 border-primary-500/20 focus:ring-2 focus:ring-secondary-500"
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Sobrenome"
                      className="px-4 py-2 border rounded-lg bg-tertiary-500 text-primary-500 placeholder-primary-500/50 border-primary-500/20 focus:ring-2 focus:ring-secondary-500"
                    />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Telefone"
                      className="px-4 py-2 border rounded-lg bg-tertiary-500 text-primary-500 placeholder-primary-500/50 border-primary-500/20 focus:ring-2 focus:ring-secondary-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-primary-500 rounded-full text-sm font-bold text-primary-500 bg-tertiary-500 hover:bg-primary-500 hover:text-tertiary-500 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-secondary-500 text-primary-500 rounded-full shadow-md text-sm font-bold hover:bg-secondary-600 disabled:opacity-50 transition-colors"
                    >
                      {isLoading ? "Salvando..." : "Salvar"}
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-secondary-500 text-primary-500 rounded-full shadow-md text-sm font-bold hover:bg-secondary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2"
                >
                  Editar Perfil
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
