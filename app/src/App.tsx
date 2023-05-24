import { FC, useEffect } from 'react';
import { AppLayout } from '@cloudscape-design/components';
import Content from '@/components/Content';
import './App.scss';
import { useStorageProvider } from '@/hooks/useStorageProvider';

const App: FC<object> = () => {
  const storageProvider = useStorageProvider();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).getUserConfig = () => storageProvider.getUserConfig();
  });

  return <AppLayout navigationHide toolsHide content={<Content />} />;
};

export default App;
