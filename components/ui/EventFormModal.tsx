import { useState, useRef } from "react";
import { createEvent } from "@/services/events";
import { FaYoutube, FaTwitch, FaFacebook, FaRegCalendarAlt } from "react-icons/fa";

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  courtId: string;
}

const streamingOptions = [
  { value: "YOUTUBE", label: "YouTube", icon: <FaYoutube className="text-red-600 text-3xl" /> },
  { value: "TWITCH", label: "Twitch", icon: <FaTwitch className="text-purple-600 text-3xl" /> },
  { value: "FACEBOOK", label: "Facebook", icon: <FaFacebook className="text-blue-600 text-3xl" /> },
];

const typeOptions = [
  { value: "TOURNAMENT", label: "Torneio" },
  { value: "FRIENDLY", label: "Amistoso" },
  { value: "TRAINING", label: "Treinamento" },
];

export function EventFormModal({
  isOpen,
  onClose,
  courtId,
}: EventFormModalProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    startDate: "",
    endDate: "",
    price: 0,
    type: "TOURNAMENT",
    rules: "",
    isLive: false,
    streamingPlatform: "YOUTUBE",
    streamingUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleStreamingSelect = (value: string) => {
    setForm((prev) => ({ ...prev, streamingPlatform: value }));
  };

  const handleTypeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, type: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createEvent({ ...form, courtId });
      onClose();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        setError((err as unknown as { response: { data: { message: string } } })?.response?.data?.message || "Erro ao criar evento");
      } else {
        setError("Erro ao criar evento");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[300] p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden animate-enter relative">
        <div className="p-6 pb-28">
          <h2 className="text-2xl font-bold mb-6">Adicionar Evento</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="col-span-1">
              <label className="block font-semibold mb-1">Nome do evento *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nome do evento"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block font-semibold mb-1">Descrição</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Descrição"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition min-h-[42px]"
              />
            </div>
            <div className="col-span-1">
              <label className="block font-semibold mb-1">URL da imagem *</label>
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="Cole a URL da imagem"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                required
              />
              {form.image && (
                <img src={form.image} alt="Preview" className="mt-3 rounded-lg shadow max-h-32 mx-auto" />
              )}
            </div>
            <div className="col-span-1 grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Início *</label>
                <div className="relative">
                  <input
                    ref={startDateRef}
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    type="datetime-local"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition cursor-pointer"
                    required
                  />
                  <FaRegCalendarAlt
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer text-xl"
                    onClick={() => startDateRef.current?.showPicker && startDateRef.current.showPicker()}
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Fim *</label>
                <div className="relative">
                  <input
                    ref={endDateRef}
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    type="datetime-local"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition cursor-pointer"
                    required
                  />
                  <FaRegCalendarAlt
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer text-xl"
                    onClick={() => endDateRef.current?.showPicker && endDateRef.current.showPicker()}
                  />
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <label className="block font-semibold mb-1">Preço *</label>
              <div className="flex items-center rounded-lg border border-gray-300 px-2 py-1 bg-white">
                <span className="text-gray-500 mr-2">R$</span>
                <input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  type="number"
                  step="0.01"
                  placeholder="Preço"
                  className="w-full border-none outline-none focus:ring-0 px-2 py-1"
                  required
                />
              </div>
            </div>
            <div className="col-span-1">
              <label className="block font-semibold mb-1">Tipo *</label>
              <select
                name="type"
                value={form.type}
                onChange={handleTypeSelect}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                required
              >
                {typeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block font-semibold mb-1">Regras</label>
              <textarea
                name="rules"
                value={form.rules}
                onChange={handleChange}
                placeholder="Regras"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition min-h-[42px]"
              />
            </div>
            <div className="col-span-2 flex items-center gap-2 mb-2">
              <input
                name="isLive"
                type="checkbox"
                checked={form.isLive}
                onChange={handleChange}
                id="isLive"
              />
              <label htmlFor="isLive">Evento ao vivo?</label>
            </div>
            <div className="col-span-2">
              <label className="block font-semibold mb-1">Plataforma de streaming *</label>
              <div className="flex gap-4 mb-2">
                {streamingOptions.map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    className={`flex flex-col items-center px-5 py-3 rounded-lg border-2 transition-all shadow-sm ${form.streamingPlatform === opt.value ? 'border-primary-500 bg-primary-100 scale-105' : 'border-gray-300 bg-white'} focus:outline-none hover:scale-105`}
                    onClick={() => handleStreamingSelect(opt.value)}
                  >
                    {opt.icon}
                    <span className="text-xs mt-1 font-semibold">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="col-span-2">
              <label className="block font-semibold mb-1">URL do streaming</label>
              <input
                name="streamingUrl"
                value={form.streamingUrl}
                onChange={handleChange}
                placeholder="URL do streaming"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              />
            </div>
            {error && <div className="col-span-2 text-red-500 text-sm">{error}</div>}
          </form>
        </div>
        {/* Botões fixos no rodapé */}
        <div className="absolute bottom-0 left-0 w-full flex gap-2 justify-end bg-white border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 font-semibold hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="event-form"
            className="px-4 py-2 rounded-lg bg-primary-500 text-white font-bold hover:bg-primary-600 transition"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
