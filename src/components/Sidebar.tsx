import React from 'react';
import { 
  Plus, 
  Type, 
  Radio, 
  CheckSquare, 
  ListFilter, 
  List, 
  Calendar, 
  Image, 
  PenLine,
  Hash,
  FileText,
  Clock,
  FileInput,
  FileOutput
} from 'lucide-react';
import type { PDFTextConfig, FieldType } from '../types';

interface SidebarProps {
  onAddField: (type: FieldType) => void;
  pdfTextConfig: PDFTextConfig;
  onConfigChange: (config: Partial<PDFTextConfig>) => void;
}

export function Sidebar({ onAddField }: SidebarProps) {
  return (
    <div className="w-64 bg-white p-4 rounded-lg shadow-md space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-3">Add Field</h2>
        <div className="space-y-2">
          <button
            onClick={() => onAddField('text')}
            className="flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100 rounded-md"
          >
            <Type size={18} /> Text Field
          </button>
          <button
            onClick={() => onAddField('radio')}
            className="flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100 rounded-md"
          >
            <Radio size={18} /> Radio Group
          </button>
          <button
            onClick={() => onAddField('checkbox')}
            className="flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100 rounded-md"
          >
            <CheckSquare size={18} /> Checkbox Group
          </button>
          <button
            onClick={() => onAddField('dropdown')}
            className="flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100 rounded-md"
          >
            <ListFilter size={18} /> Dropdown
          </button>
          <button
            onClick={() => onAddField('optionList')}
            className="flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100 rounded-md"
          >
            <List size={18} /> Option List
          </button>
          <button
            onClick={() => onAddField('date')}
            className="flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100 rounded-md"
          >
            <Calendar size={18} /> Date Picker
          </button>
          <button
            onClick={() => onAddField('time')}
            className="flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100 rounded-md"
          >
            <Clock size={18} /> Time Picker
          </button>
          <button
            onClick={() => onAddField('number')}
            className="flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100 rounded-md"
          >
            <Hash size={18} /> Number Field
          </button>
          <button
            onClick={() => onAddField('image')}
            className="flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100 rounded-md"
          >
            <Image size={18} /> Image Upload
          </button>
          <button
            onClick={() => onAddField('signature')}
            className="flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100 rounded-md"
          >
            <PenLine size={18} /> Signature
          </button>
          <button
            onClick={() => onAddField('fileInput')}
            className="flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100 rounded-md"
          >
            <FileInput size={18} /> File Input
          </button>
          <button
            onClick={() => onAddField('fileOutput')}
            className="flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100 rounded-md"
          >
            <FileOutput size={18} /> File Output
          </button>
          <button
            onClick={() => onAddField('richText')}
            className="flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100 rounded-md"
          >
            <FileText size={18} /> Rich Text
          </button>
        </div>
      </div>
    </div>
  );
}
