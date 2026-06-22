import { en } from './dictionaries/en';
import { th } from './dictionaries/th';

export type Locale = 'en' | 'th';
export type Dictionary = typeof en;

const dictionaries = {
  en,
  th,
};

export const getDictionary = (locale: Locale): Dictionary => {
  return dictionaries[locale] ?? dictionaries.en;
};
