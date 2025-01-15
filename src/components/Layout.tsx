import React from 'react';
import { Sidebar } from './Sidebar';
import type { FieldType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  onAddField: (type: FieldType) => void;
}

export default function Layout({ children, onAddField }: LayoutProps) {
  return (
    <div className="container mx-auto p-4 flex gap-4">
      <Sidebar onAddField={onAddField} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
