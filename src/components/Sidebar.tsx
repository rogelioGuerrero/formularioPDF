import React from 'react';
import { Plus, Type, Radio, CheckSquare, ListFilter, List } from 'lucide-react';
import type { PDFTextConfig, FieldType } from '../types';
import { StandardFonts } from 'pdf-lib';

interface SidebarProps {
  onAddField: (type: FieldType) => void;
  pdfTextConfig: PDFTextConfig;
  onConfigChange: (config: Partial<PDFTextConfig>) => void;
}

export function Sidebar({ onAddField, pdfTextConfig, onConfigChange }: SidebarProps) {
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
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">PDF Text Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Font</label>
            <select
              value={pdfTextConfig.font}
              onChange={(e) => onConfigChange({ font: e.target.value as keyof typeof StandardFonts })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value={StandardFonts.Helvetica}>Helvetica</option>
              <option value={StandardFonts.TimesRoman}>Times Roman</option>
              <option value={StandardFonts.Courier}>Courier</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Font Size</label>
            <input
              type="number"
              value={pdfTextConfig.fontSize}
              onChange={(e) => onConfigChange({ fontSize: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Line Height</label>
            <input
              type="number"
              step="0.1"
              value={pdfTextConfig.lineHeight}
              onChange={(e) => onConfigChange({ lineHeight: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
