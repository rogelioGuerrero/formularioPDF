import React, { useRef, useState } from 'react';
import { Trash2, GripVertical, Settings, Plus, Minus } from 'lucide-react';
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
  const [openSettingsId, setOpenSettingsId] = useState<string | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    dragItem.current = index;
    event.dataTransfer.setData('text/plain', fields[index].id);
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
    setOpenSettingsId((prevId) => (prevId === fieldId ? null : fieldId));
  };

  const handleLabelChange = (id: string, value: string) => {
    onUpdateField(id, { label: value });
  };

  const handlePositionChange = (
    id: string,
    field: 'xPosition' | 'yPosition',
    value: string
  ) => {
    onUpdateField(id, { [field]: Number(value) });
  };

  const handleDimensionChange = (
    id: string,
    field: 'width' | 'height',
    value: string
  ) => {
    onUpdateField(id, { [field]: Number(value) });
  };

  const handleFontChange = (
    id: string,
    field: 'font' | 'fontSize',
    value: string
  ) => {
    onUpdateField(id, {
      [field]: field === 'fontSize' ? Number(value) : value,
    });
  };

  const handleAddOption = (id: string) => {
    const field = fields.find((f) => f.id === id);
    if (field) {
      const newOptions = [
        ...(field.options || []),
        `Opción ${(field.options?.length || 0) + 1}`,
      ];
      onUpdateField(id, { options: newOptions });
    }
  };

  const handleRemoveOption = (id: string, index: number) => {
    const field = fields.find((f) => f.id === id);
    if (field?.options) {
      const newOptions = field.options.filter((_, i) => i !== index);
      onUpdateField(id, { options: newOptions });
    }
  };

  const handleOptionChange = (id: string, index: number, value: string) => {
    const field = fields.find((f) => f.id === id);
    if (field?.options) {
      const newOptions = [...field.options];
      newOptions[index] = value;
      onUpdateField(id, { options: newOptions });
    }
  };

  const handleLinesChange = (id: string, lines: number) => {
    onUpdateField(id, { lines });
  };

  const handleImageChange = (id: string, imageData: string) => {
    onUpdateField(id, { imageData });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Form Fields</h2>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id}>
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
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
                        handleLabelChange(field.id, e.target.value)
                      }
                      className="text-sm font-medium bg-transparent border-none focus:ring-0"
                    />
                    <p className="text-xs text-gray-500 capitalize">
                      {field.type === 'textarea'
                        ? 'Área de texto'
                        : field.type}
                    </p>
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
                      onChange={(e) =>
                        handlePositionChange(
                          field.id,
                          'xPosition',
                          e.target.value
                        )
                      }
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
                      onChange={(e) =>
                        handlePositionChange(
                          field.id,
                          'yPosition',
                          e.target.value
                        )
                      }
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
                      onChange={(e) =>
                        handleDimensionChange(field.id, 'width', e.target.value)
                      }
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
                      onChange={(e) =>
                        handleDimensionChange(
                          field.id,
                          'height',
                          e.target.value
                        )
                      }
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  {['textarea', 'text'].includes(field.type) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Líneas
                      </label>
                      <input
                        type="number"
                        value={field.lines || 1}
                        onChange={(e) =>
                          handleLinesChange(field.id, Number(e.target.value))
                        }
                        min={1}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  )}
                  {field.type !== 'image' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Font
                        </label>
                        <select
                          value={field.font}
                          onChange={(e) =>
                            handleFontChange(field.id, 'font', e.target.value)
                          }
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
                          onChange={(e) =>
                            handleFontChange(
                              field.id,
                              'fontSize',
                              e.target.value
                            )
                          }
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                    </>
                  )}
                </div>

                {['radio', 'checkbox', 'dropdown', 'optionList'].includes(
                  field.type
                ) && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Opciones
                    </h3>
                    <div className="space-y-2">
                      {field.options?.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(
                                field.id,
                                index,
                                e.target.value
                              )
                            }
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                          <button
                            onClick={() => handleRemoveOption(field.id, index)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-md"
                          >
                            <Minus size={16} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => handleAddOption(field.id)}
                        className="w-full flex items-center justify-center gap-2 p-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md"
                      >
                        <Plus size={16} />
                        Añadir opción
                      </button>
                    </div>
                  </div>
                )}

                {field.type === 'image' && (
                  <div className="mt-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            handleImageChange(
                              field.id,
                              e.target?.result as string
                            );
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {field.imageData && (
                      <div className="mt-2">
                        <img
                          src={field.imageData}
                          alt="Preview"
                          className="max-w-full max-h-40"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
