export type SupportedLanguage = 'en' | 'es';

interface Translations {
  [key: string]: {
    [language in SupportedLanguage]: string;
  };
}

export const translations: Translations = {
  appTitle: {
    en: 'Le OCR 🇫🇷',
    es: 'Le OCR 🇫🇷'
  },
  appDescription: {
    en: 'Extract text from your PDF documents and images with powerful OCR using Mistral AI.',
    es: 'Extrae texto de tus documentos PDF e imágenes con un potente OCR utilizando Mistral AI.'
  },
  apiKeyLabel: {
    en: 'Mistral API Key',
    es: 'Clave de API de Mistral'
  },
  apiKeyPlaceholder: {
    en: 'Enter your Mistral API key',
    es: 'Ingresa tu clave de API de Mistral'
  },
  apiKeyDescription: {
    en: 'Your API key is stored locally and only used for OCR processing.',
    es: 'Tu clave de API se almacena localmente y solo se utiliza para el procesamiento OCR.'
  },
  uploadTitle: {
    en: 'Upload File',
    es: 'Subir Archivo'
  },
  dragAndDrop: {
    en: 'Drag & drop or click to upload',
    es: 'Arrastra y suelta o haz clic para subir'
  },
  supportedFiles: {
    en: 'Supports PDF documents and images',
    es: 'Compatible con documentos PDF e imágenes'
  },
  processOcr: {
    en: 'Process OCR',
    es: 'Procesar OCR'
  },
  processing: {
    en: 'Processing...',
    es: 'Procesando...'
  },
  processingFile: {
    en: 'Processing your file...',
    es: 'Procesando tu archivo...'
  },
  previewTitle: {
    en: 'OCR Preview',
    es: 'Vista previa OCR'
  },
  noTextExtracted: {
    en: 'No text extracted',
    es: 'No se extrajo texto'
  },
  resultsWillAppear: {
    en: 'OCR results will appear here',
    es: 'Los resultados del OCR aparecerán aquí'
  },
  showMore: {
    en: 'Show more',
    es: 'Mostrar más'
  },
  showLess: {
    en: 'Show less',
    es: 'Mostrar menos'
  },
  exportTxt: {
    en: 'Export TXT',
    es: 'Exportar TXT'
  },
  exportPdf: {
    en: 'Export PDF',
    es: 'Exportar PDF'
  },
  exportToLlm: {
    en: 'Export to LLM',
    es: 'Exportar a LLM'
  },
  more: {
    en: 'More',
    es: 'Más'
  },
  madeBy: {
    en: 'Made by Dylan Sz',
    es: 'Hecho por Dylan Sz'
  },
  clientOnly: {
    en: 'Client-side only: Your files and API keys never leave your browser',
    es: 'Solo del lado del cliente: Tus archivos y claves de API nunca salen de tu navegador'
  },
  fileTypeError: {
    en: 'Please upload a PDF or image file.',
    es: 'Por favor, sube un archivo PDF o una imagen.'
  },
  apiKeyRequired: {
    en: 'Please select a file and enter your Mistral API key.',
    es: 'Por favor, selecciona un archivo e ingresa tu clave de API de Mistral.'
  },
  popupError: {
    en: 'Please allow popups to export as PDF',
    es: 'Por favor, permite ventanas emergentes para exportar como PDF'
  },
  // Error codes
  API_KEY_REQUIRED: {
    en: 'Mistral API key is required',
    es: 'Se requiere la clave de API de Mistral'
  },
  UNSUPPORTED_FILE_TYPE: {
    en: 'Unsupported file type. Only PDF and images are supported.',
    es: 'Tipo de archivo no compatible. Solo se admiten PDF e imágenes.'
  },
  PROCESSING_ERROR: {
    en: 'Error processing OCR. Please try again.',
    es: 'Error al procesar OCR. Por favor, inténtelo de nuevo.'
  },
  EXPORT_ERROR: {
    en: 'Error exporting file. Please try again.',
    es: 'Error al exportar el archivo. Por favor, inténtelo de nuevo.'
  },
  POPUP_BLOCKED: {
    en: 'Please allow popups to export as PDF',
    es: 'Por favor, permite ventanas emergentes para exportar como PDF'
  }
}; 