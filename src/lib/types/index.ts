// Krishi Mitra — Type Definitions

export type Language = 'hi' | 'pa' | 'te' | 'en';

export interface FarmerProfile {
  id: string;
  name: string;
  phone: string;
  language: Language;
  state: string;
  district: string;
  village: string;
  lat?: number;
  lng?: number;
  landSize: number; // acres
  landType: 'irrigated' | 'rainfed' | 'mixed';
  crops: string[];
  soilType?: string;
  budget?: number;
  familyMode: boolean;
}

export interface WeatherData {
  date: string;
  tempMax: number;
  tempMin: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  windDir: string;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'foggy' | 'partly_cloudy';
  uvIndex: number;
  advisory: string;
  actions: ActionCard[];
}

export interface ActionCard {
  type: 'do_today' | 'avoid' | 'check';
  title: string;
  description: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
}

export interface MarketPrice {
  id: string;
  commodity: string;
  variety: string;
  market: string;
  district: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  date: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
  distance?: number;
  transportCost?: number;
}

export interface CropInfo {
  id: string;
  name: string;
  nameHi: string;
  namePa: string;
  nameTe: string;
  category: 'cereal' | 'pulse' | 'oilseed' | 'vegetable' | 'fruit' | 'spice' | 'fibre' | 'cash';
  season: ('kharif' | 'rabi' | 'zaid')[];
  sowingMonths: number[];
  harvestMonths: number[];
  waterReq: 'low' | 'medium' | 'high';
  daysToHarvest: [number, number];
  idealSoilPh: [number, number];
  idealTemp: [number, number];
  costPerAcre: number;
  expectedYield: [number, number]; // quintals per acre
  msp?: number;
  image: string;
  stages: CropStage[];
}

export interface CropStage {
  name: string;
  dayRange: [number, number];
  activities: string[];
  icon: string;
}

export interface DiseaseInfo {
  id: string;
  name: string;
  nameHi: string;
  crop: string;
  symptoms: string[];
  causes: string[];
  treatment: string[];
  prevention: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence?: number;
  image?: string;
}

export interface SoilReport {
  id: string;
  date: string;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicCarbon: number;
  electricalConductivity: number;
  sulphur?: number;
  zinc?: number;
  boron?: number;
  iron?: number;
  manganese?: number;
  copper?: number;
  texture: 'sandy' | 'loamy' | 'clayey' | 'silty';
}

export interface SoilParameter {
  name: string;
  value: number;
  unit: string;
  status: 'low' | 'normal' | 'high';
  advice: string;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  ministry: string;
  benefits: string[];
  eligibility: string[];
  documents: string[];
  steps: string[];
  website: string;
  helpline?: string;
  category: 'income' | 'insurance' | 'credit' | 'equipment' | 'irrigation' | 'market' | 'solar' | 'organic';
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  language: Language;
  type: 'text' | 'voice' | 'image';
  imageUrl?: string;
  actions?: ActionCard[];
  sources?: string[];
  confidence?: number;
}

export interface CropRecommendation {
  crop: CropInfo;
  riskLevel: 'low' | 'balanced' | 'high';
  expectedProfit: [number, number];
  costs: {
    seed: number;
    fertilizer: number;
    labour: number;
    irrigation: number;
    transport: number;
    other: number;
  };
  suitabilityScore: number;
  reasons: string[];
  warnings: string[];
}

export interface Notification {
  id: string;
  type: 'weather' | 'market' | 'crop' | 'scheme' | 'disease' | 'reminder' | 'emergency';
  title: string;
  body: string;
  timestamp: Date;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  action?: string;
}
