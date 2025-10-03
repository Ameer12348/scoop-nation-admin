'use client';
import { store } from '@/store';
import { Provider } from 'react-redux';
import { ToastProvider } from './ToastProvider';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Providers = ({children}) => {
  const queryClient = new QueryClient();
  return (
   <Provider store={store}>
    <ToastProvider></ToastProvider>
    <QueryClientProvider client={queryClient}>

    {children}
    </QueryClientProvider>
   </Provider>
  )
}

export default Providers