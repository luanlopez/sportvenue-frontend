import Image from "next/image";

interface BrandProps {
  brand?: string;
}

export const Brand = ({ brand }: BrandProps) => {
  const brandLower = brand?.toLowerCase();
  
  if (brandLower === 'visa') {
    return (
      <Image
        src="/brands/visa.png"
        alt="Visa"
        width={40}
        height={24}
        className="rounded"
      />
    );
  }
  
  if (brandLower === 'mastercard') {
    return (
      <Image
        src="/brands/mastercard.png"
        alt="Mastercard"
        width={40}
        height={24}
        className="rounded"
      />
    );
  }
  
  if (brandLower === 'amex' || brandLower === 'american express') {
    return (
      <Image
        src="/brands/amex.png"
        alt="American Express"
        width={40}
        height={24}
        className="rounded"
      />
    );
  }
  
  if (brandLower === 'elo') {
    return (
      <Image
        src="/brands/elo.png"
        alt="Elo"
        width={40}
        height={24}
        className="rounded"
      />
    );
  }
  
  return (
    <div className="w-10 h-6 bg-gray-600 rounded flex items-center justify-center">
      <span className="text-white text-xs font-bold">
        {brand?.toUpperCase().substring(0, 2) || 'MC'}
      </span>
    </div>
  );
}; 