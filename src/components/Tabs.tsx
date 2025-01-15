import React, { useState } from 'react';
import { type ReactNode } from 'react';
import clsx from 'clsx';
import { 
  TextCursorInput,
  CircleDot,
  CheckSquare,
  ChevronDown,
  List
} from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: ReactNode;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

export function Tabs({ tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'group relative whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <div className="flex items-center gap-2">
                {tab.icon}
                <span className="absolute top-full mt-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1">
                  {tab.label}
                </span>
              </div>
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-4">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}
