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
import { WeeklyScheduleSelector } from "@/components/ui/WeeklyScheduleSelector";
import { WeeklySchedule } from "@/types/courts";
import { PostalCode } from "@/components/ui/PostalCode";
import { Select } from "@/components/ui/Select";
import { STATES } from "@/constants/states";

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
  pricePerHour: yup.number().required("Preço por hora é obrigatório"),
  amenities: yup.array(yup.string().defined()).required().min(1),
  categories: yup.array(yup.string().defined()).required().min(1),
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

export default function CreateCourt() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-2 sm:px-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Criar Nova Quadra</h1>
        
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">

          <div className="flex-1">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Informações Básicas</h2>
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome da Quadra</label>
                    <input
                      {...register("name")}
                      className="mt-2 block w-full px-4 py-3 rounded-md 
                        border border-gray-300 
                        bg-white text-gray-900 placeholder-gray-400
                        focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20
                        transition-colors duration-200"
                      placeholder="Digite o nome da quadra"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Valor por Hora</label>
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        {...register("pricePerHour")}
                        className="block w-full pl-10 pr-4 py-3 rounded-md 
                          border border-gray-300 
                          bg-white text-gray-900 placeholder-gray-400
                          focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20
                          transition-colors duration-200"
                        placeholder="0,00"
                      />
                    </div>
                    {errors.pricePerHour && (
                      <p className="mt-1 text-sm text-red-600">{errors.pricePerHour.message}</p>
                    )}
                  </div>

                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Descrição</label>
                    <textarea
                      {...register("description")}
                      rows={3}
                      className="mt-2 block w-full px-4 py-3 rounded-md 
                        border border-gray-300 
                        bg-white text-gray-900 placeholder-gray-400
                        focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20
                        transition-colors duration-200 resize-none"
                      placeholder="Descreva os detalhes da quadra"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Endereço</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="col-span-2 md:col-span-1">
                    <PostalCode
                      value={watch("postalCode") || ""}
                      onChange={(value) => setValue("postalCode", value)}
                      error={errors.postalCode?.message}
                    />
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <Select
                      label="Estado"
                      value={watch("state") || ""}
                      onChange={(value) => setValue("state", value)}
                      options={STATES}
                      error={errors.state?.message}
                      placeholder="Selecione um estado"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Endereço</label>
                    <input
                      {...register("address")}
                      className="mt-2 block w-full px-4 py-3 rounded-md 
                        border border-gray-300 
                        bg-white text-gray-900 placeholder-gray-400
                        focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20
                        transition-colors duration-200"
                      placeholder="Rua, Avenida..."
                    />
                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Número</label>
                    <input
                      {...register("number")}
                      className="mt-2 block w-full px-4 py-3 rounded-md 
                        border border-gray-300 
                        bg-white text-gray-900 placeholder-gray-400
                        focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20
                        transition-colors duration-200"
                      placeholder="Nº"
                    />
                    {errors.number && <p className="mt-1 text-sm text-red-600">{errors.number.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bairro</label>
                    <input
                      {...register("neighborhood")}
                      className="mt-2 block w-full px-4 py-3 rounded-md 
                        border border-gray-300 
                        bg-white text-gray-900 placeholder-gray-400
                        focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20
                        transition-colors duration-200"
                      placeholder="Digite o bairro"
                    />
                    {errors.neighborhood && (
                      <p className="mt-1 text-sm text-red-600">{errors.neighborhood.message}</p>
                    )}
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Cidade</label>
                    <input
                      {...register("city")}
                      className="mt-2 block w-full px-4 py-3 rounded-md 
                        border border-gray-300 
                        bg-white text-gray-900 placeholder-gray-400
                        focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20
                        transition-colors duration-200"
                      placeholder="Digite a cidade"
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Horários e Categorias</h2>
                <div className="space-y-4 sm:space-y-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">Categorias</label>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">Comodidades</label>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
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

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Horários de Funcionamento</h2>
                <WeeklyScheduleSelector
                  value={watch('weeklySchedule') || defaultSchedule}
                  onChange={(schedule) => setValue('weeklySchedule', schedule)}
                />
                {errors.weeklySchedule && (
                  <p className="mt-1 text-sm text-red-600">{errors.weeklySchedule.message}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 sm:px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm sm:text-base"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 sm:px-6 py-2 text-white bg-primary-500 rounded-md hover:bg-primary-600 text-sm sm:text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Criando..." : "Criar Quadra"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 