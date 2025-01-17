import React, { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import PDFViewer from './components/PDFViewer';
import { safeStorage } from './utils/storage';
import { Sidebar } from './components/Sidebar';
import FieldManager from './components/FieldManager';
import type { Field, FieldType } from './types';

// Función simple para generar UUIDs
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

  // Cargar campos guardados al iniciar
  useEffect(() => {
    const savedFields = safeStorage.getItem('pdfFields');
    if (savedFields) {
      setFields(savedFields);
    }
  }, []);

  // Guardar campos en localStorage cuando cambian
  useEffect(() => {
    safeStorage.setItem('pdfFields', fields);
  }, [fields]);

  // Manejar la carga del archivo PDF
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

  // Manejar el arrastre y soltar de campos
  const handleFieldDrop = (fieldId: string, x: number, y: number) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === fieldId ? { ...field, xPosition: x, yPosition: y } : field
      )
    );
  };

  // Eliminar un campo individual
  const handleDeleteField = (fieldId: string) => {
    setFields((prevFields) => prevFields.filter((field) => field.id !== fieldId));
  };

  // Restablecer todos los campos
  const handleResetFields = () => {
    setFields([]);
  };

  // Actualizar las propiedades de un campo
  const handleUpdateField = (fieldId: string, updatedProps: Partial<Field>) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === fieldId ? { ...field, ...updatedProps } : field
      )
    );
  };

  // Agregar un nuevo campo
  const handleAddField = (type: FieldType) => {
    const newField: Field = {
      id: generateUUID(), // Usar la función generadora de UUIDs
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

  // Reordenar campos
  const handleReorderFields = (newFields: Field[]) => {
    setFields(newFields);
  };

  return (
    <div className="container mx-auto p-4 flex gap-4">
      <Sidebar onAddField={handleAddField} />
      <div className="flex-1">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="mb-4"
        />

        {pdfUrl && pageSize && (
          <div className="mt-4">
            <button
              onClick={handleResetFields}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors mb-4"
            >
              Restablecer Campos
            </button>
            <div className="grid grid-cols-2 gap-4">
              <PDFViewer
                pdfUrl={pdfUrl}
                fields={fields}
                onFieldDrop={handleFieldDrop}
                onDeleteField={handleDeleteField}
                onUpdateField={handleUpdateField}
                pageSize={pageSize}
              />
              <FieldManager
                fields={fields}
                onDeleteField={handleDeleteField}
                onUpdateField={handleUpdateField}
                onReorderFields={handleReorderFields}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
