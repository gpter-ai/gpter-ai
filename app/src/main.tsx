import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@cloudscape-design/global-styles/index.css';
import { WithProviders } from '@/components';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <WithProviders>
    <App />
  </WithProviders>,
);
