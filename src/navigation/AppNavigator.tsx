import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, LayoutGrid, ShoppingCart, User, Package, ClipboardList, BarChart3 } from 'lucide-react-native';
import { NavigatorScreenParams } from '@react-navigation/native';

// Screens - Splash & Onboarding
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import OnboardingScreen2 from '../screens/Onboarding/OnboardingScreen2';
import OnboardingScreen3 from '../screens/Onboarding/OnboardingScreen3';
import OnboardingScreen4 from '../screens/Onboarding/OnboardingScreen4';
import OnboardingInitialScreen from '../screens/Onboarding/OnboardingInitialScreen';

// Screens - Buyer (Acheteur)
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotifScreen from '../screens/NotifScreen';
import DetailProductScreen from '../screens/DetailProductScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import MobileMoneyPaymentScreen from '../screens/MobileMoneyPaymentScreen';
import PaymentProcessingScreen from '../screens/PaymentProcessingScreen';
import PaymentSuccessScreen from '../screens/PaymentSuccessScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import CardPaymentScreen from '../screens/CardPaymentScreen';

// Screens - Registration
import LoginScreen from '../screens/Registration/LoginScreen';
import SignUpScreen from '../screens/Registration/SignUpScreen';
import UserTypeSelectionScreen from '../screens/Registration/UserTypeSelectionScreen';
import ProducerLoginScreen from '../screens/Registration/ProducerLoginScreen';
import ProducerSignUpScreen from '../screens/Registration/ProducerSignUpScreen';

// Screens - Producer (Producteur)
import {
  ProducerDashboardScreen,
  ProducerProductsScreen,
  ProducerOrdersScreen,
  ProducerProfileScreen,
  AddProductScreen,
  ProducerOrderDetailScreen,
} from '../screens/Producer';

// Types
import { Product } from '../types/Product';
import { PaymentMethod } from '../types/Payment';
import { Commande, Produit } from '../types/Backend';

// ============================================
// TYPE DEFINITIONS
// ============================================

export type MainTabParamList = {
  Home: undefined;
  Categories: undefined;
  Cart: undefined;
  Profile: undefined;
};

export type ProducerTabParamList = {
  ProducerDashboard: undefined;
  ProducerProducts: undefined;
  ProducerOrders: undefined;
  ProducerProfile: undefined;
};

export type RootStackParamList = {
  // Splash & Onboarding
  Splash: undefined;
  OnboardingInitialScreen: undefined;
  Onboarding: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;
  Onboarding4: undefined;

  // User Type Selection
  UserTypeSelection: undefined;

  // Buyer Auth
  Login: undefined;
  SignUp: undefined;

  // Producer Auth
  ProducerLogin: undefined;
  ProducerSignUp: undefined;

  // Main Navigation
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  ProducerTabs: NavigatorScreenParams<ProducerTabParamList> | undefined;

  // Buyer Screens
  Search: undefined;
  Notifications: undefined;
  DetailProduct: { product: Product };
  Checkout: undefined;
  MobileMoneyPayment: { amount: number; paymentMethod: 'orange' | 'momo'; orderId: number };
  CardPayment: { amount: number; orderId: number };
  PaymentProcessing: {
    amount: number;
    paymentMethod: 'orange' | 'momo';
    phoneNumber: string;
    orderId: number;
  };
  PaymentSuccess: {
    amount: number;
    paymentMethod: PaymentMethod;
    phoneNumber?: string;
    orderId: number;
  };
  OrderDetails: { orderId: number };
  OrderHistory: undefined;

  // Producer Screens
  AddProduct: undefined;
  EditProduct: { product: Produit };
  ProducerNotifications: undefined;
  ProducerOrderDetail: { order: Commande };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const BuyerTab = createBottomTabNavigator<MainTabParamList>();
const ProducerTab = createBottomTabNavigator<ProducerTabParamList>();

// ============================================
// BUYER TAB NAVIGATOR
// ============================================

function MainTabNavigator() {
  return (
    <BuyerTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
          if (route.name === 'Home') {
            return <Home size={size} color={color} strokeWidth={focused ? 2.5 : 1.5} />;
          } else if (route.name === 'Categories') {
            return <LayoutGrid size={size} color={color} strokeWidth={focused ? 2.5 : 1.5} />;
          } else if (route.name === 'Cart') {
            return <ShoppingCart size={size} color={color} strokeWidth={focused ? 2.5 : 1.5} />;
          } else if (route.name === 'Profile') {
            return <User size={size} color={color} strokeWidth={focused ? 2.5 : 1.5} />;
          }
          return null;
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '700',
          fontFamily: 'sans-serif',
        },
        tabBarActiveTintColor: '#F27A22',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 64,
          paddingBottom: 8,
        },
      })}
    >
      <BuyerTab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Accueil' }}
      />
      <BuyerTab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ tabBarLabel: 'Catégories' }}
      />
      <BuyerTab.Screen
        name="Cart"
        component={CartScreen}
        options={{ tabBarLabel: 'Panier' }}
      />
      <BuyerTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profil' }}
      />
    </BuyerTab.Navigator>
  );
}

