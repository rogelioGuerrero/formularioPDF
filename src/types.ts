import { StandardFonts } from 'pdf-lib';

export type FieldType = 'text' | 'radio' | 'checkbox' | 'dropdown' | 'optionList';

export interface Field {
  type: FieldType;
  id: string;
  label: string;
  options?: string[];
  yPosition: number;
}

export interface PDFTextConfig {
  font: keyof typeof StandardFonts;
  fontSize: number;
  lineHeight: number;
}
