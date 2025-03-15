"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { Amenity, AMENITY_LABELS, Category, CATEGORY_LABELS, courtService } from "@/services/courts";
import { showToast } from "@/components/ui/Toast";
import { TagSelect } from "@/components/ui/TagSelect";
import { useAuth } from "@/hooks/useAuth";
import { WeeklySchedule } from "@/types/courts";
import { cepService } from "@/services/cep";

export interface CreateCourtDTO {
  name: string;
  description: string;
  address: string;
  neighborhood: string;
  city: string;
  number: string;
  postalCode: string;
  state: string;
  pricePerHour: number;
  amenities: string[];
  categories: string[];
  images: string[];
  ownerId: string;
  weeklySchedule: WeeklySchedule;
}

const schema: yup.ObjectSchema<CreateCourtDTO> = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  description: yup.string().required("Descrição é obrigatória"),
  address: yup.string().required("Endereço é obrigatório"),
  neighborhood: yup.string().required("Bairro é obrigatório"),
  city: yup.string().required("Cidade é obrigatória"),
  number: yup.string().required("Número é obrigatório"),
  postalCode: yup.string().required("CEP é obrigatório"),
  state: yup.string().required("Estado é obrigatório"),
  pricePerHour: yup.number()
    .typeError("O valor deve ser um número")
    .required("Valor por hora é obrigatório")
    .positive("O valor deve ser maior que zero")
    .min(0.01, "O valor mínimo é R$ 0,01"),
  amenities: yup.array(yup.string().defined())
    .required("Selecione pelo menos uma comodidade")
    .min(1, "Selecione pelo menos uma comodidade"),
  categories: yup.array(yup.string().defined())
    .required("Selecione pelo menos uma categoria")
    .min(1, "Selecione pelo menos uma categoria"),
  images: yup.array(yup.string().defined()).required(),
  ownerId: yup.string().required("Id do proprietário é obrigatório"),
  weeklySchedule: yup.object().shape({
    monday: yup.array(yup.string().defined()).default([]),
    tuesday: yup.array(yup.string().defined()).default([]),
    wednesday: yup.array(yup.string().defined()).default([]),
    thursday: yup.array(yup.string().defined()).default([]),
    friday: yup.array(yup.string().defined()).default([]),
    saturday: yup.array(yup.string().defined()).default([]),
    sunday: yup.array(yup.string().defined()).default([]),
  }).required("Horários são obrigatórios")
});

const HORARIOS_DISPONIVEIS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
  "20:00", "21:00", "22:00", "23:00"
];

const DIAS_SEMANA = {
  monday: "Segunda-feira",
  tuesday: "Terça-feira",
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
  saturday: "Sábado",
  sunday: "Domingo"
};

