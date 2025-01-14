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
  const [editingField, setEditingField] = React.useState<string | null>(null);
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

  const handleFieldSettings = (field: Field) => {
    setEditingField(field.id);
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
                      onChange={(e) =>
                        onUpdateField(field.id, { label: e.target.value })
                      }
                      className="text-sm font-medium bg-transparent border-none focus:ring-0"
                    />
                    <p className="text-xs text-gray-500">{field.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleFieldSettings(field)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Settings size={18} />
                  </button>
                  <button
                    onClick={() => onDeleteField(field.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>

            {editingField === field.id && (
              <div className="mt-2 p-4 bg-gray-100 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      X Position
                    </label>
                    <input
                      type="number"
                      value={field.xPosition}
                      onChange={(e) =>
                        onUpdateField(field.id, { xPosition: Number(e.target.value) })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Y Position
                    </label>
                    <input
                      type="number"
                      value={field.yPosition}
                      onChange={(e) =>
                        onUpdateField(field.id, { yPosition: Number(e.target.value) })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Width
                    </label>
                    <input
                      type="number"
                      value={field.width}
                      onChange={(e) =>
                        onUpdateField(field.id, { width: Number(e.target.value) })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Height
                    </label>
                    <input
                      type="number"
                      value={field.height}
                      onChange={(e) =>
                        onUpdateField(field.id, { height: Number(e.target.value) })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Font
                    </label>
                    <select
                      value={field.font}
                      onChange={(e) =>
                        onUpdateField(field.id, { font: e.target.value as keyof typeof StandardFonts })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    >
                      <option value="Helvetica">Helvetica</option>
                      <option value="TimesRoman">Times Roman</option>
                      <option value="Courier">Courier</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Font Size
                    </label>
                    <input
                      type="number"
                      value={field.fontSize}
                      onChange={(e) =>
                        onUpdateField(field.id, { fontSize: Number(e.target.value) })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
