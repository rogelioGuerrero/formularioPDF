import React, { useRef, useState, useEffect } from 'react';
import { 
  TextCursorInput,
  CircleDot,
  CheckSquare,
  ChevronDown,
  List
} from 'lucide-react';
import type { Field } from '../types';

interface PDFViewerProps {
  pdfUrl: string | null;
  fields: Field[];
  updateField: (
    id: string,
    updatedField: Partial<{ xPosition: number; yPosition: number }>
  ) => void;
}

const FieldIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'text':
      return <TextCursorInput size={16} className="text-blue-600" />;
    case 'radio':
      return <CircleDot size={16} className="text-green-600" />;
    case 'checkbox':
      return <CheckSquare size={16} className="text-purple-600" />;
    case 'dropdown':
      return <ChevronDown size={16} className="text-orange-600" />;
    case 'optionList':
      return <List size={16} className="text-red-600" />;
    default:
      return <TextCursorInput size={16} />;
  }
};

const PDFViewer = ({
  pdfUrl,
  fields,
  updateField,
}: PDFViewerProps) => {
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

      updateField(fieldId, { 
        xPosition: x,
        yPosition: y 
      });
    }
  };

  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  const renderFieldContent = (field: Field) => {
    const textStyle = {
      fontFamily: field.font,
      fontSize: field.fontSize,
      lineHeight: field.lineHeight,
    };

    switch (field.type) {
      case 'text':
        return (
          <div 
            className="flex items-center gap-2 p-2 bg-white rounded border border-blue-200"
            style={textStyle}
          >
            <FieldIcon type={field.type} />
            <span>{field.label}</span>
          </div>
        );
      case 'textarea':
        return (
          <div 
            className="flex flex-col gap-2 p-2 bg-white rounded border border-blue-200"
            style={textStyle}
          >
            <div className="flex items-center gap-2">
              <FieldIcon type={field.type} />
              <span>{field.label}</span>
            </div>
            <div className="w-full h-full bg-gray-100 rounded p-1">
              {Array.from({ length: field.lines || 1 }).map((_, i) => (
                <div key={i} className="w-full h-4 bg-gray-200 mb-1 rounded" />
              ))}
            </div>
          </div>
        );
      case 'radio':
        return (
          <div 
            className="flex flex-col gap-2 p-2 bg-white rounded border border-green-200"
            style={textStyle}
          >
            <div className="flex items-center gap-2">
              <FieldIcon type={field.type} />
              <span>{field.label}</span>
            </div>
            {(field.options || []).map((option: string, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-gray-400" />
                <span>{option}</span>
              </div>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div 
            className="flex flex-col gap-2 p-2 bg-white rounded border border-purple-200"
            style={textStyle}
          >
            <div className="flex items-center gap-2">
              <FieldIcon type={field.type} />
              <span>{field.label}</span>
            </div>
            {(field.options || []).map((option: string, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-sm" />
                <span>{option}</span>
              </div>
            ))}
          </div>
        );
      case 'dropdown':
        return (
          <div 
            className="flex flex-col gap-2 p-2 bg-white rounded border border-orange-200"
            style={textStyle}
          >
            <div className="flex items-center gap-2">
              <FieldIcon type={field.type} />
              <span>{field.label}</span>
            </div>
            <div className="flex flex-col gap-1">
              {(field.options || []).map((option: string, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-24 h-6 bg-gray-200 rounded" />
                  <span className="text-sm">{option}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'optionList':
        return (
          <div 
            className="flex flex-col gap-2 p-2 bg-white rounded border border-red-200"
            style={textStyle}
          >
            <div className="flex items-center gap-2">
              <FieldIcon type={field.type} />
              <span>{field.label}</span>
            </div>
            <div className="flex flex-col gap-1">
              {(field.options || []).map((option: string, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-24 h-4 bg-gray-200 rounded" />
                  <span className="text-sm">{option}</span>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
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
                    cursor: 'move',
                    zIndex: 20,
                  }}
                >
                  {renderFieldContent(field)}
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
};

export default PDFViewer;
