import { FC } from 'react';
import { AppLayout } from '@cloudscape-design/components';
import Content from '@/components/Content';
import './App.scss';

const App: FC<object> = () => {
  return <AppLayout navigationHide toolsHide content={<Content />} />;
};

export default App;
