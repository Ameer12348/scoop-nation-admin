'use client';
import { store } from '@/store';
import { Provider } from 'react-redux';
import { ToastProvider } from './ToastProvider';
const Providers = ({children}) => {
  return (
   <Provider store={store}>
    <ToastProvider></ToastProvider>
    {children}
   </Provider>
  )
}

export default Providers