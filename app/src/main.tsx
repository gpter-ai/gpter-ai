import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import { WithProviders } from '@/components';
import { Content } from '@/components/Content';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WithProviders>
      <CssBaseline />
      <Content />
    </WithProviders>
  </React.StrictMode>,
);
