import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/router';
import { AppSettingsProvider } from './shared/providers/AppSettingsProvider';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppSettingsProvider>
      <RouterProvider router={router} />
    </AppSettingsProvider>
  </StrictMode>
);
