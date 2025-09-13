"use client";

import { useState } from "react";
import { FaVolleyballBall, FaUser } from "react-icons/fa";
import { Input } from "@/components/ui/Input";
import { showToast } from "@/components/ui/Toast";

interface UserTypeModalProps {
  isOpen: boolean;
  onSelect: (type: 'USER' | 'HOUSE_OWNER', document: string) => Promise<void>;
}

export function UserTypeModal({ isOpen, onSelect }: UserTypeModalProps) {
  const [selectedType, setSelectedType] = useState<'USER' | 'HOUSE_OWNER' | null>(null);
  const [documentType, setDocumentType] = useState<'CPF' | 'CNPJ'>('CPF');
  const [document, setDocument] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedType || !document || isSubmitting) {
      return;
    }
    
    const numbers = document.replace(/\D/g, '');
    const isValid = documentType === 'CNPJ' 
      ? numbers.length === 14
      : numbers.length === 11;

    if (!isValid) {
      setError(`${documentType} inválido`);
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await onSelect(selectedType, numbers);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.response?.data?.message?.includes('CPF já existente, tente outro por favor!')) {
        showToast.error("Erro", "Este documento já está cadastrado no sistema");
      } else {
        showToast.error("Erro", "Não foi possível completar seu cadastro. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDocument = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (documentType === 'CNPJ') {
      return numbers
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    } else {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDocument(e.target.value);
    setDocument(formatted);
  };

  const getDocumentMask = () => {
    return documentType === 'CNPJ' ? '00.000.000/0000-00' : '000.000.000-00';
  };

  const getDocumentMaxLength = () => {
    return documentType === 'CNPJ' ? 18 : 14;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-enter">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 text-center">
            Bem-vindo ao SportMap!
          </h2>
          <p className="text-slate-600 text-center mb-8">
            Como você deseja usar nossa plataforma?
          </p>

          <div className="space-y-4">
            <button
              onClick={() => {
                setSelectedType('USER');
                setDocumentType('CPF');
              }}
              className={`w-full p-4 border-2 rounded-xl transition-all duration-300 group
                ${selectedType === 'USER' 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-slate-200 hover:border-blue-600 hover:bg-blue-50'
                }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center
                  transition-colors
                  ${selectedType === 'USER'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'
                  }`}>
                  <FaUser className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Usuário
                  </h3>
                  <p className="text-sm text-slate-600">
                    Quero encontrar e reservar quadras
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedType('HOUSE_OWNER')}
              className={`w-full p-4 border-2 rounded-xl transition-all duration-300 group
                ${selectedType === 'HOUSE_OWNER' 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-slate-200 hover:border-blue-600 hover:bg-blue-50'
                }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center
                  transition-colors
                  ${selectedType === 'HOUSE_OWNER'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'
                  }`}>
                  <FaVolleyballBall className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Proprietário
                  </h3>
                  <p className="text-sm text-slate-600">
                    Quero anunciar minhas quadras
                  </p>
                </div>
              </div>
            </button>

            {selectedType && (
              <div className="mt-6 space-y-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setDocumentType('CPF');
                      setDocument('');
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium
                      transition-all duration-200
                      ${documentType === 'CPF'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    CPF
                  </button>
                  <button
                    onClick={() => {
                      setDocumentType('CNPJ');
                      setDocument('');
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium
                      transition-all duration-200
                      ${documentType === 'CNPJ'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    CNPJ
                  </button>
                </div>

                <div className="text-sm text-slate-600">
                  {selectedType === 'HOUSE_OWNER' ? (
                    <p>Informe seu {documentType} para geração das cobranças mensais da plataforma</p>
                  ) : (
                    <p>Informe seu {documentType} para identificação na plataforma</p>
                  )}
                </div>
                
                <Input
                  name="document"
                  label={documentType}
                  value={document}
                  onChange={handleDocumentChange}
                  placeholder={getDocumentMask()}
                  maxLength={getDocumentMaxLength()}
                  error={error}
                />

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !selectedType || !document}
                  className="w-full px-4 py-3 text-white rounded-lg
                    bg-blue-600 hover:bg-blue-700
                    transition-colors duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    font-medium"
                >
                  {isSubmitting ? "Processando..." : "Continuar"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 