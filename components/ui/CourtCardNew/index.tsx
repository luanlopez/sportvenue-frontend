import Image from "next/image";
import Link from "next/link";
import { CourtImagePlaceholder } from "../CourtImagePlaceholder";
import { useAuth } from "@/hooks/useAuth";
import { encryptId } from "@/lib/utils";
import { MdSportsSoccer, MdSportsBasketball, MdSportsVolleyball } from "react-icons/md";
import { GiTennisRacket } from "react-icons/gi";

interface CourtCardNewProps {
  court: {
    _id: string;
    name: string;
    address: string;
    number: string;
    neighborhood: string;
    city: string;
    pricePerHour: number;
    images?: string[];
    categories?: string[];
  };
}

const categoryIconMap: Record<string, React.ReactNode> = {
  FOOTBALL: <MdSportsSoccer className="w-6 h-6 text-white drop-shadow" />,
  FUTSAL: <MdSportsSoccer className="w-6 h-6 text-white drop-shadow" />,
  BASKETBALL: <MdSportsBasketball className="w-6 h-6 text-white drop-shadow" />,
  VOLLEYBALL: <MdSportsVolleyball className="w-6 h-6 text-white drop-shadow" />,
  TENNIS: <GiTennisRacket className="w-6 h-6 text-white drop-shadow" />,
  PADEL: <GiTennisRacket className="w-6 h-6 text-white drop-shadow" />,
};

const categoryNameMap: Record<string, string> = {
  FOOTBALL: "Futebol",
  FUTSAL: "Futsal",
  BASKETBALL: "Basquete",
  VOLLEYBALL: "Vôlei",
  TENNIS: "Tênis",
};

export function CourtCardNew({ court }: CourtCardNewProps) {
  const { user } = useAuth();
  const categories = court.categories || [];

  return (
    <div className="bg-white rounded-xl overflow-hidden group cursor-pointer border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        {court.images && court.images.length > 0 ? (
          <Image
            src={court.images[0]}
            alt={court.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <CourtImagePlaceholder />
        )}
        
        <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-sm">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
        
        {categories.length > 0 && (
          <div className="absolute bottom-3 left-3 flex gap-1">
            {categories.slice(0, 2).map((cat, idx) => (
              <span
                key={cat + idx}
                className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1 text-xs font-medium text-gray-700 shadow-sm"
                title={cat}
              >
                {categoryIconMap[cat] || <MdSportsSoccer className="w-3 h-3" />}
                <span className="hidden sm:inline">{categoryNameMap[cat]}</span>
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900 truncate mb-1">{court.name}</h3>
        
        <p className="text-sm text-gray-600 mb-2 truncate">
          {`${court.neighborhood}, ${court.city}`}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-gray-900">R$ {court.pricePerHour.toFixed(2)}</span>
            <span className="text-sm text-gray-500">/hora</span>
          </div>
          
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm text-gray-900 font-medium">5.0</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link
            href={`/courts/${encryptId(court._id)}`}
            className="flex-1 px-3 py-2 text-sm font-medium text-white bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors text-center"
          >
            Ver Detalhes
          </Link>
          {user?.userType === 'HOUSE_OWNER' && (
            <Link
              href={`/courts/${encryptId(court._id)}/edit`}
              className="px-3 py-2 text-sm font-medium text-primary-50 bg-white border border-primary-50 hover:bg-primary-50 hover:text-white rounded-lg transition-colors"
            >
              Editar
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 