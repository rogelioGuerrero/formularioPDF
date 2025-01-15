import React from 'react';

interface PDFViewerProps {
  pdfUrl: string | null;
}

export default function PDFViewer({ pdfUrl }: PDFViewerProps) {
  if (!pdfUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg shadow-md p-4">
        <p className="text-gray-500 mb-4">Upload a PDF to get started</p>
        <p className="text-sm text-gray-400">Supported formats: .pdf</p>
      </div>
    );
  }

  return (
    <iframe
      src={pdfUrl}
      className="w-full h-[800px] rounded-lg shadow-md"
      title="PDF Preview"
    />
  );
}
