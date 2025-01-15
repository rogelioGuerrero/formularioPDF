import React from 'react';
import {
  TextCursorInput,
  CircleDot,
  CheckSquare,
  ChevronDown,
  List,
} from 'lucide-react';
import type { FieldType } from '../types';

interface SidebarProps {
  onAddField: (type: FieldType) => void;
}

export function Sidebar({ onAddField }: SidebarProps) {
  const handleIconClick = (type: FieldType) => {
    onAddField(type);
  };

  return (
    <div className="w-16 bg-white p-2 rounded-lg shadow-md flex flex-col items-center gap-4">
      <button
        onClick={() => handleIconClick('text')}
        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        title="Text Field"
      >
        <TextCursorInput size={20} />
      </button>
      <button
        onClick={() => handleIconClick('radio')}
        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        title="Radio Group"
      >
        <CircleDot size={20} />
      </button>
      <button
        onClick={() => handleIconClick('checkbox')}
        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        title="Checkbox Group"
      >
        <CheckSquare size={20} />
      </button>
      <button
        onClick={() => handleIconClick('dropdown')}
        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        title="Dropdown"
      >
        <ChevronDown size={20} />
      </button>
      <button
        onClick={() => handleIconClick('optionList')}
        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        title="Option List"
      >
        <List size={20} />
      </button>
    </div>
  );
}
