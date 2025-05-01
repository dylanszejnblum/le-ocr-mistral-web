import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/lib/LanguageContext';

interface FileUploadCardProps {
  onFileSelected: (file: File) => void;
  isProcessing: boolean;
  onProcessFile: () => void;
  selectedFile: File | null;
}

export function FileUploadCard({
  onFileSelected,
  isProcessing,
  onProcessFile,
  selectedFile
}: FileUploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndProcessFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndProcessFile(file);
    }
  };

  const validateAndProcessFile = (file: File) => {
    const isPdf = file.type === 'application/pdf';
    const isImage = file.type.startsWith('image/');
    
    if (isPdf || isImage) {
      onFileSelected(file);
    } else {
      alert(t('fileTypeError'));
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="text-center">{t('uploadTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] transition-colors ${
            isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          animate={{ borderColor: isDragging ? 'rgb(var(--color-primary))' : 'rgb(var(--color-border))' }}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="application/pdf,image/*"
            onChange={handleFileInputChange}
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center gap-2"
          >
            <Upload size={40} className="text-muted-foreground mb-2" />
            <p className="text-lg font-medium">{t('dragAndDrop')}</p>
            <p className="text-sm text-muted-foreground text-center">
              {t('supportedFiles')}
            </p>
          </motion.div>
        </motion.div>
        
        {selectedFile && (
          <motion.div 
            className="mt-4 p-3 bg-secondary rounded-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2">
              <FileUp className="text-primary" size={18} />
              <p className="font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </motion.div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onProcessFile} 
          disabled={!selectedFile || isProcessing}
          className="w-full"
        >
          {isProcessing ? t('processing') : t('processOcr')}
        </Button>
      </CardFooter>
    </Card>
  );
} 