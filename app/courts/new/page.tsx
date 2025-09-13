"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Amenity,
  AMENITY_LABELS,
  Category,
  CATEGORY_LABELS,
  courtService,
} from "@/services/courts";
import { showToast } from "@/components/ui/Toast";
import { TagSelect } from "@/components/ui/TagSelect";
import { useAuth } from "@/hooks/useAuth";
import { WeeklySchedule } from "@/types/courts";
import { cepService } from "@/services/cep";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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

const HORARIOS_DISPONIVEIS = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

const DIAS_SEMANA = {
  monday: "Segunda-feira",
  tuesday: "Terça-feira",
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
  saturday: "Sábado",
  sunday: "Domingo",
};

const steps = [
  "Informações Básicas",
  "Endereço",
  "Categorias e Comodidades",
  "Horários de Funcionamento",
  "Resumo",
];

const schema: yup.ObjectSchema<CreateCourtDTO> = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  description: yup.string().required("Descrição é obrigatória"),
  address: yup.string().required("Endereço é obrigatório"),
  neighborhood: yup.string().required("Bairro é obrigatório"),
  city: yup.string().required("Cidade é obrigatória"),
  number: yup.string().required("Número é obrigatório"),
  postalCode: yup.string().required("CEP é obrigatório"),
  state: yup.string().required("Estado é obrigatório"),
  pricePerHour: yup
    .number()
    .typeError("O valor deve ser um número")
    .required("Valor por hora é obrigatório")
    .positive("O valor deve ser maior que zero")
    .min(0.01, "O valor mínimo é R$ 0,01"),
  amenities: yup
    .array(yup.string().defined())
    .required("Selecione pelo menos uma comodidade")
    .min(1, "Selecione pelo menos uma comodidade"),
  categories: yup
    .array(yup.string().defined())
    .required("Selecione pelo menos uma categoria")
    .min(1, "Selecione pelo menos uma categoria"),
  images: yup.array(yup.string().defined()).required(),
  ownerId: yup.string().required("Id do proprietário é obrigatório"),
  weeklySchedule: yup
    .object()
    .shape({
      monday: yup.array(yup.string().defined()).default([]),
      tuesday: yup.array(yup.string().defined()).default([]),
      wednesday: yup.array(yup.string().defined()).default([]),
      thursday: yup.array(yup.string().defined()).default([]),
      friday: yup.array(yup.string().defined()).default([]),
      saturday: yup.array(yup.string().defined()).default([]),
      sunday: yup.array(yup.string().defined()).default([]),
    })
    .required("Horários são obrigatórios"),
});

