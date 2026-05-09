'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';
import CustomAlert from '@/components/CustomAlert';

interface AlertContextType {
  showAlert: (message: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<{ show: boolean; message: string }>({
    show: false,
    message: '',
  });

  const showAlert = (message: string) => {
    setAlert({ show: true, message });
  };

  const closeAlert = () => {
    setAlert({ show: false, message: '' });
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert.show && (
        <CustomAlert message={alert.message} onClose={closeAlert} />
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
