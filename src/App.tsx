import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import Layout from './components/Layout';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const fileReader = new FileReader();
        fileReader.onload = async (e) => {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const pdfDoc = await PDFDocument.load(arrayBuffer);
          setPdfUrl(URL.createObjectURL(new Blob([await pdfDoc.save()], { type: 'application/pdf' })));
        };
        fileReader.readAsArrayBuffer(file);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    }
  };

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

  const createForm = useCallback(async () => {
    if (!fileInputRef.current?.files?.[0]) return;

    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

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
        firstPage.drawText(`${field.label}:`, { 
          x: field.xPosition, 
          y: height - field.yPosition, 
          size: pdfTextConfig.fontSize,
          font: font,
          lineHeight: pdfTextConfig.fontSize * pdfTextConfig.lineHeight
        });

        // Handle different field types
        switch (field.type) {
          case 'text':
            const textField = form.createTextField(field.id);
            textField.addToPage(firstPage, { 
              x: field.xPosition + pdfTextConfig.labelSpacing, 
              y: height - field.yPosition - pdfTextConfig.verticalSpacing, 
              width: field.width, 
              height: field.height
            });
            break;

          case 'radio':
            const radioGroup = form.createRadioGroup(field.id);
            field.options?.forEach((option, index) => {
              const yOffset = field.yPosition - (index * pdfTextConfig.fontSize * pdfTextConfig.lineHeight);
              
              firstPage.drawText(option, { 
                x: field.xPosition + pdfTextConfig.labelSpacing, 
                y: height - yOffset - pdfTextConfig.verticalSpacing, 
                size: pdfTextConfig.fontSize,
                font: font,
                lineHeight: pdfTextConfig.fontSize * pdfTextConfig.lineHeight
              });

              const circleSize = pdfTextConfig.fontSize * 0.8;
              const circleX = field.xPosition + pdfTextConfig.labelSpacing - 20;
              const circleY = height - yOffset - pdfTextConfig.verticalSpacing - (circleSize / 2);

              radioGroup.addOptionToPage(option, firstPage, { 
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
              
              firstPage.drawText(option, { 
                x: field.xPosition + pdfTextConfig.labelSpacing, 
                y: height - yOffset - pdfTextConfig.verticalSpacing, 
                size: pdfTextConfig.fontSize,
                font: font,
                lineHeight: pdfTextConfig.fontSize * pdfTextConfig.lineHeight
              });

              const checkboxSize = pdfTextConfig.fontSize * 0.8;
              const checkboxX = field.xPosition + pdfTextConfig.labelSpacing - 20;
              const checkboxY = height - yOffset - pdfTextConfig.verticalSpacing - (checkboxSize / 2);

              const checkBox = form.createCheckBox(`${field.id}.${option}`);
              checkBox.addToPage(firstPage, { 
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
            dropdown.addToPage(firstPage, { 
              x: field.xPosition + pdfTextConfig.labelSpacing, 
              y: height - field.yPosition - pdfTextConfig.verticalSpacing, 
              width: field.width, 
              height: field.height
            });
            break;

          case 'optionList':
            const optionList = form.createOptionList(field.id);
            optionList.addOptions(field.options || []);
            optionList.addToPage(firstPage, { 
              x: field.xPosition + pdfTextConfig.labelSpacing, 
              y: height - field.yPosition - 100 - pdfTextConfig.verticalSpacing, 
              width: field.width, 
              height: field.height * 5
            });
            break;
        }
      });

      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    };

    fileReader.readAsArrayBuffer(fileInputRef.current.files[0]);
  }, [fields, pdfTextConfig]);

  // Call createForm whenever fields or pdfTextConfig changes
  useEffect(() => {
    createForm();
  }, [fields, pdfTextConfig]);

  const handleConfigChange = (config: Partial<PDFTextConfig>) => {
    setPdfTextConfig(prevConfig => ({ ...prevConfig, ...config }));
  };

  return (
    <Layout onAddField={addField} pdfTextConfig={pdfTextConfig} onConfigChange={handleConfigChange}>
      <div className="flex-1 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Online Form Creator</h1>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="application/pdf"
            className="file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0
                     file:text-sm file:font-semibold
                     file:bg-indigo-50 file:text-indigo-700
                     hover:file:bg-indigo-100"
          />
        </div>
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
