import React from 'react';

interface PDFViewerProps {
  pdfUrl: string | null;
}

export default function PDFViewer({ pdfUrl }: PDFViewerProps) {
  if (!pdfUrl) {
    return (
      <div className="flex items-center justify-center h-96 bg-white rounded-lg shadow-md">
        <p className="text-gray-500">Generate a PDF to preview it here</p>
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
