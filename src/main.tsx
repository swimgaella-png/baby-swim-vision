import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { LanguageProvider } from './i18n/LanguageContext';
import { persistenceService } from './services/persistenceService';
import './index.css';

// Sanitize local cache and verify data integrity before React mounts
persistenceService.autoSanitizeOnStartup();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>
);
