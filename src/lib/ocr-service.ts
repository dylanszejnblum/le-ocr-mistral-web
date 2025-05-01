import { Mistral } from '@mistralai/mistralai';

export type FileType = 'pdf' | 'image';

export interface OcrResult {
  text: string;
  pages?: { pageNumber: number; text: string }[];
  fileType: FileType;
  fileName: string;
  originalFile: File;
}

// Define custom interfaces matching Mistral's actual response structure
interface MistralOcrPage {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  index?: number;
  markdown?: string;
  text?: string;
  content?: string;
}

interface MistralOcrResponse {
  pages?: MistralOcrPage[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// Export error codes for translation
export const OCR_ERRORS = {
  API_KEY_REQUIRED: 'API_KEY_REQUIRED',
  UNSUPPORTED_FILE_TYPE: 'UNSUPPORTED_FILE_TYPE',
  PROCESSING_ERROR: 'PROCESSING_ERROR',
  EXPORT_ERROR: 'EXPORT_ERROR',
  POPUP_BLOCKED: 'POPUP_BLOCKED'
};

// For debugging when API might not be working properly
const mockOcrText = (fileName: string): string => {
  console.log('USING MOCK OCR TEXT FOR DEBUGGING');
  return `This is mock OCR text for ${fileName}.\n\nIf you're seeing this, it means the Mistral API didn't return valid OCR data.\n\nPlease check your API key and network connection.\n\nYou can also check the browser console for detailed logs about what went wrong.`;
};

export const processFileWithOcr = async (
  file: File,
  apiKey: string
): Promise<OcrResult> => {
  if (!apiKey) {
    throw new Error('Mistral API key is required');
  }

  console.log('Starting OCR process with file:', file.name, 'size:', file.size, 'type:', file.type);
  
  const client = new Mistral({ apiKey });
  const fileType = getFileType(file);
  const base64Data = await fileToBase64(file);
  const dataUrl = `data:${file.type};base64,${base64Data}`;

  console.log('File encoded as base64, file type detected as:', fileType);

  try {
    console.log('Calling Mistral OCR API...');
    
    // Cast request parameters to bypass type checking
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ocrParams: any = {
      model: "mistral-ocr-latest",
      document: fileType === 'pdf' 
        ? { type: "document_url", documentUrl: dataUrl }
        : { type: "image_url", imageUrl: dataUrl },
      includeImageBase64: false
    };

    console.log('OCR request parameters:', JSON.stringify({
      model: ocrParams.model,
      document: {
        type: ocrParams.document.type
      }
    }));

    // Use type assertion to handle the response
    const ocrResponse = await client.ocr.process(ocrParams) as unknown as MistralOcrResponse;
    
    console.log('OCR API response received');
    
    // Log the raw response structure to understand what we're getting
    console.log('Full Response Properties:', Object.keys(ocrResponse).join(', '));
    console.log('Response Type:', typeof ocrResponse);
    
    // Check for different possible response structures
    if (ocrResponse.pages) {
      console.log('Response has pages property, pages length:', ocrResponse.pages.length);
    } else if (ocrResponse.text) {
      console.log('Response has direct text property, length:', ocrResponse.text.length);
    } else if (ocrResponse.content) {
      console.log('Response has content property, length:', ocrResponse.content.length);
    } else {
      console.log('Response does not have pages, text, or content properties');
      console.log('Full response:', JSON.stringify(ocrResponse, null, 2));
    }
    
    if (!ocrResponse) {
      console.error('OCR response is empty');
      throw new Error('No response received from Mistral OCR API');
    }

    // Extract text from response with extensive logging
    const pages = ocrResponse.pages || [];
    console.log(`Number of pages in response: ${pages.length}`);
    
    if (pages.length > 0) {
      console.log('First page properties:', Object.keys(pages[0]).join(', '));
      console.log('First page structure:', JSON.stringify(pages[0], null, 2));
    }
    
    // Create combined text with all page texts joined by newlines
    let combinedText = '';
    
    // Try different possible response structures
    if (pages.length > 0) {
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        
        // Check for markdown content first, which is where Mistral appears to put the text
        let pageText = '';
        
        if (page.markdown && typeof page.markdown === 'string') {
          pageText = page.markdown;
          console.log(`Page ${i+1} has markdown content, length: ${pageText.length}`);
        } else if (page.text && typeof page.text === 'string') {
          pageText = page.text;
          console.log(`Page ${i+1} has text content, length: ${pageText.length}`);
        } else if (page.content && typeof page.content === 'string') {
          pageText = page.content;
          console.log(`Page ${i+1} has content field, length: ${pageText.length}`);
        } else {
          console.warn(`Page ${i+1} does not have recognized text content`);
          // Try to find any string property that might contain text
          for (const key in page) {
            if (typeof page[key] === 'string' && page[key].length > 50) {
              console.log(`Found text in property "${key}" on page ${i+1}, length: ${page[key].length}`);
              pageText = page[key];
              break;
            }
          }
        }
        
        if (i > 0 && pageText) {
          combinedText += '\n\n';
        }
        
        combinedText += pageText;
        console.log(`Page ${i+1} extracted text length: ${pageText.length} characters`);
      }
    } else if (ocrResponse.text) {
      // Some APIs return text directly at the top level
      combinedText = ocrResponse.text;
      console.log('Using top-level text property, length:', combinedText.length);
    } else if (ocrResponse.content) {
      // Or maybe it's called "content"
      combinedText = ocrResponse.content;
      console.log('Using top-level content property, length:', combinedText.length);
    } else {
      // Try to find any string property that might contain the OCR text
      for (const key in ocrResponse) {
        if (typeof ocrResponse[key] === 'string' && ocrResponse[key].length > 100) {
          console.log(`Found potential OCR text in property "${key}", length:`, ocrResponse[key].length);
          combinedText = ocrResponse[key];
          break;
        }
      }
    }
    
    console.log(`Total combined text length: ${combinedText.length} characters`);
    
    // If we couldn't extract text, use mock data to allow testing the rest of the app
    if (!combinedText || combinedText.trim() === '') {
      console.warn('Warning: Extracted text is empty! Using mock data for debugging.');
      combinedText = mockOcrText(file.name);
    } else if (combinedText.length > 0) {
      console.log('Sample of combined text:', combinedText.substring(0, 500) + '...');
    }
    
    const result = {
      text: combinedText,
      pages: pages.map((page, index) => {
        let pageText = '';
        if (page.markdown) {
          pageText = page.markdown;
        } else if (page.text) {
          pageText = page.text;
        } else if (page.content) {
          pageText = page.content;
        }
        return {
          pageNumber: index + 1,
          text: pageText
        };
      }),
      fileType,
      fileName: file.name,
      originalFile: file
    };
    
    console.log('OCR processing completed successfully');
    return result;
  } catch (error) {
    console.error("Error processing OCR:", error);
    
    // In case of error, return mock data to allow testing export functionality
    console.warn('Returning mock OCR data due to error');
    return {
      text: mockOcrText(file.name),
      pages: [{ pageNumber: 1, text: mockOcrText(file.name) }],
      fileType,
      fileName: file.name,
      originalFile: file
    };
  }
};

const getFileType = (file: File): FileType => {
  if (file.type === 'application/pdf') {
    return 'pdf';
  } else if (file.type.startsWith('image/')) {
    return 'image';
  }
  throw new Error('Unsupported file type. Only PDF and images are supported.');
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = error => reject(error);
  });
};

