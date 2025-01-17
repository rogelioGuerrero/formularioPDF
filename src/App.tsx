import React, { useState, useEffect, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import PDFViewer from './components/PDFViewer';
import { safeStorage } from './utils/storage';
import { Sidebar } from './components/Sidebar';
import FieldManager from './components/FieldManager';
import type { Field, FieldType } from './types';

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function App() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [pageSize, setPageSize] = useState<{ width: number; height: number } | null>(null);
  const dragItem = useRef<string | null>(null);

  useEffect(() => {
    const savedFields = safeStorage.getItem('pdfFields');
    if (savedFields) {
      setFields(savedFields);
    }
  }, []);

  useEffect(() => {
    safeStorage.setItem('pdfFields', fields);
  }, [fields]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const page = pdfDoc.getPages()[0];
      setPageSize({ width: page.getWidth(), height: page.getHeight() });

      const url = URL.createObjectURL(new Blob([arrayBuffer], { type: 'application/pdf' }));
      setPdfUrl(url);
    }
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, fieldId: string) => {
    dragItem.current = fieldId;
    event.dataTransfer.setData('text/plain', fieldId);
  };

  const handleFieldDrop = (fieldId: string, x: number, y: number) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === fieldId ? { ...field, xPosition: x, yPosition: y } : field
      )
    );
  };

  const handleDeleteField = (fieldId: string) => {
    setFields((prevFields) => prevFields.filter((field) => field.id !== fieldId));
  };

  const handleResetFields = () => {
    setFields([]);
  };

  const handleUpdateField = (fieldId: string, updatedProps: Partial<Field>) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === fieldId ? { ...field, ...updatedProps } : field
      )
    );
  };

  const handleAddField = (type: FieldType) => {
    const newField: Field = {
      id: generateUUID(),
      type,
      label: `Campo ${type}`,
      xPosition: 0,
      yPosition: 0,
      width: 100,
      height: 30,
      font: 'Helvetica',
      fontSize: 12,
      lineHeight: 1.2,
      labelSpacing: 2,
      verticalSpacing: 5,
    };
    setFields((prevFields) => [...prevFields, newField]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <Sidebar onAddField={handleAddField} />
        </div>
        <button
          onClick={handleResetFields}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
        >
          Restablecer Campos
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-[30%_70%] gap-6 p-6">
        {/* Field Manager */}
        <div className="bg-white rounded-lg shadow-md p-6 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-6">Field Manager</h2>
          <FieldManager
            fields={fields}
            onDeleteField={handleDeleteField}
            onUpdateField={handleUpdateField}
          />
        </div>

        {/* PDF Preview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">PDF Preview</h2>
          {pdfUrl && pageSize && (
            <PDFViewer
              pdfUrl={pdfUrl}
              fields={fields}
              onFieldDrop={handleFieldDrop}
              onDeleteField={handleDeleteField}
              onUpdateField={handleUpdateField}
              pageSize={pageSize}
              onDragStart={handleDragStart}
            />
          )}
        </div>
      </div>
    </div>
  );
}
