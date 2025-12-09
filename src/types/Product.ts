// Types pour les produits
export interface Product {
  id: string;
  name: string;
  price: string;
  priceNumeric: number; // Prix en nombre pour les calculs
  oldPrice?: string;
  image: any; // Pour les images locales avec require()
  imageUrl?: string; // URL de l'image du backend
  description: string;
  orderCount?: number;
  category: string;
  stock?: number;
  weight?: string;
  quality?: string;
  variety?: string;
  color?: string;
  details?: string[];
  seller?: {
    name: string;
    producer: string;
    rating: number;
  };
  badge?: string;
  badgeColor?: string;
  qualityIndicators?: string[];
}

export interface Category {
  id: string;
  name: string;
  image?: any;
}

export interface ProductResponse {
  products: Product[];
  total: number;
}