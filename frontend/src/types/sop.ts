
export interface SOPStep {
  order: number;
  description: string;
}

export interface SOP {
  id: string;
  title: string;
  category: string;
  description: string;
  steps: SOPStep[];
  createdAt: string;
  updatedAt: string;
}