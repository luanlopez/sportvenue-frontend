import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import CryptoJS from "crypto-js"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function toBase64Url(str: string): string {
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return str;
}

export function encryptId(id: string): string {
  const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
  if (!secretKey) throw new Error("Chave de criptografia não definida");
  const encrypted = CryptoJS.AES.encrypt(id, secretKey).toString();
  return toBase64Url(encrypted);
}

export function decryptId(encrypted: string): string {
  const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
  if (!secretKey) throw new Error("Chave de criptografia não definida");
  const encryptedFixed = fromBase64Url(encrypted);
  const bytes = CryptoJS.AES.decrypt(encryptedFixed, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}
