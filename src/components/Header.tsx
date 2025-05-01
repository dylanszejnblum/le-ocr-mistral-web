import { motion } from 'framer-motion';
import { ScanText } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export function Header() {
  const { t } = useLanguage();
  
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-8 pb-4 mb-4 text-center"
    >
      <motion.div 
        className="inline-flex items-center justify-center gap-2 mb-2"
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <ScanText size={32} className="text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">
          {t('appTitle')}
        </h1>
      </motion.div>
      <p className="text-muted-foreground max-w-xl mx-auto">
        {t('appDescription')}
      </p>
    </motion.header>
  );
} 