export default function CreateCourt() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CreateCourtDTO>({
    resolver: yupResolver(schema),
    defaultValues: {
      amenities: [],
      categories: [],
      images: [],
      ownerId: user?.id || ""
    }
  });

  const defaultSchedule: WeeklySchedule = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  };

  const [selectedDay, setSelectedDay] = useState<keyof typeof DIAS_SEMANA>("monday");

  const handleHorarioChange = (horario: string) => {
    const currentSchedule = watch('weeklySchedule') || defaultSchedule;
    const daySchedule = currentSchedule[selectedDay];
    
    const updatedSchedule = {
      ...currentSchedule,
      [selectedDay]: daySchedule.includes(horario)
        ? daySchedule.filter(h => h !== horario)
        : [...daySchedule, horario].sort()
    };
    
    setValue('weeklySchedule', updatedSchedule);
  };

  const onSubmit = async (data: CreateCourtDTO) => {
    try {
      setIsSubmitting(true);
      await courtService.createCourt(data);
      showToast.success("Sucesso", "Quadra criada com sucesso");
      router.push("/");
    } catch {
      showToast.error("Erro", "Não foi possível criar a quadra");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (!cep || cep.length !== 8) return;

    try {
      setIsLoadingCep(true);
      const address = await cepService.findAddress(cep);
      
      setValue('address', address.logradouro);
      setValue('neighborhood', address.bairro);
      setValue('city', address.localidade);
      setValue('state', address.uf);
      
    } catch {
      showToast.error("Erro", "CEP não encontrado");
    } finally {
      setIsLoadingCep(false);
    }
  };

  return (
    <div className="min-h-screen bg-tertiary-500 py-12 sm:py-16 lg:py-20 mt-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1800px]">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-500">Criar Nova Quadra</h1>
          <p className="mt-2 text-primary-500/70">Preencha as informações abaixo para cadastrar sua quadra</p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 sm:p-10 shadow-xl border border-primary-500/10">
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Coluna Esquerda */}
            <div className="space-y-8">
              <div className="bg-tertiary-500 p-6 sm:p-8 rounded-2xl shadow-md border border-primary-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-1 bg-secondary-500 rounded-full"></div>
                  <h2 className="text-xl sm:text-2xl font-bold text-primary-500">Informações Básicas</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-primary-500 mb-2">Nome da Quadra</label>
                    <input
                      {...register("name")}
                      className="w-full px-4 py-3 rounded-xl
                        border border-primary-500/20
                        bg-tertiary-500 text-primary-500 placeholder-primary-500/50
                        focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-20
                        transition-colors duration-200"
                      placeholder="Digite o nome da quadra"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-primary-500 mb-2">Valor por Hora</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        {...register("pricePerHour")}
                        className="w-full pl-10 pr-4 py-3 rounded-xl
                          border border-primary-500/20
                          bg-tertiary-500 text-primary-500 placeholder-primary-500/50
                          focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-20
                          transition-colors duration-200"
                        placeholder="0,00"
                      />
                    </div>
                    {errors.pricePerHour && (
                      <p className="mt-1 text-sm text-red-600">{errors.pricePerHour.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-primary-500 mb-2">Descrição</label>
                    <textarea
                      {...register("description")}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl
                        border border-primary-500/20
                        bg-tertiary-500 text-primary-500 placeholder-primary-500/50
                        focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-20
                        transition-colors duration-200 resize-none"
                      placeholder="Descreva os detalhes da quadra"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-tertiary-500 p-6 sm:p-8 rounded-2xl shadow-md border border-primary-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-1 bg-secondary-500 rounded-full"></div>
                  <h2 className="text-xl sm:text-2xl font-bold text-primary-500">Endereço</h2>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-bold text-primary-500 mb-2">CEP</label>
                      <div className="relative">
                        <input
                          {...register("postalCode")}
                          onBlur={handleCepBlur}
                          maxLength={9}
                          className="w-full px-4 py-3 rounded-xl
                            border border-primary-500/20
                            bg-tertiary-500 text-primary-500 placeholder-primary-500/50
                            focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-20
                            transition-colors duration-200"
                          placeholder="00000-000"
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length > 5) {
                              value = value.slice(0, 5) + '-' + value.slice(5);
                            }
                            e.target.value = value;
                            register("postalCode").onChange(e);
                          }}
                        />
                        {isLoadingCep && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500" />
                          </div>
                        )}
                      </div>
                      {errors.postalCode && (
                        <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
                      )}
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-bold text-primary-500 mb-2">Número</label>
                      <input
                        {...register("number")}
                        className="w-full px-4 py-3 rounded-xl
                          border border-primary-500/20
                          bg-tertiary-500 text-primary-500 placeholder-primary-500/50
                          focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-20
                          transition-colors duration-200"
                        placeholder="Nº"
                      />
                      {errors.number && (
                        <p className="mt-1 text-sm text-red-600">{errors.number.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-primary-500 mb-2">Endereço</label>
                    <input
                      {...register("address")}
                      readOnly
                      disabled
                      className="w-full px-4 py-3 rounded-xl
                        border border-primary-500/20
                        bg-tertiary-500/50 text-primary-500/80
                        cursor-not-allowed"
                      placeholder="Preenchido automaticamente pelo CEP"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-primary-500 mb-2">Bairro</label>
                    <input
                      {...register("neighborhood")}
                      readOnly
                      disabled
                      className="w-full px-4 py-3 rounded-xl
                        border border-primary-500/20
                        bg-tertiary-500/50 text-primary-500/80
                        cursor-not-allowed"
                      placeholder="Preenchido automaticamente pelo CEP"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-primary-500 mb-2">Cidade/UF</label>
                    <div className="flex gap-2">
                      <input
                        {...register("city")}
                        readOnly
                        disabled
                        className="flex-1 px-4 py-3 rounded-xl
                          border border-primary-500/20
                          bg-tertiary-500/50 text-primary-500/80
                          cursor-not-allowed"
                        placeholder="Cidade"
                      />
                      <input
                        {...register("state")}
                        readOnly
                        disabled
                        className="w-20 px-4 py-3 rounded-xl
                          border border-primary-500/20
                          bg-tertiary-500/50 text-primary-500/80
                          cursor-not-allowed text-center uppercase"
                        placeholder="UF"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="space-y-8">
              <div className="bg-tertiary-500 p-6 sm:p-8 rounded-2xl shadow-md border border-primary-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-1 bg-secondary-500 rounded-full"></div>
                  <h2 className="text-xl sm:text-2xl font-bold text-primary-500">Categorias e Comodidades</h2>
                </div>
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-bold text-primary-500 mb-4">Categorias</label>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(CATEGORY_LABELS).map(([value, label]) => {
                        const categories = watch("categories") || [];
                        return (
                          <TagSelect
                            key={value}
                            value={value as Category}
                            label={label}
                            isSelected={categories.includes(value as Category)}
                            onChange={(value) => {
                              const current = categories;
                              const updated = current.includes(value as Category)
                                ? current.filter(v => v !== value)
                                : [...current, value];
                              setValue("categories", updated as Category[]);
                            }}
                          />
                        );
                      })}
                    </div>
                    {errors.categories && (
                      <p className="mt-2 text-sm text-red-600">{errors.categories.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-primary-500 mb-4">Comodidades</label>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(AMENITY_LABELS).map(([value, label]) => {
                        const amenities = watch("amenities") || [];
                        return (
                          <TagSelect
                            key={value}
                            value={value as Amenity}
                            label={label}
                            isSelected={amenities.includes(value as Amenity)}
                            onChange={(value) => {
                              const current = amenities;
                              const updated = current.includes(value as Amenity)
                                ? current.filter(v => v !== value)
                                : [...current, value];
                              setValue("amenities", updated as Amenity[]);
                            }}
                          />
                        );
                      })}
                    </div>
                    {errors.amenities && (
                      <p className="mt-2 text-sm text-red-600">{errors.amenities.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-tertiary-500 p-6 sm:p-8 rounded-2xl shadow-md border border-primary-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-1 bg-secondary-500 rounded-full"></div>
                  <h2 className="text-xl sm:text-2xl font-bold text-primary-500">Horários de Funcionamento</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-primary-500 mb-2">Dia da Semana</label>
                    <select
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(e.target.value as keyof typeof DIAS_SEMANA)}
                      className="w-full px-4 py-3 rounded-xl
                        border border-primary-500/20
                        bg-tertiary-500 text-primary-500
                        focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-20
                        transition-colors duration-200"
                    >
                      {Object.entries(DIAS_SEMANA).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-primary-500 mb-4">Horários Disponíveis</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {HORARIOS_DISPONIVEIS.map((horario) => {
                        const isSelected = watch('weeklySchedule')?.[selectedDay]?.includes(horario);
                        return (
                          <button
                            key={horario}
                            type="button"
                            onClick={() => handleHorarioChange(horario)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                              ${isSelected 
                                ? 'bg-secondary-500 text-primary-500 border-secondary-500' 
                                : 'bg-tertiary-500 text-primary-500/70 border-primary-500/20'} 
                              border hover:border-secondary-500`}
                          >
                            {horario}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm font-bold text-primary-500 mb-2">Horários Selecionados</h3>
                    <div className="space-y-2">
                      {Object.entries(DIAS_SEMANA).map(([day, label]) => {
                        const horarios = watch('weeklySchedule')?.[day as keyof WeeklySchedule] || [];
                        return horarios.length > 0 ? (
                          <div key={day} className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-primary-500">{label}:</span>
                            <span className="text-primary-500/70">{horarios.join(", ")}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botões de ação - sempre na parte inferior */}
            <div className="lg:col-span-2 flex flex-col sm:flex-row justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-auto px-8 py-4 text-primary-500 bg-tertiary-500 border-2 border-primary-500 rounded-xl
                  hover:bg-primary-500 hover:text-tertiary-500
                  transition-all duration-300 font-bold text-lg"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 text-primary-500 bg-secondary-500 rounded-xl
                  hover:bg-secondary-600 transition-all duration-300
                  shadow-lg hover:shadow-xl font-bold text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
                    <span>Criando...</span>
                  </div>
                ) : (
                  "Criar Quadra"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 