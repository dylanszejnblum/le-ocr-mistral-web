import { motion } from 'framer-motion';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { OcrResult } from '@/lib/ocr-service';
import { useLanguage } from '@/lib/LanguageContext';

interface PreviewCardProps {
  ocrResult: OcrResult | null;
  onExportTxt: () => void;
  onExportPdf: () => void;
  onExportToLlm: (platform: 'chatgpt' | 'claude' | 'lechat') => void;
}

export function PreviewCard({
  ocrResult,
  onExportTxt,
  onExportPdf,
  onExportToLlm
}: PreviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useLanguage();
  
  const displayText = ocrResult?.text || '';
  const truncatedText = displayText.length > 500 && !isExpanded 
    ? displayText.substring(0, 500) + '...' 
    : displayText;

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="text-center">{t('previewTitle')}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto">
        {ocrResult ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="text-primary" size={20} />
              <h3 className="font-medium">{ocrResult.fileName}</h3>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-muted p-4 rounded-md min-h-[180px] max-h-[500px] overflow-auto whitespace-pre-wrap"
            >
              {truncatedText || t('noTextExtracted')}
            </motion.div>
            
            {displayText.length > 500 && (
              <Button 
                variant="ghost" 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs"
              >
                {isExpanded ? t('showLess') : t('showMore')}
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
            <FileText size={40} className="mb-4 opacity-20" />
            <p>{t('resultsWillAppear')}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap justify-between gap-2">
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={onExportTxt}
            disabled={!ocrResult}
            className="flex-1"
          >
            <Download size={16} className="mr-1" />
            {t('exportTxt')}
          </Button>
          <Button
            variant="outline"
            onClick={onExportPdf}
            disabled={!ocrResult}
            className="flex-1"
          >
            <Download size={16} className="mr-1" />
            {t('exportPdf')}
          </Button>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="default"
            onClick={() => onExportToLlm('chatgpt')}
            disabled={!ocrResult}
            className="flex-1"
          >
            <ExternalLink size={16} className="mr-1" />
            ChatGPT
          </Button>
          
          <Button
            variant="default"
            onClick={() => onExportToLlm('lechat')}
            disabled={!ocrResult}
            className="flex-1 bg-orange-500 hover:bg-orange-600"
          >
            <ExternalLink size={16} className="mr-1" />
            LeChat
          </Button>
          
          <Button
            variant="outline"
            onClick={() => onExportToLlm('claude')}
            disabled={!ocrResult}
            className="flex-1"
          >
            <ExternalLink size={16} className="mr-1" />
            Claude
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 