import { StandardFonts } from 'pdf-lib';

export type FieldType = 'text' | 'radio' | 'checkbox' | 'dropdown' | 'optionList';

export interface Field {
  type: FieldType;
  id: string;
  label: string;
  options?: string[];
  yPosition: number;
  xPosition?: number; // Nueva propiedad para posición horizontal
  width?: number;     // Nueva propiedad para ancho
  height?: number;    // Nueva propiedad para altura
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
