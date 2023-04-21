import { FC } from 'react';
import { AppLayout } from '@cloudscape-design/components';
import Content from '@/components/Content';

const App: FC<{}> = () => {
  return <AppLayout navigationHide toolsHide content={<Content />} />;
};

export default App;
