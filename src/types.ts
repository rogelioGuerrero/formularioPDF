import { StandardFonts } from 'pdf-lib';

export type FieldType = 'text' | 'radio' | 'checkbox' | 'dropdown' | 'optionList';

export interface Field {
  type: FieldType;
  id: string;
  label: string;
  options?: string[];
  xPosition: number;
  yPosition: number;
  width: number;
  height: number;
  font: keyof typeof StandardFonts;
  fontSize: number;
  inputFont?: keyof typeof StandardFonts;
  inputFontSize?: number;
}

export interface PDFTextConfig {
  font: keyof typeof StandardFonts;
  fontSize: number;
  lineHeight: number;
  labelSpacing: number;
  verticalSpacing: number;
}

export interface FieldPosition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
