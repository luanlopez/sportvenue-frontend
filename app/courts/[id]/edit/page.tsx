"use client";

import { useState, useEffect, use } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { Amenity, AMENITY_LABELS, Category, CATEGORY_LABELS, courtService, UpdateCourtDTO } from "@/services/courts";
import { showToast } from "@/components/ui/Toast";
import { FiUpload } from 'react-icons/fi';
import { ImageWithSkeleton } from "@/components/ui/ImageWithSkeleton";
import { TagSelect } from "@/components/ui/TagSelect";

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
        const court = await courtService.getCourtById(id);
        setCurrentImages(court.images || []);
        Object.entries(court).forEach(([key, value]) => {
          if (key in schema.fields) {
            setValue(key as keyof UpdateCourtDTO, value);
          }
        });
      } catch {
        showToast.error("Erro", "Não foi possível carregar os dados da quadra");
        router.push("/home");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourt();
  }, [id, router, setValue]);

  const onSubmit = async (data: UpdateCourtDTO) => {
    try {
      await courtService.updateCourt(id, data);
      showToast.success("Sucesso", "Quadra atualizada com sucesso");
      router.push("/home");
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
      await courtService.uploadImages(id, selectedFiles);
      showToast.success("Sucesso", "Imagens enviadas com sucesso");
      setSelectedFiles([]);
    } catch {
      showToast.error("Erro", "Não foi possível enviar as imagens");
    }
  };

  const handleRemoveImages = async () => {
    try {
      const remainingImages = currentImages.filter(img => !selectedImagesToRemove.includes(img));
      await courtService.removeImages(id, remainingImages);
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
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Editar Quadra</h1>
        
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
                      {...register("pricePerHour")}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-black"
                    />
                    {errors.pricePerHour && (
                      <p className="mt-1 text-sm text-red-600">{errors.pricePerHour.message}</p>
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
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-white bg-primary-500 rounded-md hover:bg-primary-600 transition-colors"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>

          <div className="lg:w-96">
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900">Imagens da Quadra</h2>
              
              {currentImages.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Imagens Atuais</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {currentImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <ImageWithSkeleton
                          src={imageUrl}
                          alt={`Court ${index + 1}`}
                          className={`w-full h-24 object-cover rounded-lg ${
                            selectedImagesToRemove.includes(imageUrl) ? 'opacity-50' : ''
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => toggleImageSelection(imageUrl)}
                          className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg
                            ${selectedImagesToRemove.includes(imageUrl) ? 'bg-opacity-30' : ''}`}
                        >
                          <span className={`text-white transform scale-0 group-hover:scale-100 transition-transform
                            ${selectedImagesToRemove.includes(imageUrl) ? 'scale-100' : ''}`}>
                            {selectedImagesToRemove.includes(imageUrl) ? 'Selecionada' : 'Selecionar'}
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                  {selectedImagesToRemove.length > 0 && (
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={handleRemoveImages}
                        className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors"
                      >
                        Remover Selecionadas ({selectedImagesToRemove.length})
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Adicionar Novas Imagens</h3>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FiUpload className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG ou JPEG (MAX. 800x400px)</p>
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
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        {selectedFiles.length} arquivo(s) selecionado(s)
                      </p>
                      <button
                        type="button"
                        onClick={handleUpload}
                        className="px-4 py-2 text-sm text-white bg-primary-500 rounded-md hover:bg-primary-600 transition-colors"
                      >
                        Enviar Imagens
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="relative">
                          <ImageWithSkeleton
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
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