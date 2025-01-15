import React, { useRef } from 'react';
import { Trash2, GripVertical, Settings } from 'lucide-react';
import type { Field } from '../types';

interface FieldManagerProps {
  fields: Field[];
  onDeleteField: (id: string) => void;
  onUpdateField: (id: string, field: Partial<Field>) => void;
  onReorderFields: (fields: Field[]) => void;
}

export default function FieldManager({
  fields,
  onDeleteField,
  onUpdateField,
  onReorderFields,
}: FieldManagerProps) {
  const [openSettingsId, setOpenSettingsId] = React.useState<string | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;

    const newFields = [...fields];
    const draggedItem = newFields.splice(dragItem.current, 1)[0];
    newFields.splice(dragOverItem.current, 0, draggedItem);
    onReorderFields(newFields);

    dragItem.current = null;
    dragOverItem.current = null;
  };

  const toggleFieldSettings = (fieldId: string) => {
    setOpenSettingsId(prevId => prevId === fieldId ? null : fieldId);
  };

  const handleLabelChange = (id: string, value: string) => {
    onUpdateField(id, { label: value });
  };

  const handlePositionChange = (id: string, field: 'xPosition' | 'yPosition', value: string) => {
    onUpdateField(id, { [field]: Number(value) });
  };

  const handleDimensionChange = (id: string, field: 'width' | 'height', value: string) => {
    onUpdateField(id, { [field]: Number(value) });
  };

  const handleFontChange = (id: string, field: 'font' | 'fontSize', value: string) => {
    onUpdateField(id, { [field]: field === 'fontSize' ? Number(value) : value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Form Fields</h2>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id}>
            <div
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className="border rounded-md p-4 bg-gray-50 cursor-move"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="text-gray-400" />
                  <div>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => handleLabelChange(field.id, e.target.value)}
                      className="text-sm font-medium bg-transparent border-none focus:ring-0"
                    />
                    <p className="text-xs text-gray-500 capitalize">{field.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFieldSettings(field.id)}
                    className={`p-1 rounded-md transition-colors ${
                      openSettingsId === field.id 
                        ? 'bg-gray-200 text-gray-700' 
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    }`}
                  >
                    <Settings size={18} />
                  </button>
                  <button
                    onClick={() => onDeleteField(field.id)}
                    className="p-1 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>

            {openSettingsId === field.id && (
              <div className="mt-2 p-4 bg-gray-100 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      X Position
                    </label>
                    <input
                      type="number"
                      value={field.xPosition}
                      onChange={(e) => handlePositionChange(field.id, 'xPosition', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Y Position
                    </label>
                    <input
                      type="number"
                      value={field.yPosition}
                      onChange={(e) => handlePositionChange(field.id, 'yPosition', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Width
                    </label>
                    <input
                      type="number"
                      value={field.width}
                      onChange={(e) => handleDimensionChange(field.id, 'width', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Height
                    </label>
                    <input
                      type="number"
                      value={field.height}
                      onChange={(e) => handleDimensionChange(field.id, 'height', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Font
                    </label>
                    <select
                      value={field.font}
                      onChange={(e) => handleFontChange(field.id, 'font', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="Helvetica">Helvetica</option>
                      <option value="TimesRoman">Times Roman</option>
                      <option value="Courier">Courier</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Font Size
                    </label>
                    <input
                      type="number"
                      value={field.fontSize}
                      onChange={(e) => handleFontChange(field.id, 'fontSize', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
