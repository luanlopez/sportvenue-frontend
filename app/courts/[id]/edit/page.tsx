"use client";

import { useState, useEffect, use } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { Amenity, AMENITY_LABELS, Category, CATEGORY_LABELS, courtService, UpdateCourtDTO } from "@/services/courts";
import { showToast } from "@/components/ui/Toast";
import { FiUpload, FiSave, FiX, FiTrash2 } from 'react-icons/fi';
import { ImageWithSkeleton } from "@/components/ui/ImageWithSkeleton";
import { TagSelect } from "@/components/ui/TagSelect";
import { decryptId } from "@/lib/utils";

const schema: yup.ObjectSchema<UpdateCourtDTO> = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  description: yup.string().required("Descrição é obrigatória"),
  address: yup.string().required("Endereço é obrigatório"),
  neighborhood: yup.string().required("Bairro é obrigatório"),
  city: yup.string().required("Cidade é obrigatória"),
  number: yup.string().required("Número é obrigatório"),
  pricePerHour: yup.number().required("Preço por hora é obrigatório"),
  amenities: yup.array(yup.mixed<Amenity>().defined()).required(),
  categories: yup.array(yup.mixed<Category>().defined()).required(),
  images: yup.array(yup.string().defined()).required(),
  weeklySchedule: yup.object().shape({
    monday: yup.array(yup.string().defined()).default([]),
    tuesday: yup.array(yup.string().defined()).default([]),
    wednesday: yup.array(yup.string().defined()).default([]),
    thursday: yup.array(yup.string().defined()).default([]),
    friday: yup.array(yup.string().defined()).default([]),
    saturday: yup.array(yup.string().defined()).default([]),
    sunday: yup.array(yup.string().defined()).default([]),
  }).required()
});

export default function EditCourt({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const realId = decryptId(id as string);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [selectedImagesToRemove, setSelectedImagesToRemove] = useState<string[]>([]);

  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm<UpdateCourtDTO>({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    const fetchCourt = async () => {
      try {
        const court = await courtService.getCourtById(realId);
        setCurrentImages(court.images || []);
        Object.entries(court).forEach(([key, value]) => {
          if (key in schema.fields) {
            setValue(key as keyof UpdateCourtDTO, value);
          }
        });
      } catch {
        showToast.error("Erro", "Não foi possível carregar os dados da quadra");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourt();
  }, [realId, router, setValue]);

  const onSubmit = async (data: UpdateCourtDTO) => {
    try {
      await courtService.updateCourt(realId, data);
      showToast.success("Sucesso", "Quadra atualizada com sucesso");
      router.push("/");
    } catch {
      showToast.error("Erro", "Não foi possível atualizar a quadra");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleUpload = async () => {
    try {
      await courtService.uploadImages(realId, selectedFiles);
      showToast.success("Sucesso", "Imagens enviadas com sucesso");
      setSelectedFiles([]);
    } catch {
      showToast.error("Erro", "Não foi possível enviar as imagens");
    }
  };

  const handleRemoveImages = async () => {
    try {
      const remainingImages = currentImages.filter(img => !selectedImagesToRemove.includes(img));
      await courtService.removeImages(realId, remainingImages);
      setCurrentImages(remainingImages);
      setSelectedImagesToRemove([]);
      showToast.success("Sucesso", "Imagens atualizadas com sucesso");
    } catch {
      showToast.error("Erro", "Não foi possível atualizar as imagens");
    }
  };

  const toggleImageSelection = (imageUrl: string) => {
    setSelectedImagesToRemove(prev => 
      prev.includes(imageUrl)
        ? prev.filter(url => url !== imageUrl)
        : [...prev, imageUrl]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Editar Quadra</h1>
          <p className="text-slate-600">Atualize as informações da sua quadra</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Informações Básicas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nome da Quadra</label>
                    <input
                      {...register("name")}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-colors"
                      placeholder="Digite o nome da quadra"
                    />
                    {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Valor por Hora</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        {...register("pricePerHour")}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-colors"
                        placeholder="0,00"
                      />
                    </div>
                    {errors.pricePerHour && (
                      <p className="mt-2 text-sm text-red-600">{errors.pricePerHour.message}</p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Descrição</label>
                    <textarea
                      {...register("description")}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-colors resize-none"
                      placeholder="Descreva sua quadra..."
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Endereço</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Endereço</label>
                    <input
                      {...register("address")}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-colors"
                      placeholder="Rua, Avenida, etc."
                    />
                    {errors.address && <p className="mt-2 text-sm text-red-600">{errors.address.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Número</label>
                    <input
                      {...register("number")}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-colors"
                      placeholder="123"
                    />
                    {errors.number && <p className="mt-2 text-sm text-red-600">{errors.number.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Bairro</label>
                    <input
                      {...register("neighborhood")}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-colors"
                      placeholder="Centro"
                    />
                    {errors.neighborhood && <p className="mt-2 text-sm text-red-600">{errors.neighborhood.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Cidade</label>
                    <input
                      {...register("city")}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-colors"
                      placeholder="São Paulo"
                    />
                    {errors.city && <p className="mt-2 text-sm text-red-600">{errors.city.message}</p>}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Esportes e Comodidades</h2>
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-4">Esportes Disponíveis</label>
                    <div className="flex flex-wrap gap-3">
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
                      <p className="mt-3 text-sm text-red-600">{errors.categories.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-4">Comodidades</label>
                    <div className="flex flex-wrap gap-3">
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
                      <p className="mt-3 text-sm text-red-600">{errors.amenities.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                >
                  <FiX className="w-5 h-5" />
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 text-white bg-sky-500 rounded-xl hover:bg-sky-600 transition-colors font-medium shadow-sm"
                >
                  <FiSave className="w-5 h-5" />
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-8 space-y-6">
              <h2 className="text-xl font-semibold text-slate-900">Gerenciar Imagens</h2>
              
              {currentImages.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-4">Imagens Atuais</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {currentImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <ImageWithSkeleton
                          src={imageUrl}
                          alt={`Court ${index + 1}`}
                          className={`w-full h-20 object-cover rounded-lg transition-opacity ${
                            selectedImagesToRemove.includes(imageUrl) ? 'opacity-50' : ''
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => toggleImageSelection(imageUrl)}
                          className={`absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all rounded-lg ${
                            selectedImagesToRemove.includes(imageUrl) ? 'bg-black/30' : ''
                          }`}
                        >
                          <div className={`text-white transform scale-0 group-hover:scale-100 transition-transform ${
                            selectedImagesToRemove.includes(imageUrl) ? 'scale-100' : ''
                          }`}>
                            {selectedImagesToRemove.includes(imageUrl) ? (
                              <FiTrash2 className="w-5 h-5" />
                            ) : (
                              <span className="text-xs font-medium">Selecionar</span>
                            )}
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                  {selectedImagesToRemove.length > 0 && (
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={handleRemoveImages}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Remover ({selectedImagesToRemove.length})
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-700">Adicionar Novas Imagens</h3>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FiUpload className="w-8 h-8 mb-3 text-slate-400" />
                      <p className="mb-2 text-sm text-slate-600">
                        <span className="font-medium">Clique para fazer upload</span>
                      </p>
                      <p className="text-xs text-slate-500">PNG, JPG ou JPEG</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-600">
                        {selectedFiles.length} arquivo(s) selecionado(s)
                      </p>
                      <button
                        type="button"
                        onClick={handleUpload}
                        className="px-4 py-2 text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition-colors text-sm font-medium"
                      >
                        Enviar
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="relative">
                          <ImageWithSkeleton
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 