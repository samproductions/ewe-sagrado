
export interface PlantAnalysis {
  scientificName: string;
  commonName: string;
  orixaRuling: string;
  fundamento: 'Quente' | 'Morna' | 'Fria';
  fundamentoExplanation: string;
  eweClassification: 'Ewe Pupa' | 'Ewe Dudu' | 'Ewe Funfun';
  ritualNature: 'Descarrego' | 'Energização' | 'Equilíbrio';
  applicationLocation: string[];
  stepByStepInstructions: string[];
  prayer: {
    title: string;
    text: string;
    translation?: string;
  };
  goldenTip: {
    title: string;
    content: string;
  };
  element: string;
  historicalContext: string;
  safetyWarnings?: string;
  suggestedTitle: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  analysis: PlantAnalysis;
  previewUrl: string;
  timestamp: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
