import { Product, Category } from '../types/Product';

// Catégories de produits
export const categories: Category[] = [
  { id: '1', name: 'Produits agricoles', image: require('../assets/images/manioc.png') },
  { id: '2', name: "Produits d'élevage", image: require('../assets/images/noix.png') },
  { id: '3', name: 'Produits halieutiques', image: require('../assets/images/pomme.png') },
  { id: '4', name: 'Condiments et épices', image: require('../assets/images/patate.png') },
  { id: '5', name: 'Produits transformés', image: require('../assets/images/tomate.png') },
];

// Sous-catégories recommandées
export const recommendedSubcategories = [
  { id: '1', name: 'légumes racines', image: require('../assets/images/patate.png'), categoryId: '1' },
  { id: '2', name: 'fruits', image: require('../assets/images/pomme.png'), categoryId: '1' },
  { id: '3', name: 'viandes', image: require('../assets/images/noix.png'), categoryId: '2' },
  { id: '4', name: 'céréales', image: require('../assets/images/manioc.png'), categoryId: '1' },
  { id: '5', name: 'oignons', image: require('../assets/images/patate.png'), categoryId: '4' },
  { id: '6', name: 'carottes', image: require('../assets/images/patate.png'), categoryId: '1' },
];

// Données mockées des produits enrichies
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Tige de manioc',
    price: '3000 FCFA',
    priceNumeric: 3000,
    oldPrice: '3500 FCFA',
    image: require('../assets/images/manioc.png'),
    description: 'Manioc frais cultivé localement, idéal pour vos plats traditionnels.',
    orderCount: 45,
    category: 'Produits agricoles',
    stock: 20,
    weight: '2.5 Kg',
    quality: 'Agriculture Raisonnée Sans Pesticides De Synthèse',
    variety: 'Manioc blanc',
    details: [
      'Variété : Manioc blanc traditionnel',
      'Origine : Culture locale',
      'Conservation : 5-7 jours au frais'
    ],
    seller: {
      name: 'La Ferme De Sow',
      producer: 'Jean Et Sylvie Martin',
      rating: 5
    },
    badge: 'A',
    badgeColor: '#22C55E',
    qualityIndicators: ['#22C55E', '#F59E0B', '#F97316']
  },
  {
    id: '2',
    name: 'Cageot de tomates',
    price: '2500 FCFA',
    priceNumeric: 2500,
    oldPrice: '3000 FCFA',
    image: require('../assets/images/tomate.png'),
    description: 'Tomates rouges et juteuses, parfaites pour vos sauces et salades.',
    orderCount: 67,
    category: 'Produits agricoles',
    stock: 15,
    weight: '3 Kg',
    quality: 'Agriculture Raisonnée Sans Pesticides De Synthèse',
    variety: 'Cœur De Bœuf Ancienne',
    color: 'Rouge vif',
    details: [
      'Variété : Cœur De Bœuf Ancienne',
      'Couleur : Rouge intense',
      'Goût : Riche et dense d\'exception'
    ],
    seller: {
      name: 'La Ferme De Sow',
      producer: 'Jean Et Sylvie Martin',
      rating: 5
    },
    badge: 'A',
    badgeColor: '#22C55E',
    qualityIndicators: ['#22C55E', '#F59E0B']
  },
  {
    id: '3',
    name: 'Noix de palme',
    price: '2700 FCFA',
    priceNumeric: 2700,
    oldPrice: '3000 FCFA',
    image: require('../assets/images/noix.png'),
    description: 'Noix de palme fraîches de qualité supérieure pour l\'huile rouge.',
    orderCount: 89,
    category: 'Produits agricoles',
    stock: 50,
    weight: '5 Kg',
    quality: 'Production Locale Traditionnelle',
    variety: 'Noix rouge',
    details: [
      'Variété : Noix de palme rouge',
      'Origine : Production locale',
      'Usage : Huile de palme artisanale'
    ],
    seller: {
      name: 'Coopérative Agricole',
      producer: 'Marie Mbarga',
      rating: 4
    },
    badge: 'B',
    badgeColor: '#F59E0B',
    qualityIndicators: ['#F59E0B', '#F97316']
  },
  {
    id: '4',
    name: 'Pommes',
    price: '2700 FCFA',
    priceNumeric: 2700,
    oldPrice: '3200 FCFA',
    image: require('../assets/images/pomme.png'),
    description: 'Pommes croquantes et savoureuses, importées et sélectionnées.',
    orderCount: 102,
    category: 'Produits agricoles',
    stock: 25,
    weight: '2 Kg',
    quality: 'Qualité Premium Importée',
    variety: 'Golden Delicious',
    details: [
      'Variété : Golden Delicious',
      'Origine : Importation',
      'Conservation : 2-3 semaines au frais'
    ],
    seller: {
      name: 'Fruits & Légumes Plus',
      producer: 'Import International',
      rating: 5
    },
    badge: 'A',
    badgeColor: '#22C55E',
    qualityIndicators: ['#22C55E', '#F59E0B', '#F97316']
  },
  {
    id: '5',
    name: 'Patates douces',
    price: '1500 FCFA',
    priceNumeric: 1500,
    oldPrice: '2000 FCFA',
    image: require('../assets/images/patate.png'),
    description: 'Patates douces tendres et sucrées, cultivées localement.',
    orderCount: 34,
    category: 'Produits agricoles',
    stock: 40,
    weight: '3 Kg',
    quality: 'Agriculture Biologique Locale',
    variety: 'Patate orange',
    details: [
      'Variété : Patate orange',
      'Origine : Culture locale bio',
      'Richesse : Haute teneur en vitamine A'
    ],
    seller: {
      name: 'Bio Ferme Yaoundé',
      producer: 'Joseph Nkolo',
      rating: 5
    },
    badge: 'A',
    badgeColor: '#22C55E',
    qualityIndicators: ['#22C55E']
  },
  {
    id: '6',
    name: 'Poulet fermier',
    price: '4500 FCFA',
    priceNumeric: 4500,
    oldPrice: '5000 FCFA',
    image: require('../assets/images/noix.png'),
    description: 'Poulet fermier élevé en plein air, viande tendre et savoureuse.',
    orderCount: 56,
    category: "Produits d'élevage",
    stock: 12,
    weight: '1.8 Kg',
    quality: 'Élevage Fermier Sans Antibiotiques',
    variety: 'Poulet bicyclette',
    details: [
      'Type : Poulet bicyclette',
      'Élevage : Plein air',
      'Alimentation : Grains naturels'
    ],
    seller: {
      name: 'Élevage Nkoulou',
      producer: 'Pierre Nkoulou',
      rating: 5
    },
    badge: 'A',
    badgeColor: '#22C55E',
    qualityIndicators: ['#22C55E', '#F59E0B']
  },
  {
    id: '7',
    name: 'Poisson frais (Carpe)',
    price: '3500 FCFA',
    priceNumeric: 3500,
    oldPrice: '4000 FCFA',
    image: require('../assets/images/pomme.png'),
    description: 'Carpe fraîche du jour, pêchée dans nos étangs locaux.',
    orderCount: 28,
    category: 'Produits halieutiques',
    stock: 8,
    weight: '1.5 Kg',
    quality: 'Pêche Locale Du Jour',
    variety: 'Carpe commune',
    details: [
      'Type : Carpe commune',
      'Fraîcheur : Pêché du jour',
      'Origine : Étangs locaux'
    ],
    seller: {
      name: 'Pêcherie Lac Municipal',
      producer: 'Coopérative Pêcheurs',
      rating: 4
    },
    badge: 'B',
    badgeColor: '#F59E0B',
    qualityIndicators: ['#F59E0B']
  },
  {
    id: '8',
    name: 'Piment rouge',
    price: '800 FCFA',
    priceNumeric: 800,
    oldPrice: '1000 FCFA',
    image: require('../assets/images/tomate.png'),
    description: 'Piment rouge fort, parfait pour relever vos plats.',
    orderCount: 92,
    category: 'Condiments et épices',
    stock: 60,
    weight: '200 g',
    quality: 'Production Locale Sans Traitement',
    variety: 'Piment fort',
    details: [
      'Variété : Piment fort local',
      'Intensité : Très piquant',
      'Usage : Sauces et assaisonnements'
    ],
    seller: {
      name: 'Épices Du Terroir',
      producer: 'Mama Fanta',
      rating: 5
    },
    badge: 'A',
    badgeColor: '#22C55E',
    qualityIndicators: ['#22C55E', '#F59E0B']
  },
  {
    id: '9',
    name: 'Huile de palme artisanale',
    price: '2000 FCFA',
    priceNumeric: 2000,
    oldPrice: '2500 FCFA',
    image: require('../assets/images/noix.png'),
    description: 'Huile de palme rouge artisanale, production traditionnelle.',
    orderCount: 73,
    category: 'Produits transformés',
    stock: 30,
    weight: '1 L',
    quality: 'Production Artisanale Traditionnelle',
    variety: 'Huile rouge pure',
    details: [
      'Type : Huile rouge 100% pure',
      'Production : Artisanale',
      'Conservation : 6 mois'
    ],
    seller: {
      name: 'Transformateurs Locaux',
      producer: 'Coopérative Femmes',
      rating: 5
    },
    badge: 'A',
    badgeColor: '#22C55E',
    qualityIndicators: ['#22C55E']
  },
  {
    id: '10',
    name: 'Farine de manioc',
    price: '1200 FCFA',
    priceNumeric: 1200,
    image: require('../assets/images/manioc.png'),
    description: 'Farine de manioc fine, idéale pour le couscous et autres plats.',
    orderCount: 41,
    category: 'Produits transformés',
    stock: 50,
    weight: '1 Kg',
    quality: 'Transformation Artisanale',
    variety: 'Farine fine',
    details: [
      'Type : Farine fine',
      'Usage : Couscous, pâtisserie',
      'Conservation : 3 mois au sec'
    ],
    seller: {
      name: 'Moulin Traditionnel',
      producer: 'Famille Essomba',
      rating: 4
    },
    badge: 'B',
    badgeColor: '#F59E0B',
    qualityIndicators: ['#F59E0B', '#F97316']
  }
];