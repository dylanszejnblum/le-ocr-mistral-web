import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { SupportedLanguage } from '@/lib/translations';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const languages: { code: SupportedLanguage; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇦🇷' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center gap-2 mb-4"
    >
      {languages.map((lang) => (
        <motion.button
          key={lang.code}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors ${
            language === lang.code
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
          onClick={() => setLanguage(lang.code)}
        >
          <span className="text-lg">{lang.flag}</span>
          <span className="text-sm">{lang.name}</span>
        </motion.button>
      ))}
    </motion.div>
  );
} 