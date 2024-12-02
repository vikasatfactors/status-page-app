import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateHashID(length: number = 16) {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let hashID = '';
  for (let i = 0; i < length; i++) {
    hashID += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return hashID;
}
