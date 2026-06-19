export interface TransportFactors {
  bike: number;
  public: number;
  car: number;
  plane: number;
}

export interface FoodFactors {
  vegan: number;
  vegetarian: number;
  mixed: number;
  meatHeavy: number;
}

export interface ShoppingFactors {
  minimal: number;
  low: number;
  medium: number;
  high: number;
}

export interface CategoryImpactMap {
  [category: string]: string;
}

export const transportFactors: TransportFactors = {
  bike: 0,
  public: 1.5,
  car: 4.2,
  plane: 6.8,
};

export const foodFactors: FoodFactors = {
  vegan: 1.5,
  vegetarian: 2.0,
  mixed: 3.5,
  meatHeavy: 5.5,
};

export const energyFactor: number = 0.5;

export const shoppingFactors: ShoppingFactors = {
  minimal: 0.5,
  low: 1.5,
  medium: 3.0,
  high: 5.0,
};

export const categoryImpactMap: CategoryImpactMap = {
  plastic: "High",
  paper: "Low",
  glass: "Low",
  metal: "Medium",
  organic: "Low",
  electronic: "High",
  textile: "Medium",
  hazardous: "Critical",
  mixed: "Medium",
};

export const categoryColors: { [key: string]: string } = {
  plastic: "#FF6B6B",
  paper: "#4ECDC4",
  glass: "#45B7D1",
  metal: "#96CEB4",
  organic: "#8BC34A",
  electronic: "#FF9800",
  textile: "#9C27B0",
  hazardous: "#F44336",
  mixed: "#78909C",
};
