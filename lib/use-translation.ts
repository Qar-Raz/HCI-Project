import { useAccessibility } from './accessibility-context';
import en from '../locales/en.json';
import ur from '../locales/ur.json';

const translations = {
  en,
  ur,
};

export function useTranslation() {
  const { settings } = useAccessibility();
  const language = settings.language || 'en';
  
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Fallback to key if not found
      }
    }
    
    return value;
  };

  return { t, language };
}
