export enum BikeSection {
  Cockpit = 'Cockpit', // Handlebars, Stem, Brakes, Shifters
  Frame = 'Frame', // Frame, Saddle, Seatpost, Fork
  Drivetrain = 'Drivetrain', // Chain, Pedals, Derailleur, Crankset, Engine
  Wheels = 'Wheels', // Tires, Rims, Spokes, Hubs
  Accessories = 'Accessories' // Lights, Locks, etc.
}

export type VehicleType = 'bicycle' | 'motorbike';

export interface InventoryItem {
  id: string;
  name: string;
  type: VehicleType;
  section: BikeSection;
  price: number;
  quantity: number;
  description: string;
  image?: string;
  minStockThreshold: number;
}

export interface AIAnalysisResponse {
  suggestedDescription: string;
  technicalSpecs: string[];
}