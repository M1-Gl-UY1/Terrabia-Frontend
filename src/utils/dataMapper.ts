/**
 * Adaptateur de données
 * Convertit les données du backend vers le format frontend et vice-versa
 */

import { Produit } from '../types/Backend';
import { Product } from '../types/Product';

/**
 * Image par défaut pour les produits sans photo
 */
const DEFAULT_PRODUCT_IMAGE = require('../assets/images/lot_fruits.png');

/**
 * Mappe un produit du backend vers le format frontend
 * @param produit - Produit du backend
 * @returns Product - Produit au format frontend
 */
export function mapProduitToProduct(produit: Produit): Product {
  return {
    id: produit.idProduit.toString(),
    name: produit.nom,
    price: `${produit.prix} FCFA`,
    priceNumeric: produit.prix,
    oldPrice: undefined, // Peut être calculé s'il y a une promotion
    image: produit.photoUrl ? { uri: produit.photoUrl } : DEFAULT_PRODUCT_IMAGE,
    imageUrl: produit.photoUrl || undefined,
    description: produit.description || 'Pas de description disponible',
    category: produit.categorie.nomCat,
    stock: produit.quantite,
    orderCount: 0, // Pas disponible dans le backend pour l'instant
    seller: {
      name: `${produit.vendeur.prenom} ${produit.vendeur.nom}`,
      producer: produit.vendeur.ville,
      rating: produit.vendeur.note || 0,
    },
  };
}

/**
 * Mappe une liste de produits du backend vers le format frontend
 * @param produits - Liste de produits du backend
 * @returns Product[] - Liste de produits au format frontend
 */
export function mapProduitsToProducts(produits: Produit[]): Product[] {
  return produits.map(mapProduitToProduct);
}

/**
 * Formatte un prix en FCFA
 * @param prix - Prix numérique
 * @returns Prix formaté avec FCFA
 */
export function formatPrice(prix: number): string {
  return `${prix.toLocaleString('fr-FR')} FCFA`;
}

/**
 * Calcule le montant total d'un panier
 * @param items - Items du panier avec quantité et prix
 * @returns Montant total
 */
export function calculateTotal(items: Array<{ quantite: number; prix: number }>): number {
  return items.reduce((total, item) => total + item.quantite * item.prix, 0);
}

/**
 * Formatte une date au format français
 * @param isoDate - Date au format ISO 8601
 * @returns Date formatée (ex: "8 déc. 2025")
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Formatte une heure au format français
 * @param isoDate - Date au format ISO 8601
 * @returns Heure formatée (ex: "15:30")
 */
export function formatTime(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
