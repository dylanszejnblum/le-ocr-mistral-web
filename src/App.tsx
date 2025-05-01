import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { 
  OcrResult, 
  processFileWithOcr, 
  exportAsTxt, 
  exportAsPdf, 
  exportToLlm
} from '@/lib/ocr-service';
import { FileUploadCard } from '@/components/FileUploadCard';
import { PreviewCard } from '@/components/PreviewCard';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LanguageProvider, useLanguage } from '@/lib/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';

const API_KEY_STORAGE_KEY = 'mistral-api-key';

function AppContent() {
  const [apiKey, setApiKey] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  
  // Load API key from localStorage on initial render
  useEffect(() => {
    const savedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);
  
  // Save API key to localStorage whenever it changes
  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    localStorage.setItem(API_KEY_STORAGE_KEY, value);
  };
  
  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setOcrResult(null);
    setError(null);
  };
  
  const handleProcessFile = async () => {
    if (!selectedFile || !apiKey) {
      setError(t('apiKeyRequired'));
      return;
    }
    
    setError(null);
    setIsProcessing(true);
    setProcessingProgress(10);
    
    try {
      const progressInterval = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 5;
        });
      }, 500);
      
      console.log('Starting OCR processing for file:', selectedFile.name);
      const result = await processFileWithOcr(selectedFile, apiKey);
      clearInterval(progressInterval);
      setProcessingProgress(100);
      
      if (!result.text || result.text.trim() === '') {
        console.warn('OCR result text is empty!');
      }
      
      console.log('OCR processing completed, setting result:', 
        result.text.length > 100 ? 
          `${result.text.substring(0, 100)}... (${result.text.length} chars)` : 
          result.text);
      
      setOcrResult(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Error during OCR processing:', errorMessage);
      setError(`Error: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProcessingProgress(0), 500);
    }
  };
  
  const handleExportTxt = () => {
    if (ocrResult) {
      try {
        console.log('Exporting OCR result as TXT:', 
          ocrResult.text.length > 100 ? 
            `${ocrResult.text.substring(0, 100)}... (${ocrResult.text.length} chars)` : 
            ocrResult.text);
        exportAsTxt(ocrResult.text, ocrResult.fileName);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('Error exporting as TXT:', errorMessage);
        setError(`Error exporting: ${errorMessage}`);
      }
    }
  };
  
  const handleExportPdf = () => {
    if (ocrResult) {
      try {
        console.log('Exporting OCR result as PDF');
        exportAsPdf(ocrResult.text, ocrResult.fileName);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('Error exporting as PDF:', errorMessage);
        setError(`Error exporting: ${errorMessage}`);
      }
    }
  };
  
  const handleExportToLlm = (platform: 'chatgpt' | 'claude' | 'lechat') => {
    if (ocrResult) {
      try {
        console.log(`Exporting OCR result to ${platform}`);
        exportToLlm(ocrResult.text, platform);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(`Error exporting to ${platform}:`, errorMessage);
        setError(`Error exporting: ${errorMessage}`);
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-grow container mx-auto px-4">
        <Header />
        
        <LanguageSelector />
        
        <ApiKeyInput value={apiKey} onChange={handleApiKeyChange} />
        
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="my-4"
          >
            <Progress value={processingProgress} className="h-2" />
            <p className="text-center text-sm mt-1 text-muted-foreground">
              {t('processingFile')}
            </p>
          </motion.div>
        )}
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-destructive/10 text-destructive p-3 rounded-md my-4 text-sm"
          >
            {error}
          </motion.div>
        )}
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -20 },
              show: { opacity: 1, x: 0 }
            }}
          >
            <FileUploadCard 
              onFileSelected={handleFileSelected}
              isProcessing={isProcessing}
              onProcessFile={handleProcessFile}
              selectedFile={selectedFile}
            />
          </motion.div>
          
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 20 },
              show: { opacity: 1, x: 0 }
            }}
          >
            <PreviewCard
              ocrResult={ocrResult}
              onExportTxt={handleExportTxt}
              onExportPdf={handleExportPdf}
              onExportToLlm={handleExportToLlm}
            />
          </motion.div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;