import React from 'react';
import { Plus } from 'lucide-react';
import { Tabs } from './Tabs';
import { Sidebar } from './Sidebar';
import type { FieldType, PDFTextConfig } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  onAddField: (type: FieldType) => void;
  pdfTextConfig: PDFTextConfig;
  onConfigChange: (config: Partial<PDFTextConfig>) => void;
}

export default function Layout({ children, onAddField, pdfTextConfig, onConfigChange }: LayoutProps) {
  const tabs = [
    {
      id: 'text',
      label: 'Text Field',
      content: (
        <button onClick={() => onAddField('text')} className="flex items-center gap-2">
          <Plus size={16} /> Add Text Field
        </button>
      ),
    },
    {
      id: 'radio',
      label: 'Radio Group',
      content: (
        <button onClick={() => onAddField('radio')} className="flex items-center gap-2">
          <Plus size={16} /> Add Radio Group
        </button>
      ),
    },
    {
      id: 'checkbox',
      label: 'Checkbox Group',
      content: (
        <button onClick={() => onAddField('checkbox')} className="flex items-center gap-2">
          <Plus size={16} /> Add Checkbox Group
        </button>
      ),
    },
    {
      id: 'dropdown',
      label: 'Dropdown',
      content: (
        <button onClick={() => onAddField('dropdown')} className="flex items-center gap-2">
          <Plus size={16} /> Add Dropdown
        </button>
      ),
    },
    {
      id: 'optionList',
      label: 'Option List',
      content: (
        <button onClick={() => onAddField('optionList')} className="flex items-center gap-2">
          <Plus size={16} /> Add Option List
        </button>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4 flex gap-4">
      <Sidebar pdfTextConfig={pdfTextConfig} onConfigChange={onConfigChange} />
      <div className="flex-1">
        <Tabs tabs={tabs} />
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
