import { AppLayout } from '@cloudscape-design/components';
import Content from '@/components/Content';

const App = () => {
  return <AppLayout navigationHide toolsHide content={<Content />} />;
};

export default App;
