import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import Layout from './components/Layout';
import PDFViewer from './components/PDFViewer';
import FieldManager from './components/FieldManager';
import type { Field, FieldType } from './types';
import { safeStorage } from './utils/storage';

const App = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [fields, setFields] = useState<Field[]>(() => {
    const savedFields = safeStorage.getItem('formFields');
    return savedFields || [];
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

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
      yPosition: 700,
      xPosition: 50,
      width: 200,
      height: 20,
      font: StandardFonts.Helvetica,
      fontSize: 12,
      lineHeight: 1.2,
      labelSpacing: 20,
      verticalSpacing: 30,
    };
    if (type !== 'text') {
      newField.options = ['Option 1', 'Option 2', 'Option 3'];
    }
    setFields([...fields, newField]);
  };

  const deleteField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const updateField = (id: string, updatedField: Partial<Field>) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, ...updatedField } : field
      )
    );
  };

  const reorderFields = (newFields: Field[]) => {
    setFields(newFields);
  };

  const createForm = useCallback(async () => {
    if (!fileInputRef.current?.files?.[0]) return;

    setIsGeneratingPdf(true);

    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      fields.forEach(async (field) => {
        let font;
        try {
          font = await pdfDoc.embedFont(field.font);
        } catch (error) {
          console.error('Error loading font:', error);
          font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        }

        // Draw field label
        firstPage.drawText(`${field.label}:`, {
          x: field.xPosition,
          y: height - field.yPosition,
          size: field.fontSize,
          font: font,
          lineHeight: field.fontSize * field.lineHeight,
        });

        // Handle different field types
        switch (field.type) {
          case 'text':
          case 'textarea':
            const textField = pdfDoc.getForm().createTextField(field.id);
            textField.addToPage(firstPage, {
              x: field.xPosition + field.labelSpacing,
              y: height - field.yPosition - field.verticalSpacing,
              width: field.width,
              height: field.height * (field.lines || 1),
              multiline: field.type === 'textarea',
            });
            break;

          case 'radio':
            const radioGroup = pdfDoc.getForm().createRadioGroup(field.id);
            field.options?.forEach((option, index) => {
              const yOffset =
                field.yPosition - index * field.fontSize * field.lineHeight;

              firstPage.drawText(option, {
                x: field.xPosition + field.labelSpacing,
                y: height - yOffset - field.verticalSpacing,
                size: field.fontSize,
                font: font,
                lineHeight: field.fontSize * field.lineHeight,
              });

              const circleSize = field.fontSize * 0.8;
              const circleX = field.xPosition + field.labelSpacing - 20;
              const circleY =
                height - yOffset - field.verticalSpacing - circleSize / 2;

              radioGroup.addOptionToPage(option, firstPage, {
                x: circleX,
                y: circleY,
                width: circleSize,
                height: circleSize,
              });
            });
            break;

          case 'checkbox':
            field.options?.forEach((option, index) => {
              const yOffset =
                field.yPosition - index * field.fontSize * field.lineHeight;

              firstPage.drawText(option, {
                x: field.xPosition + field.labelSpacing,
                y: height - yOffset - field.verticalSpacing,
                size: field.fontSize,
                font: font,
                lineHeight: field.fontSize * field.lineHeight,
              });

              const checkboxSize = field.fontSize * 0.8;
              const checkboxX = field.xPosition + field.labelSpacing - 20;
              const checkboxY =
                height - yOffset - field.verticalSpacing - checkboxSize / 2;

              const checkBox = pdfDoc.getForm().createCheckBox(
                `${field.id}.${option}`
              );
              checkBox.addToPage(firstPage, {
                x: checkboxX,
                y: checkboxY,
                width: checkboxSize,
                height: checkboxSize,
              });
            });
            break;

          case 'dropdown':
            const dropdown = pdfDoc.getForm().createDropdown(field.id);
            dropdown.addOptions(field.options || []);
            dropdown.addToPage(firstPage, {
              x: field.xPosition + field.labelSpacing,
              y: height - field.yPosition - field.verticalSpacing,
              width: field.width,
              height: field.height,
            });
            break;

          case 'optionList':
            const optionList = pdfDoc.getForm().createOptionList(field.id);
            optionList.addOptions(field.options || []);
            optionList.addToPage(firstPage, {
              x: field.xPosition + field.labelSpacing,
              y: height - field.yPosition - 100 - field.verticalSpacing,
              width: field.width,
              height: field.height * 5,
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
    setIsGeneratingPdf(false);
  }, [fields]);

  useEffect(() => {
    safeStorage.setItem('formFields', fields);
  }, [fields]);

  const handleGeneratePdf = () => {
    createForm();
  };

  return (
    <Layout onAddField={addField}>
      <div className="flex-1 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Online Form Creator
          </h1>
          <div className="flex items-center gap-4">
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
            <button
              onClick={handleGeneratePdf}
              disabled={isGeneratingPdf}
              className={`${
                isGeneratingPdf
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-700'
              } text-white font-bold py-2 px-4 rounded-md`}
            >
              {isGeneratingPdf ? 'Generating...' : 'Generate PDF'}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FieldManager
            fields={fields}
            onDeleteField={deleteField}
            onUpdateField={updateField}
            onReorderFields={reorderFields}
          />
          <PDFViewer
            pdfUrl={pdfUrl}
            fields={fields}
            updateField={updateField}
          />
        </div>
      </div>
    </Layout>
  );
};

export default App; // Esta es la línea que faltaba
