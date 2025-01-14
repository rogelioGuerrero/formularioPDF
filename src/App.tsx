import React, { useState, useEffect, useCallback } from 'react';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { Layout } from './components/Layout';
import { Sidebar } from './components/Sidebar';
import PDFViewer from './components/PDFViewer';
import FieldManager from './components/FieldManager';
import type { Field, FieldType, PDFTextConfig } from './types';
import { safeStorage } from './utils/storage';

const App = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [fields, setFields] = useState<Field[]>(() => {
    const savedFields = safeStorage.getItem('formFields');
    return savedFields || [];
  });
  const [pdfTextConfig, setPdfTextConfig] = useState<PDFTextConfig>(() => {
    const savedConfig = safeStorage.getItem('pdfConfig');
    return savedConfig || {
      font: StandardFonts.Helvetica,
      fontSize: 12,
      lineHeight: 1.2,
      labelSpacing: 20,
      verticalSpacing: 30,
    };
  });

  // Save fields to storage whenever they change
  useEffect(() => {
    safeStorage.setItem('formFields', fields);
  }, [fields]);

  // Save pdfTextConfig to storage whenever it changes
  useEffect(() => {
    safeStorage.setItem('pdfConfig', pdfTextConfig);
  }, [pdfTextConfig]);

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
      // Draw field label
      page.drawText(`${field.label}:`, { 
        x: 50, 
        y: field.yPosition, 
        size: pdfTextConfig.fontSize,
        font: font,
        lineHeight: pdfTextConfig.fontSize * pdfTextConfig.lineHeight
      });

      // Handle different field types
      switch (field.type) {
        case 'text':
        case 'number':
        case 'date':
        case 'time':
        case 'richText':
          const textField = form.createTextField(field.id);
          textField.addToPage(page, { 
            x: 50 + pdfTextConfig.labelSpacing, 
            y: field.yPosition - pdfTextConfig.verticalSpacing, 
            width: 200, 
            height: pdfTextConfig.fontSize * 1.2
          });
          break;

        case 'radio':
          const radioGroup = form.createRadioGroup(field.id);
          field.options?.forEach((option, index) => {
            const yOffset = field.yPosition - (index * pdfTextConfig.fontSize * pdfTextConfig.lineHeight);
            
            page.drawText(option, { 
              x: 50 + pdfTextConfig.labelSpacing, 
              y: yOffset - pdfTextConfig.verticalSpacing, 
              size: pdfTextConfig.fontSize,
              font: font,
              lineHeight: pdfTextConfig.fontSize * pdfTextConfig.lineHeight
            });

            const circleSize = pdfTextConfig.fontSize * 0.8;
            const circleX = 50 + pdfTextConfig.labelSpacing - 20;
            const circleY = yOffset - pdfTextConfig.verticalSpacing - (circleSize / 2);

            radioGroup.addOptionToPage(option, page, { 
              x: circleX, 
              y: circleY, 
              width: circleSize, 
              height: circleSize 
            });
          });
          break;

        case 'checkbox':
          field.options?.forEach((option, index) => {
            const yOffset = field.yPosition - (index * pdfTextConfig.fontSize * pdfTextConfig.lineHeight);
            
            page.drawText(option, { 
              x: 50 + pdfTextConfig.labelSpacing, 
              y: yOffset - pdfTextConfig.verticalSpacing, 
              size: pdfTextConfig.fontSize,
              font: font,
              lineHeight: pdfTextConfig.fontSize * pdfTextConfig.lineHeight
            });

            const checkboxSize = pdfTextConfig.fontSize * 0.8;
            const checkboxX = 50 + pdfTextConfig.labelSpacing - 20;
            const checkboxY = yOffset - pdfTextConfig.verticalSpacing - (checkboxSize / 2);

            const checkBox = form.createCheckBox(`${field.id}.${option}`);
            checkBox.addToPage(page, { 
              x: checkboxX, 
              y: checkboxY, 
              width: checkboxSize, 
              height: checkboxSize 
            });
          });
          break;

        case 'dropdown':
          const dropdown = form.createDropdown(field.id);
          dropdown.addOptions(field.options || []);
          dropdown.addToPage(page, { 
            x: 50 + pdfTextConfig.labelSpacing, 
            y: field.yPosition - pdfTextConfig.verticalSpacing, 
            width: 200, 
            height: pdfTextConfig.fontSize * 1.2
          });
          break;

        case 'optionList':
          const optionList = form.createOptionList(field.id);
          optionList.addOptions(field.options || []);
          optionList.addToPage(page, { 
            x: 50 + pdfTextConfig.labelSpacing, 
            y: field.yPosition - 100 - pdfTextConfig.verticalSpacing, 
            width: 200, 
            height: pdfTextConfig.fontSize * 5
          });
          break;

        case 'image':
          if (field.imageData) {
            const imageBytes = Uint8Array.from(atob(field.imageData), c => c.charCodeAt(0));
            const image = pdfDoc.embedPng(imageBytes);
            const { width, height } = image.scale(0.5);
            page.drawImage(image, {
              x: 50 + pdfTextConfig.labelSpacing,
              y: field.yPosition - pdfTextConfig.verticalSpacing,
              width,
              height
            });
          }
          break;

        case 'signature':
          if (field.signatureData) {
            const signatureBytes = Uint8Array.from(atob(field.signatureData), c => c.charCodeAt(0));
            const signature = pdfDoc.embedPng(signatureBytes);
            const { width, height } = signature.scale(0.5);
            page.drawImage(signature, {
              x: 50 + pdfTextConfig.labelSpacing,
              y: field.yPosition - pdfTextConfig.verticalSpacing,
              width,
              height
            });
          }
          break;

        case 'fileInput':
        case 'fileOutput':
          // Handle file fields as text fields for now
          const fileField = form.createTextField(field.id);
          fileField.addToPage(page, { 
            x: 50 + pdfTextConfig.labelSpacing, 
            y: field.yPosition - pdfTextConfig.verticalSpacing, 
            width: 200, 
            height: pdfTextConfig.fontSize * 1.2
          });
          break;
      }
    });

    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(pdfBlob);
    setPdfUrl(url);
  }, [fields, pdfTextConfig]);

  const addField = (type: FieldType) => {
    const newField: Field = {
      type,
      id: `field_${Date.now()}`,
      label: `New ${type} field`,
      yPosition: Math.max(...fields.map(f => f.yPosition), 700) - (pdfTextConfig.fontSize * pdfTextConfig.lineHeight * 2),
      xPosition: 50,
      width: 200,
      height: pdfTextConfig.fontSize * 1.2,
      font: StandardFonts.Helvetica,
      fontSize: pdfTextConfig.fontSize
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

  // Call createForm whenever fields or pdfTextConfig changes
  useEffect(() => {
    createForm();
  }, [fields, pdfTextConfig]);

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

export default App;
