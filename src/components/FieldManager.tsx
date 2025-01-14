import React, { useRef } from 'react';
import { Trash2, GripVertical } from 'lucide-react';
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

    // Update yPositions based on new order
    const updatedFields = newFields.map((field, index) => ({
      ...field,
      yPosition: 700 - (index * 50),
    }));

    onReorderFields(updatedFields);

    // Reset positions
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Form Fields</h2>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
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
                    onChange={(e) =>
                      onUpdateField(field.id, { label: e.target.value })
                    }
                    className="text-sm font-medium bg-transparent border-none focus:ring-0"
                  />
                  <p className="text-xs text-gray-500">{field.type}</p>
                </div>
              </div>
              <button
                onClick={() => onDeleteField(field.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
            {(field.type === 'radio' ||
              field.type === 'checkbox' ||
              field.type === 'dropdown' ||
              field.type === 'optionList') && (
              <div className="mt-2">
                <textarea
                  value={field.options?.join('\n')}
                  onChange={(e) =>
                    onUpdateField(field.id, {
                      options: e.target.value.split('\n').filter(Boolean),
                    })
                  }
                  placeholder="Enter options (one per line)"
                  className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  rows={3}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
