import React, { useState, useRef, useEffect } from 'react';

interface PDFViewerProps {
  pdfUrl: string;
  fields: Array<{ id: string; label: string; xPosition: number; yPosition: number; width: number; height: number; font: string; fontSize: number }>;
  onFieldDrop: (fieldId: string, x: number, y: number) => void;
  onDeleteField: (fieldId: string) => void;
  onUpdateField: (fieldId: string, updatedProps: Partial<{ label: string; width: number; height: number; font: string; fontSize: number }>) => void;
  pageSize: { width: number; height: number };
}

export default function PDFViewer({ pdfUrl, fields, onFieldDrop, onDeleteField, onUpdateField, pageSize }: PDFViewerProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ajustar el tamaño del contenedor según el tamaño de la página y el zoom
  useEffect(() => {
    if (containerRef.current && pageSize) {
      const { width, height } = pageSize;
      containerRef.current.style.width = `${width * zoomLevel}px`;
      containerRef.current.style.height = `${height * zoomLevel}px`;
    }
  }, [pageSize, zoomLevel]);

  // Manejar el zoom in
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2)); // Límite máximo de zoom: 2x
  };

  // Manejar el zoom out
  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5)); // Límite mínimo de zoom: 0.5x
  };

  // Manejar el arrastre y soltar de campos
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const fieldId = event.dataTransfer.getData('text/plain');
      const x = (event.clientX - containerRect.left) / zoomLevel;
      const y = (event.clientY - containerRect.top) / zoomLevel;
      onFieldDrop(fieldId, x, y);
    }
  };

  // Manejar la edición de un campo
  const handleEditField = (fieldId: string) => {
    setEditingFieldId(fieldId);
  };

  return (
    <div className="relative">
      {/* Controles de zoom */}
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <button
          onClick={handleZoomIn}
          className="bg-white p-2 rounded-md shadow-md hover:bg-gray-100"
        >
          Zoom In
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white p-2 rounded-md shadow-md hover:bg-gray-100"
        >
          Zoom Out
        </button>
      </div>

      {/* Contenedor del PDF */}
      <div
        ref={containerRef}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="relative border border-gray-300"
      >
        {/* PDF */}
        <iframe
          src={pdfUrl}
          className="w-full h-full pointer-events-none"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: '0 0' }}
        />

        {/* Campos */}
        {fields.map((field) => (
          <div
            key={field.id}
            className="absolute border-2 border-blue-500 bg-blue-100/50"
            style={{
              left: field.xPosition * zoomLevel,
              top: field.yPosition * zoomLevel,
              width: field.width * zoomLevel,
              height: field.height * zoomLevel,
              zIndex: 10, // Asegurar que los botones estén por encima del PDF
            }}
          >
            <button
              onClick={() => onDeleteField(field.id)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
            >
              ×
            </button>
            <button
              onClick={() => handleEditField(field.id)}
              className="absolute -top-2 -left-2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-blue-600"
            >
              ✎
            </button>
          </div>
        ))}
      </div>

      {/* Modal de edición */}
      {editingFieldId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Editar Campo</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEditingFieldId(null);
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Etiqueta</label>
                  <input
                    type="text"
                    value={fields.find((f) => f.id === editingFieldId)?.label || ''}
                    onChange={(e) => onUpdateField(editingFieldId, { label: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ancho</label>
                  <input
                    type="number"
                    value={fields.find((f) => f.id === editingFieldId)?.width || 0}
                    onChange={(e) => onUpdateField(editingFieldId, { width: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Alto</label>
                  <input
                    type="number"
                    value={fields.find((f) => f.id === editingFieldId)?.height || 0}
                    onChange={(e) => onUpdateField(editingFieldId, { height: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fuente</label>
                  <select
                    value={fields.find((f) => f.id === editingFieldId)?.font || 'Helvetica'}
                    onChange={(e) => onUpdateField(editingFieldId, { font: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="Helvetica">Helvetica</option>
                    <option value="TimesRoman">Times Roman</option>
                    <option value="Courier">Courier</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tamaño de Fuente</label>
                  <input
                    type="number"
                    value={fields.find((f) => f.id === editingFieldId)?.fontSize || 12}
                    onChange={(e) => onUpdateField(editingFieldId, { fontSize: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingFieldId(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
