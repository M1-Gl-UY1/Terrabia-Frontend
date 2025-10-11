/**
 * Application React Native - Agriculture Commerce
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import AppNavigator from './src/navigation/AppNavigator';
import { store } from './src/store';
import { PaymentProvider } from './src/context/PaymentContext';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // Masquer le splash screen natif après 2 secondes
    const timer = setTimeout(() => {
      SplashScreen.hide();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Provider store={store}>
      <PaymentProvider>
        <SafeAreaProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </PaymentProvider>
    </Provider>
  );
}

export default App;