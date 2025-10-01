'use client';

import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster 
      position="top-center"
      toastOptions={{
        style: {
          background: 'white',
          color: '#07448A',
          fontSize:'20px'
        },
        duration: 3000,
        
      }}
      closeButton
    />
  );
}