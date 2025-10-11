import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PaymentMethod, PaymentState } from '../types/Payment';

interface PaymentContextType extends PaymentState {
  setSelectedMethod: (method: PaymentMethod | null) => void;
  setIsProcessing: (processing: boolean) => void;
  setError: (error: string | null) => void;
  resetPayment: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetPayment = () => {
    setSelectedMethod(null);
    setIsProcessing(false);
    setError(null);
  };

  return (
    <PaymentContext.Provider
      value={{
        selectedMethod,
        isProcessing,
        error,
        setSelectedMethod,
        setIsProcessing,
        setError,
        resetPayment,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};