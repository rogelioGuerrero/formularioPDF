import { StandardFonts } from 'pdf-lib';

export type FieldType = 
  | 'text' 
  | 'textarea'
  | 'radio' 
  | 'checkbox' 
  | 'dropdown' 
  | 'optionList'
  | 'image';

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
  lineHeight: number;
  labelSpacing: number;
  verticalSpacing: number;
  lines?: number;
  imageData?: string;
}
