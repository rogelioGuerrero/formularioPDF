import React, { useRef, useState, useEffect } from 'react';

interface PDFViewerProps {
  pdfUrl: string | null;
  fields: {
    id: string;
    xPosition: number;
    yPosition: number;
    width: number;
    height: number;
    label: string;
  }[];
  updateField: (
    id: string,
    updatedField: Partial<{ xPosition: number; yPosition: number }>
  ) => void;
}

export default function PDFViewer({
  pdfUrl,
  fields,
  updateField,
}: PDFViewerProps) {
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [draggingFieldId, setDraggingFieldId] = useState<string | null>(null);
  const [fieldPosition, setFieldPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    fieldId: string
  ) => {
    setDraggingFieldId(fieldId);
    setShowOverlay(true);
    event.dataTransfer.setData('text/plain', fieldId);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    const containerRect = pdfContainerRef.current?.getBoundingClientRect();
    if (containerRect) {
      const x = event.clientX - containerRect.left;
      const y = event.clientY - containerRect.top;
      setFieldPosition({ x, y });
    }
  };

  const handleDragEnd = () => {
    setDraggingFieldId(null);
    setFieldPosition(null);
    setShowOverlay(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const fieldId = event.dataTransfer.getData('text/plain');
    const containerRect = pdfContainerRef.current?.getBoundingClientRect();

    if (containerRect) {
      const x = event.clientX - containerRect.left;
      const y = event.clientY - containerRect.top;

      // Actualizar las coordenadas del campo
      updateField(fieldId, { 
        xPosition: x,
        yPosition: y 
      });
    }
  };

  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  return (
    <div className="bg-gray-200 p-4 rounded-lg shadow-md">
      <div
        ref={pdfContainerRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="overflow-auto relative"
        style={{ height: '800px' }}
      >
        {pdfUrl && (
          <div className="relative" style={{ width: '100%', height: '100%' }}>
            <iframe
              src={pdfUrl}
              className="w-full h-full"
              title="PDF Preview"
              onLoad={handleIframeLoad}
            />
            {showOverlay && (
              <div
                className="absolute top-0 left-0 w-full h-full bg-transparent"
                style={{ zIndex: 10 }}
              />
            )}
            {iframeLoaded &&
              fields.map((field) => (
                <div
                  key={field.id}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, field.id)}
                  onDragEnd={handleDragEnd}
                  style={{
                    position: 'absolute',
                    left: field.xPosition,
                    top: field.yPosition,
                    width: field.width,
                    height: field.height,
                    border: '2px dashed blue',
                    cursor: 'move',
                    zIndex: 20,
                    backgroundColor: 'rgba(0, 0, 255, 0.1)',
                  }}
                >
                  <span className="text-xs text-black bg-gray-100 p-1">
                    {field.label}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
      {draggingFieldId && fieldPosition && (
        <div className="mt-2 text-sm">
          Position: ({fieldPosition.x.toFixed(0)}, {fieldPosition.y.toFixed(0)})
        </div>
      )}
    </div>
  );
}
