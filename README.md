# LeChat OCR Web

## Overview

LeChat OCR Web is a powerful web application that extracts text from images and PDF documents using Optical Character Recognition (OCR) technology. It leverages the Mistral AI OCR API to process documents and provides seamless integration with AI assistants including LeChat, ChatGPT, and Claude for further analysis of the extracted text.

![LeChat OCR Web](screenshot.jpeg)

## Features

- **Document Processing**: Upload and process PDF documents and images
- **OCR Text Extraction**: Extract text content from documents using Mistral AI's OCR service
- **Multiple Export Options**:
  - Export as TXT file
  - Export as PDF document
  - Direct integration with AI assistants (LeChat, ChatGPT, Claude)
- **Interactive UI**:
  - Real-time processing progress
  - Text preview with expand/collapse functionality
  - Responsive design for all devices
- **Multilingual Support**: User interface available in multiple languages

## Technologies

### Frontend
- **React 19**: Latest version of React for building the user interface
- **TypeScript**: Type-safe JavaScript for enhanced developer experience
- **Vite**: Modern build tool for faster development and optimized production builds
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Animation library for smooth transitions and effects

### APIs and Services
- **Mistral AI OCR API**: Powers the document text extraction capability
- **AI Integration**: Direct export to LeChat, ChatGPT, and Claude for advanced text analysis

## Getting Started

### Prerequisites
- Node.js (v16.0.0 or higher)
- npm or yarn
- Mistral AI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/le-chat-ocr-web.git
   cd le-chat-ocr-web
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Enter your Mistral AI API Key**: Input your API key in the designated field
2. **Upload a Document**: Click the upload area and select a PDF or image file
3. **Process the Document**: Click "Process File" to initiate OCR extraction
4. **View and Interact with Results**: 
   - Preview the extracted text
   - Click "Show More/Less" to expand or collapse large text
5. **Export or Analyze**:
   - Download as TXT or PDF
   - Send directly to LeChat, ChatGPT, or Claude for AI-powered analysis

## Building for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
le-chat-ocr-web/
├── public/            # Static assets
├── src/               # Source code
│   ├── components/    # React components
│   │   ├── ui/        # UI components (buttons, cards, etc.)
│   │   └── ...        # Feature components
│   ├── lib/           # Utilities and services
│   │   ├── ocr-service.ts  # OCR processing logic
│   │   └── ...        # Other utilities
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
└── ...                # Configuration files
```

## Dependencies

### Core Dependencies
- `@mistralai/mistralai`: Official Mistral AI JavaScript client
- `react` & `react-dom`: Core React libraries
- `framer-motion`: Animation library
- `lucide-react`: Icon library
- `tailwindcss`: CSS framework

### Dev Dependencies
- `typescript`: TypeScript language support
- `vite`: Build tool
- `eslint`: Code linting
- Various TypeScript types and configuration utilities

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Mistral AI](https://mistral.ai/) for providing the OCR API
- [Shadcn UI](https://ui.shadcn.com/) for the component system
- All open-source libraries that made this project possible
