"use client";

import { Input } from "../Input";

interface PostalCodeProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function PostalCode({ value, onChange, error }: PostalCodeProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let postalCode = e.target.value.replace(/\D/g, '');
    
    // Formato: 00000-000
    postalCode = postalCode
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');

    onChange(postalCode);
  };

  return (
    <Input
      label="CEP"
      value={value}
      onChange={handleChange}
      placeholder="00000-000"
      maxLength={9}
      error={error}
    />
  );
} 