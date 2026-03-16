import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from '@components/common';
import { QueryProvider } from '@providers/QueryProvider';
import '@config/env'; // Validate environment variables on startup
import './index.css';
import App from './App.tsx';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

// Configure native Android status bar
if (Capacitor.getPlatform() === 'android') {
  StatusBar.setStyle({ style: Style.Light });
  StatusBar.setBackgroundColor({ color: '#ffffff' });

  // On Android, the hardware back button will exit the app by default.
  // Hook it to React Router navigation so it navigates backward instead.
  CapacitorApp.addListener('backButton', () => {
    const canGoBack = window.history.state?.idx > 0 || window.history.length > 1;

    if (canGoBack) {
      window.history.back();
    } else {
      CapacitorApp.exitApp();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryProvider>
        <App />
      </QueryProvider>
    </ErrorBoundary>
  </StrictMode>,
);