// ============================================
// PRODUCER TAB NAVIGATOR
// ============================================

function ProducerTabNavigator() {
  return (
    <ProducerTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
          if (route.name === 'ProducerDashboard') {
            return <BarChart3 size={size} color={color} strokeWidth={focused ? 2.5 : 1.5} />;
          } else if (route.name === 'ProducerProducts') {
            return <Package size={size} color={color} strokeWidth={focused ? 2.5 : 1.5} />;
          } else if (route.name === 'ProducerOrders') {
            return <ClipboardList size={size} color={color} strokeWidth={focused ? 2.5 : 1.5} />;
          } else if (route.name === 'ProducerProfile') {
            return <User size={size} color={color} strokeWidth={focused ? 2.5 : 1.5} />;
          }
          return null;
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          fontFamily: 'sans-serif',
        },
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 64,
          paddingBottom: 8,
        },
      })}
    >
      <ProducerTab.Screen
        name="ProducerDashboard"
        component={ProducerDashboardScreen}
        options={{ tabBarLabel: 'Dashboard' }}
      />
      <ProducerTab.Screen
        name="ProducerProducts"
        component={ProducerProductsScreen}
        options={{ tabBarLabel: 'Produits' }}
      />
      <ProducerTab.Screen
        name="ProducerOrders"
        component={ProducerOrdersScreen}
        options={{ tabBarLabel: 'Commandes' }}
      />
      <ProducerTab.Screen
        name="ProducerProfile"
        component={ProducerProfileScreen}
        options={{ tabBarLabel: 'Profil' }}
      />
    </ProducerTab.Navigator>
  );
}

// ============================================
// MAIN APP NAVIGATOR
// ============================================

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Splash"
    >
      {/* Écran de démarrage */}
      <Stack.Screen name="Splash" component={SplashScreen} />

      {/* Écrans d'onboarding */}
      <Stack.Screen name="OnboardingInitialScreen" component={OnboardingInitialScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Onboarding2" component={OnboardingScreen2} />
      <Stack.Screen name="Onboarding3" component={OnboardingScreen3} />
      <Stack.Screen name="Onboarding4" component={OnboardingScreen4} />

      {/* Sélection du type d'utilisateur */}
      <Stack.Screen name="UserTypeSelection" component={UserTypeSelectionScreen} />

      {/* Authentification Acheteur */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />

      {/* Authentification Producteur */}
      <Stack.Screen name="ProducerLogin" component={ProducerLoginScreen} />
      <Stack.Screen name="ProducerSignUp" component={ProducerSignUpScreen} />

      {/* Navigation principale Acheteur */}
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Notifications" component={NotifScreen} />
      <Stack.Screen name="DetailProduct" component={DetailProductScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="MobileMoneyPayment" component={MobileMoneyPaymentScreen} />
      <Stack.Screen name="CardPayment" component={CardPaymentScreen} />
      <Stack.Screen name="PaymentProcessing" component={PaymentProcessingScreen} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
      <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailScreen} />

      {/* Navigation principale Producteur */}
      <Stack.Screen name="ProducerTabs" component={ProducerTabNavigator} />
      <Stack.Screen name="AddProduct" component={AddProductScreen} />
      <Stack.Screen name="EditProduct" component={AddProductScreen} />
      <Stack.Screen name="ProducerNotifications" component={NotifScreen} />
      <Stack.Screen name="ProducerOrderDetail" component={ProducerOrderDetailScreen} />
    </Stack.Navigator>
  );
}

// ============================================
// ADDITIONAL TYPE EXPORTS
// ============================================

export type OnboardingStackParamList = {
  Onboarding: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;
  Onboarding4: undefined;
};
