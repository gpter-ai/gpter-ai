import { AppLayout } from '@cloudscape-design/components';
import { Content } from '@/components/Content';

function App() {
  return <AppLayout navigationHide toolsHide content={<Content />} />;
}

export default App;
