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
    const cep = e.target.value;
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
    <div className="min-h-screen bg-tertiary-500 py-20 sm:py-20 mt-28 sm:mt-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-500 mb-8">Criar Nova Quadra</h1>
        
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-tertiary-500 p-8 rounded-2xl shadow-md border border-primary-500">
              <h2 className="text-xl font-bold text-primary-500 mb-6">Informações Básicas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
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

                <div className="md:col-span-2">
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

            <div className="bg-tertiary-500 p-8 rounded-2xl shadow-md border border-primary-500">
              <h2 className="text-xl font-bold text-primary-500 mb-6">Endereço</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-primary-500 mb-2">CEP</label>
                  <div className="relative">
                    <input
                      {...register("postalCode")}
                      onBlur={handleCepBlur}
                      maxLength={8}
                      className="w-full px-4 py-3 rounded-xl
                        border border-primary-500/20
                        bg-tertiary-500 text-primary-500 placeholder-primary-500/50
                        focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-20
                        transition-colors duration-200"
                      placeholder="Digite apenas números"
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

                <div>
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

                <div className="md:col-span-2">
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

            <div className="bg-tertiary-500 p-8 rounded-2xl shadow-md border border-primary-500">
              <h2 className="text-xl font-bold text-primary-500 mb-6">Horários e Categorias</h2>
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

            <div className="bg-tertiary-500 p-8 rounded-2xl shadow-md border border-primary-500">
              <h2 className="text-xl font-bold text-primary-500 mb-6">Horários de Funcionamento</h2>
              <WeeklyScheduleSelector
                value={watch('weeklySchedule') || defaultSchedule}
                onChange={(schedule) => setValue('weeklySchedule', schedule)}
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 text-primary-500 bg-tertiary-500 border border-primary-500 rounded-full
                  hover:bg-primary-500 hover:text-tertiary-500
                  transition-colors duration-200 font-bold"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-3 text-primary-500 bg-secondary-500 rounded-full
                  hover:bg-secondary-600 transition-colors duration-200
                  shadow-md hover:shadow-lg font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Criando..." : "Criar Quadra"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 