import React from 'react';
import type { PDFTextConfig } from '../types';

interface SidebarProps {
  pdfTextConfig: PDFTextConfig;
  onConfigChange: (config: Partial<PDFTextConfig>) => void;
}

export function Sidebar({ pdfTextConfig, onConfigChange }: SidebarProps) {
  return (
    <div className="w-64 bg-white p-4 rounded-lg shadow-md space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-3">PDF Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Font Size</label>
            <input
              type="number"
              value={pdfTextConfig.fontSize}
              onChange={(e) => onConfigChange({ fontSize: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Line Height</label>
            <input
              type="number"
              value={pdfTextConfig.lineHeight}
              onChange={(e) => onConfigChange({ lineHeight: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              step="0.1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
