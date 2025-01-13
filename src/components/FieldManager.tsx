import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const reorderedFields = items.map((field, index) => ({
      ...field,
      yPosition: 700 - (index * 50),
    }));

    onReorderFields(reorderedFields);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Form Fields</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="fields">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {fields.map((field, index) => (
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="border rounded-md p-4 bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="text-gray-400" />
                          </div>
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
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
