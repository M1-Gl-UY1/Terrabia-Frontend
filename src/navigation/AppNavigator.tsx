import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, LayoutGrid, ShoppingCart, User } from 'lucide-react-native';
import { NavigatorScreenParams } from '@react-navigation/native';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import OnboardingScreen2 from '../screens/Onboarding/OnboardingScreen2';
import OnboardingScreen3 from '../screens/Onboarding/OnboardingScreen3';
import OnboardingScreen4 from '../screens/Onboarding/OnboardingScreen4';
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
import { Product } from '../types/Product';
import { PaymentMethod } from '../types/Payment';

export type MainTabParamList = {
  Home: undefined;
  Categories: undefined;
  Cart: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;
  Onboarding4: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Search: undefined;
  Notifications: undefined;
  DetailProduct: { product: Product };
  Checkout: undefined;
  MobileMoneyPayment: { amount: number; paymentMethod: 'orange' | 'momo' };
  CardPayment: { amount: number };
  PaymentProcessing: { 
    amount: number; 
    paymentMethod: 'orange' | 'momo'; 
    phoneNumber: string;
  };
  PaymentSuccess: {
    amount: number;
    paymentMethod: PaymentMethod;
    phoneNumber?: string;
    orderId: string;
  };
  OrderDetails: { orderId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabNavigator() {
  return (
    <Tab.Navigator
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
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Accueil' }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ tabBarLabel: 'Catégories' }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ tabBarLabel: 'Panier' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profil' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Onboarding2" component={OnboardingScreen2} />
      <Stack.Screen name="Onboarding3" component={OnboardingScreen3} />
      <Stack.Screen name="Onboarding4" component={OnboardingScreen4} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Notifications" component={NotifScreen} />
      <Stack.Screen name="DetailProduct" component={DetailProductScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="MobileMoneyPayment" component={MobileMoneyPaymentScreen} />
      <Stack.Screen name="PaymentProcessing" component={PaymentProcessingScreen} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
    </Stack.Navigator>
  );
} '@react-navigation/native-stack';

export type OnboardingStackParamList = {
  Onboarding: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;
  Onboarding4: undefined;
};
