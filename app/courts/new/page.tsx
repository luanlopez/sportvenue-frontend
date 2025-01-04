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

interface CreateCourtDTO {
  name: string;
  description: string;
  address: string;
  neighborhood: string;
  city: string;
  number: string;
  price_per_hour: number;
  availableHours: string[];
  amenities: Amenity[];
  categories: Category[];
  images: string[];
  ownerId: string;
  reason?: string;
}

const schema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  description: yup.string().required("Descrição é obrigatória"),
  address: yup.string().required("Endereço é obrigatório"),
  neighborhood: yup.string().required("Bairro é obrigatório"),
  city: yup.string().required("Cidade é obrigatória"),
  number: yup.string().required("Número é obrigatório"),
  price_per_hour: yup.number()
    .typeError("Preço deve ser um número")
    .min(0, "Preço deve ser maior que zero")
    .required("Preço é obrigatório"),
  availableHours: yup.array().of(yup.string().required()).required().min(1, "Selecione pelo menos um horário"),
  amenities: yup.array().of(yup.string().required()).required().min(1, "Selecione pelo menos uma comodidade"),
  categories: yup.array().of(yup.string().required()).required().min(1, "Selecione pelo menos uma categoria"),
  images: yup.array().of(yup.string()).default([]),
  ownerId: yup.string().required("ID do proprietário é obrigatório"),
  reason: yup.string().optional()
}) as yup.ObjectSchema<CreateCourtDTO>;

export default function CreateCourt() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CreateCourtDTO>({
    resolver: yupResolver(schema),
    defaultValues: {
      availableHours: [],
      amenities: [],
      categories: [],
      images: [],
      ownerId: user?.id || ""
    }
  });

  const generateHourlyTimes = () => {
    const times = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0');
      times.push(`${hour}:00`);
    }
    return times;
  };

  const onSubmit = async (data: CreateCourtDTO) => {
    try {
      setIsSubmitting(true);
      await courtService.createCourt(data);
      showToast.success("Sucesso", "Quadra criada com sucesso");
      router.push("/home");
    } catch {
      showToast.error("Erro", "Não foi possível criar a quadra");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Criar Nova Quadra</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">

          <div className="flex-1">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome da Quadra</label>
                    <input
                      {...register("name")}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-black"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Valor por Hora</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("price_per_hour")}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-black"
                    />
                    {errors.price_per_hour && (
                      <p className="mt-1 text-sm text-red-600">{errors.price_per_hour.message}</p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Descrição</label>
                    <textarea
                      {...register("description")}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-black"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Endereço</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Endereço</label>
                    <input
                      {...register("address")}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-black"
                    />
                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Número</label>
                    <input
                      {...register("number")}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-black"
                    />
                    {errors.number && <p className="mt-1 text-sm text-red-600">{errors.number.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bairro</label>
                    <input
                      {...register("neighborhood")}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-black"
                    />
                    {errors.neighborhood && (
                      <p className="mt-1 text-sm text-red-600">{errors.neighborhood.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cidade</label>
                    <input
                      {...register("city")}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-black"
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Horários e Categorias</h2>
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Categorias</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-3">Comodidades</label>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Horários Disponíveis
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {generateHourlyTimes().map((time) => {
                        const hours = watch("availableHours") || [];
                        return (
                          <TagSelect
                            key={time}
                            value={time}
                            label={time}
                            isSelected={hours.includes(time)}
                            onChange={(value) => {
                              const current = hours;
                              const updated = current.includes(value as string)
                                ? current.filter(v => v !== value)
                                : [...current, value];
                              setValue("availableHours", updated as string[]);
                            }}
                          />
                        );
                      })}
                    </div>
                    {errors.availableHours && (
                      <p className="mt-2 text-sm text-red-600">{errors.availableHours.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-white bg-primary-500 rounded-md hover:bg-primary-600 transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed"
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