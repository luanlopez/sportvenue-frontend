import Image from "next/image";

interface CourtCardProps {
  name: string;
  address: string;
  imageUrl: string;
  onDetailsClick: () => void;
}

export function CourtCard({ name, address, imageUrl, onDetailsClick }: CourtCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative h-48">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-primary-500 mb-2">{name}</h3>
        <p className="text-secondary-500 text-sm mb-4">{address}</p>
        <button
          onClick={onDetailsClick}
          className="w-full px-4 py-2 text-white rounded-md
            bg-gradient-to-r from-primary-600 to-primary-500
            hover:from-primary-700 hover:to-primary-500
            transition-all duration-300 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Ver Detalhes
        </button>
      </div>
    </div>
  );
} 