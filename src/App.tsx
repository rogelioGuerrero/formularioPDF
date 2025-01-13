import React, { useState, useEffect, useCallback } from 'react';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { Layout } from './components/Layout';
import { Sidebar } from './components/Sidebar';
import PDFViewer from './components/PDFViewer';
import FieldManager from './components/FieldManager';
import type { Field, FieldType, PDFTextConfig } from './types';

export default function App() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [fields, setFields] = useState<Field[]>([
    { type: 'text', id: 'superhero', label: 'Favorite Superhero', yPosition: 700 },
    { type: 'radio', id: 'rocket', label: 'Favorite Rocket', options: ['Falcon Heavy', 'Saturn IV', 'Delta IV Heavy', 'Space Launch System'], yPosition: 650 },
    { type: 'checkbox', id: 'gundams', label: 'Favorite Gundams', options: ['Exia', 'Kyrios', 'Virtue', 'Dynames'], yPosition: 550 },
    { type: 'dropdown', id: 'planet', label: 'Favorite Planet', options: ['Venus', 'Earth', 'Mars', 'Pluto'], yPosition: 450 },
    { type: 'optionList', id: 'person', label: 'Favorite Person', options: ['Julius Caesar', 'Ada Lovelace', 'Cleopatra', 'Aaron Burr', 'Mark Antony'], yPosition: 400 },
  ]);
  const [pdfTextConfig, setPdfTextConfig] = useState<PDFTextConfig>({
    font: StandardFonts.Helvetica,
    fontSize: 12,
    lineHeight: 1.2,
  });

  const addField = (type: FieldType) => {
    const newField: Field = {
      type,
      id: `field_${Date.now()}`,
      label: `New ${type} field`,
      yPosition: Math.max(...fields.map(f => f.yPosition), 0) - 50,
    };
    if (type !== 'text') {
      newField.options = ['Option 1', 'Option 2', 'Option 3'];
    }
    setFields([...fields, newField]);
  };

  const deleteField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const updateField = (id: string, updatedField: Partial<Field>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updatedField } : field
    ));
  };

  const reorderFields = (newFields: Field[]) => {
    setFields(newFields);
  };

  const createForm = useCallback(async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([550, 750]);
    
    let font;
    try {
      font = await pdfDoc.embedFont(pdfTextConfig.font);
    } catch (error) {
      console.error('Error loading font:', error);
      font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    }

    const form = pdfDoc.getForm();

    fields.forEach((field) => {
      page.drawText(`${field.label}:`, { 
        x: 50, 
        y: field.yPosition, 
        size: pdfTextConfig.fontSize,
        font: font,
        lineHeight: pdfTextConfig.fontSize * pdfTextConfig.lineHeight
      });
      
      switch (field.type) {
        case 'text':
          const textField = form.createTextField(field.id);
          //textField.setText(formData[field.id] || ''); // We're removing FormBuilder
          textField.addToPage(page, { x: 200, y: field.yPosition - 15, width: 200, height: 20 });
          break;
        case 'radio':
          const radioGroup = form.createRadioGroup(field.id);
          field.options?.forEach((option, index) => {
            page.drawText(option, { 
              x: 200, 
              y: field.yPosition - (index * pdfTextConfig.fontSize * pdfTextConfig.lineHeight), 
              size: pdfTextConfig.fontSize,
              font: font,
              lineHeight: pdfTextConfig.fontSize * pdfTextConfig.lineHeight
            });
            radioGroup.addOptionToPage(option, page, { x: 180, y: field.yPosition - 10 - (index * pdfTextConfig.fontSize * pdfTextConfig.lineHeight) });
          });
          //if (formData[field.id]) {
          //  radioGroup.select(formData[field.id]);
          //}
          break;
        case 'checkbox':
          field.options?.forEach((option, index) => {
            const checkBox = form.createCheckBox(`${field.id}.${option}`);
            page.drawText(option, { 
              x: 220, 
              y: field.yPosition - (index * pdfTextConfig.fontSize * pdfTextConfig.lineHeight), 
              size: pdfTextConfig.fontSize,
              font: font,
              lineHeight: pdfTextConfig.fontSize * pdfTextConfig.lineHeight
            });
            checkBox.addToPage(page, { x: 200, y: field.yPosition - 10 - (index * pdfTextConfig.fontSize * pdfTextConfig.lineHeight) });
            //if (formData[field.id]?.includes(option)) {
            //  checkBox.check();
            //}
          });
          break;
        case 'dropdown':
          const dropdown = form.createDropdown(field.id);
          dropdown.addOptions(field.options || []);
          //dropdown.select(formData[field.id] || field.options?.[0] || '');
          dropdown.addToPage(page, { x: 200, y: field.yPosition - 15, width: 200, height: 20 });
          break;
        case 'optionList':
          const optionList = form.createOptionList(field.id);
          optionList.addOptions(field.options || []);
          //optionList.select(formData[field.id] || field.options?.[0] || '');
          optionList.addToPage(page, { x: 200, y: field.yPosition - 100, width: 200, height: 100 });
          break;
      }
    });

    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(pdfBlob);
    setPdfUrl(url);
  }, [fields, pdfTextConfig]);

  useEffect(() => {
    createForm();
  }, [createForm, fields, pdfTextConfig]);

  return (
    <Layout>
      <Sidebar
        onAddField={addField}
        pdfTextConfig={pdfTextConfig}
        onConfigChange={(config) => setPdfTextConfig({ ...pdfTextConfig, ...config })}
      />
      <div className="flex-1 space-y-4">
        <h1 className="text-3xl font-bold">Online Form Creator</h1>
        <div className="grid grid-cols-2 gap-4">
          <FieldManager 
            fields={fields} 
            onDeleteField={deleteField} 
            onUpdateField={updateField}
            onReorderFields={reorderFields}
          />
          <PDFViewer pdfUrl={pdfUrl} />
        </div>
      </div>
    </Layout>
  );
}