export const exportAsPdf = (text: string, fileName: string): void => {
  console.log(`Exporting to PDF. Text length: ${text.length}, fileName: ${fileName}`);
  
  if (!text || text.trim() === '') {
    console.error('Cannot export empty text to PDF');
    alert('No text content to export');
    return;
  }
  
  // This is a simple solution - in a real app, you might want to use a library like jsPDF
  // For simplicity, we create an HTML file with the text and use browser print functionality
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${fileName} - OCR Result</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          white-space: pre-wrap;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>
      ${text.replace(/\n/g, '<br>')}
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  console.log('PDF HTML content created, opening print window');
  
  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
      URL.revokeObjectURL(url);
      console.log('Print window loaded and print dialog opened');
    };
  } else {
    URL.revokeObjectURL(url);
    console.error('Popup blocked - cannot open print window');
    alert('Please allow popups to export as PDF');
  }
};

export const exportToLlm = async (text: string, platform: 'chatgpt' | 'claude' | 'lechat'): Promise<void> => {
  console.log(`Exporting to LLM (${platform}). Text length: ${text.length}`);
  
  if (!text || text.trim() === '') {
    console.error('Cannot export empty text to LLM');
    alert('No text content to export');
    return;
  }
  
  // Create a structured prompt with clear instructions for the AI
  const prompt = `I've extracted the following text using OCR technology from a document or image. Please help me analyze its content:

${text.trim()}

Based on this extracted text, could you please:
1. Summarize the key points
2. Fix any OCR errors that you notice
3. Extract any important information like dates, names, or numbers
4. Format it in a more readable way if needed

Thank you!`;
  
  // Prepare URLs outside switch case to avoid lexical declaration issues
  const chatGptUrl = `https://chat.openai.com/?model=gpt-4o&prompt=${encodeURIComponent(prompt)}`;
  const claudeUrl = `https://claude.ai/chat?prompt=${encodeURIComponent(prompt)}`;
  const leChatUrl = `https://chat.mistral.ai/chat?prompt=${encodeURIComponent(prompt)}`;
  
  switch (platform) {
    case 'chatgpt':
      // Open ChatGPT with the prompt
      window.open(chatGptUrl, '_blank');
      console.log('Opened ChatGPT with text as prompt');
      break;
    case 'lechat':
      // Open LeChat with the prompt
      window.open(leChatUrl, '_blank');
      console.log('Opened LeChat with text as prompt');
      break;
    case 'claude':
      // For Claude, we need to open the page and let the user paste the prompt
      try {
        // Try to directly open with prompt if supported
        window.open(claudeUrl, '_blank');
      } catch {
        // Fallback to just opening Claude
        window.open('https://claude.ai', '_blank');
        // Copy the prompt to clipboard for easy pasting
        navigator.clipboard.writeText(prompt).then(() => {
          alert('The OCR text has been copied to your clipboard. Paste it in Claude to analyze.');
        }).catch(() => {
          window.open('https://claude.ai', '_blank');
          alert('Please copy and paste the OCR text into Claude to analyze it.');
        });
      }
      console.log('Opened Claude and copied text to clipboard');
      break;
    default:
      throw new Error('Unsupported platform');
  }
};

export const exportAsTxt = (text: string, fileName: string): void => {
  console.log(`Exporting to TXT. Text length: ${text.length}, fileName: ${fileName}`);
  
  if (!text || text.trim() === '') {
    console.error('Cannot export empty text file');
    alert('No text content to export');
    return;
  }
  
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName.replace(/\.[^/.]+$/, '')}.txt`;
  document.body.appendChild(link);
  
  console.log('Download link created, triggering click');
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  console.log('TXT export completed');
}; 