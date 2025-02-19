import Image from "next/image";
import Link from "next/link";
import { CourtImagePlaceholder } from "../CourtImagePlaceholder";
import { useAuth } from "@/hooks/useAuth";

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
  };
}

export function CourtCardNew({ court }: CourtCardNewProps) {
  const { user } = useAuth();

  return (
    <div className="bg-tertiary-500 border border-primary-500 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 rounded-t-2xl overflow-hidden">
        {court.images && court.images.length > 0 ? (
          <Image
            src={court.images[0]}
            alt={court.name}
            fill
            className="object-cover"
          />
        ) : (
          <CourtImagePlaceholder />
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-primary-500 mb-2">
          {court.name}
        </h3>
        <p className="text-primary-500/80 text-sm mb-2">
          {`${court.address}, ${court.number} - ${court.neighborhood}, ${court.city}`}
        </p>
        <p className="text-primary-500 font-bold text-sm mb-4">
          R$ {court.pricePerHour.toFixed(2)}/hora
        </p>

        <div className="flex gap-2 flex-col sm:flex-row">
          <Link
            href={`/courts/${court._id}`}
            className="flex-1 px-4 py-2 text-primary-500 rounded-full
              bg-secondary-500 hover:bg-secondary-600 shadow-lg
              transition-colors duration-300
              focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2
              flex items-center justify-center
              text-sm font-bold"
          >
            Ver Detalhes
          </Link>

          {user?.userType === 'HOUSE_OWNER' && (
            <Link
              href={`/courts/${court._id}/edit`}
              className="px-4 py-2 text-tertiary-500 bg-primary-500 rounded-full
                border-2 border-tertiary-500
                hover:bg-tertiary-500 hover:text-primary-500 hover:border-primary-500
                transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:ring-offset-2
                flex items-center justify-center
                text-sm font-medium"
            >
              Editar
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 