export default function CreateCourt() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedDay, setSelectedDay] =
    useState<keyof WeeklySchedule>("monday");

  const { register, handleSubmit, setValue, watch, trigger, formState: { errors } } =
    useForm<CreateCourtDTO>({
      resolver: yupResolver(schema),
      defaultValues: {
        name: "",
        description: "",
        address: "",
        neighborhood: "",
        city: "",
        number: "",
        postalCode: "",
        state: "",
        pricePerHour: 0,
        amenities: [],
        categories: [],
        images: [],
        ownerId: user?.id || "",
        weeklySchedule: {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: [],
        },
      },
    });

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, "");
    if (!cep || cep.length !== 8) return;
    try {
      const address = await cepService.findAddress(cep);
      setValue("address", address.logradouro || "");
      setValue("neighborhood", address.bairro || "");
      setValue("city", address.localidade || "");
      setValue("state", address.uf || "");
    } catch {
      showToast.error("Erro", "CEP não encontrado");
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof CreateCourtDTO)[] = [];
    if (step === 0) fieldsToValidate = ["name", "pricePerHour", "description"];
    if (step === 1)
      fieldsToValidate = [
        "postalCode",
        "number",
        "address",
        "neighborhood",
        "city",
        "state",
      ];
    if (step === 2) fieldsToValidate = ["categories", "amenities"];
    if (step === 3) fieldsToValidate = ["weeklySchedule"];
    const valid = await trigger(fieldsToValidate as (keyof CreateCourtDTO)[]);
    if (valid) setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (data: CreateCourtDTO) => {
    try {
      setIsSubmitting(true);
      await courtService.createCourt(data);
      showToast.success("Sucesso", "Quadra criada com sucesso");
      router.push("/");
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data: { code?: string; title?: string; message?: string } } };
        if (axiosError.response?.data?.code === "SUB003") {
          showToast.error(
            axiosError.response.data.title || "Limite de Quadras Atingido",
            axiosError.response.data.message || "Você atingiu o limite de quadras do seu plano atual. Faça um upgrade para adicionar mais quadras."
          );
        } else {
          showToast.error("Erro", "Não foi possível criar a quadra");
        }
      } else {
        showToast.error("Erro", "Não foi possível criar a quadra");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          {steps.map((label, idx) => (
            <div key={label} className="flex-1 flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                  idx <= step ? "bg-primary-50" : "bg-slate-300"
                }`}
              >
                {idx + 1}
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 ${
                    idx < step ? "bg-primary-50" : "bg-slate-200"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          {step === 0 && (
            <>
              <h2 className="text-xl font-bold mb-6">Informações Básicas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nome da Quadra
                  </label>
                  <input
                    {...register("name")}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:border-primary-50 focus:ring-2 focus:ring-primary-50/20 transition"
                    placeholder="Digite o nome da quadra"
                  />
                  {errors.name && (
                    <span className="text-red-500 text-sm mt-1 block">{errors.name.message}</span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Valor por Hora
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      R$
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      {...register("pricePerHour")}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:border-primary-50 focus:ring-2 focus:ring-primary-50/20 transition"
                      placeholder="0,00"
                    />
                  </div>
                  {errors.pricePerHour && (
                    <span className="text-red-500 text-sm mt-1 block">{errors.pricePerHour.message}</span>
                  )}
                </div>
              </div>
              <div className="mt-8">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Descrição
                </label>
                <textarea
                  {...register("description")}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:border-primary-50 focus:ring-2 focus:ring-primary-50/20 transition resize-none"
                  placeholder="Descreva os detalhes da quadra"
                />
                {errors.description && (
                  <span className="text-red-500 text-sm mt-1 block">{errors.description.message}</span>
                )}
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <h2 className="text-xl font-bold mb-6">Endereço</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    CEP
                  </label>
                  <input
                    {...register("postalCode")}
                    onBlur={handleCepBlur}
                    maxLength={9}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:border-primary-50 focus:ring-2 focus:ring-primary-50/20 transition"
                    placeholder="00000-000"
                  />
                  {errors.postalCode && (
                    <span className="text-red-500 text-sm mt-1 block">{errors.postalCode.message}</span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Número
                  </label>
                  <input
                    {...register("number")}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:border-primary-50 focus:ring-2 focus:ring-primary-50/20 transition"
                    placeholder="Nº"
                  />
                  {errors.number && (
                    <span className="text-red-500 text-sm mt-1 block">{errors.number.message}</span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Endereço
                  </label>
                  <input
                    {...register("address")}
                    readOnly
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-700"
                    placeholder="Preenchido automaticamente pelo CEP"
                  />
                  {errors.address && (
                    <span className="text-red-500 text-sm mt-1 block">{errors.address.message}</span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Bairro
                  </label>
                  <input
                    {...register("neighborhood")}
                    readOnly
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-700"
                    placeholder="Preenchido automaticamente pelo CEP"
                  />
                  {errors.neighborhood && (
                    <span className="text-red-500 text-sm mt-1 block">{errors.neighborhood.message}</span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Cidade
                  </label>
                  <input
                    {...register("city")}
                    readOnly
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-700"
                    placeholder="Cidade"
                  />
                  {errors.city && (
                    <span className="text-red-500 text-sm mt-1 block">{errors.city.message}</span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    UF
                  </label>
                  <input
                    {...register("state")}
                    readOnly
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 text-center uppercase"
                    placeholder="UF"
                  />
                  {errors.state && (
                    <span className="text-red-500 text-sm mt-1 block">{errors.state.message}</span>
                  )}
                </div>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="text-xl font-bold mb-6">
                Categorias e Comodidades
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-4">
                    Categorias
                  </label>
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
                              ? current.filter((v) => v !== value)
                              : [...current, value];
                            setValue("categories", updated as Category[]);
                          }}
                        />
                      );
                    })}
                  </div>
                  {errors.categories && (
                    <span className="text-red-500 text-sm mt-1 block">{errors.categories.message}</span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-4">
                    Comodidades
                  </label>
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
                              ? current.filter((v) => v !== value)
                              : [...current, value];
                            setValue("amenities", updated as Amenity[]);
                          }}
                        />
                      );
                    })}
                  </div>
                  {errors.amenities && (
                    <span className="text-red-500 text-sm mt-1 block">{errors.amenities.message}</span>
                  )}
                </div>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h2 className="text-xl font-bold mb-6">
                Horários de Funcionamento
              </h2>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Dia da Semana
                </label>
                <select
                  value={selectedDay}
                  onChange={(e) =>
                    setSelectedDay(e.target.value as keyof WeeklySchedule)
                  }
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 focus:border-primary-50 focus:ring-2 focus:ring-primary-50/20 transition"
                >
                  {Object.entries(DIAS_SEMANA).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-4">
                  Horários Disponíveis
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {HORARIOS_DISPONIVEIS.map((horario) => {
                    const horarios = watch("weeklySchedule")[selectedDay] || [];
                    const isSelected = horarios.includes(horario);
                    return (
                      <button
                        key={horario}
                        type="button"
                        onClick={() => {
                          const current =
                            watch("weeklySchedule")[selectedDay] || [];
                          const updated = isSelected
                            ? current.filter((h: string) => h !== horario)
                            : [...current, horario].sort();
                          setValue(`weeklySchedule.${selectedDay}`, updated);
                        }}
                        className={`px-3 py-2 rounded-lg text-sm font-medium border transition
                          ${
                            isSelected
                              ? "bg-primary-50 text-white border-primary-50"
                              : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-primary-50/10"
                          }`}
                      >
                        {horario}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">
                  Horários Selecionados
                </h3>
                <div className="space-y-2">
                  {Object.entries(DIAS_SEMANA).map(([day, label]) => {
                    const horariosRaw =
                      watch("weeklySchedule")[day as keyof WeeklySchedule];
                    const horarios = Array.isArray(horariosRaw)
                      ? horariosRaw
                      : [];
                    return horarios.length > 0 ? (
                      <div
                        key={day}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="font-medium text-slate-700">
                          {label}:
                        </span>
                        <span className="text-slate-500">
                          {horarios.join(", ")}
                        </span>
                      </div>
                    ) : null;
                  })}
                </div>
                {errors.weeklySchedule && (
                  <span className="text-red-500 text-sm mt-1 block">{errors.weeklySchedule.message}</span>
                )}
              </div>
            </>
          )}
          {step === 4 && (
            <>
              <h2 className="text-xl font-bold mb-6">Resumo</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-700 mb-2">
                    Informações Básicas
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="font-medium">Nome:</span> {watch("name")}
                    </div>
                    <div>
                      <span className="font-medium">Valor por Hora:</span> R${" "}
                      {watch("pricePerHour")}
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-medium">Descrição:</span>{" "}
                      {watch("description")}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-700 mb-2">
                    Endereço
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="font-medium">Endereço:</span>{" "}
                      {watch("address")}, {watch("number")}
                    </div>
                    <div>
                      <span className="font-medium">Bairro:</span>{" "}
                      {watch("neighborhood")}
                    </div>
                    <div>
                      <span className="font-medium">Cidade:</span>{" "}
                      {watch("city")} - {watch("state")}
                    </div>
                    <div>
                      <span className="font-medium">CEP:</span>{" "}
                      {watch("postalCode")}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-700 mb-2">
                    Categorias
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {watch("categories").map((cat: string) => (
                      <span
                        key={cat}
                        className="px-3 py-1 rounded-full bg-primary-50 text-white text-sm font-medium"
                      >
                        {CATEGORY_LABELS[cat as Category]}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-700 mb-2">
                    Comodidades
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {watch("amenities").map((a: string) => (
                      <span
                        key={a}
                        className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-medium"
                      >
                        {AMENITY_LABELS[a as Amenity]}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-700 mb-2">
                    Horários de Funcionamento
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(DIAS_SEMANA).map(([day, label]) => {
                      const horariosRaw =
                        watch("weeklySchedule")[day as keyof WeeklySchedule];
                      const horarios = Array.isArray(horariosRaw)
                        ? horariosRaw
                        : [];
                      return horarios.length > 0 ? (
                        <div key={day}>
                          <span className="font-medium">{label}:</span>{" "}
                          {horarios.join(", ")}
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex justify-between mt-8">
          {step > 0 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 rounded-full bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition"
            >
              Voltar
            </button>
          )}
          {step < steps.length - 1 && (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-3 rounded-full bg-primary-50 text-white font-bold shadow hover:bg-primary-100 transition"
            >
              Próximo
            </button>
          )}
          {step === steps.length - 1 && (
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="px-6 py-3 rounded-full bg-success-50 text-white font-bold shadow hover:bg-success-50/80 transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Cadastrando..." : "Confirmar Cadastro"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
