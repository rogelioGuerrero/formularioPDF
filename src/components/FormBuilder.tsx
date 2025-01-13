import React from 'react';
import type { Field } from '../types';

interface FormBuilderProps {
  fields: Field[];
  onChange: (formData: Record<string, any>) => void;
  onSubmit: (formData: Record<string, any>) => void;
}

export default function FormBuilder({ fields, onChange, onSubmit }: FormBuilderProps) {
  const [formData, setFormData] = React.useState<Record<string, any>>({});

  const handleChange = (id: string, value: any) => {
    const newFormData = { ...formData, [id]: value };
    setFormData(newFormData);
    onChange(newFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      {fields.map((field) => (
        <div key={field.id} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{field.label}</label>
          {field.type === 'text' && (
            <input
              type="text"
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          )}
          {field.type === 'radio' && (
            <div className="space-y-2">
              {field.options?.map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name={field.id}
                    value={option}
                    checked={formData[field.id] === option}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2">{option}</span>
                </label>
              ))}
            </div>
          )}
          {field.type === 'checkbox' && (
            <div className="space-y-2">
              {field.options?.map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    value={option}
                    checked={(formData[field.id] || []).includes(option)}
                    onChange={(e) => {
                      const currentValues = formData[field.id] || [];
                      const newValues = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter((v: string) => v !== option);
                      handleChange(field.id, newValues);
                    }}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2">{option}</span>
                </label>
              ))}
            </div>
          )}
          {field.type === 'dropdown' && (
            <select
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select an option</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
          {field.type === 'optionList' && (
            <select
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              size={5}
            >
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Generate PDF
      </button>
    </form>
  );
}
