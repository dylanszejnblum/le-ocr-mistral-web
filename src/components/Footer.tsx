import { motion } from 'framer-motion';
import { Twitter } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="py-6 text-center text-sm text-muted-foreground"
    >
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center">
          <p>{t('madeBy')}</p>
          <a 
            href="https://x.com/dylansz_" 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Twitter size={16} />
          </a>
        </div>
        <p>
          <span className="font-medium">{t('clientOnly')}</span>
        </p>
      </div>
    </motion.footer>
  );
} 