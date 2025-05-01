import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/lib/LanguageContext';

interface ApiKeyInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ApiKeyInput({ value, onChange }: ApiKeyInputProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <Key size={16} className="text-primary" />
        <label htmlFor="api-key" className="text-sm font-medium">
          {t('apiKeyLabel')}
        </label>
      </div>
      <div className="relative">
        <Input
          id="api-key"
          type={showApiKey ? "text" : "password"}
          placeholder={t('apiKeyPlaceholder')}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShowApiKey(!showApiKey)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {t('apiKeyDescription')}
      </p>
    </motion.div>
  );
} 