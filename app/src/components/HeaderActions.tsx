import { Button, SpaceBetween, Toggle } from '@cloudscape-design/components';
import { FC, useEffect, useState } from 'react';

type Props = {
  setConfigModalVisible: (visible: boolean) => void;
  setHelpModalVisible: (visible: boolean) => void;
};

const HeaderActions: FC<Props> = ({
  setConfigModalVisible,
  setHelpModalVisible,
}) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('awsui-dark-mode');
    } else {
      document.body.classList.remove('awsui-dark-mode');
    }
  }, [darkMode]);

  return (
    <SpaceBetween direction="horizontal" size="xs">
      <Button onClick={() => setDarkMode((dm) => !dm)}>
        <Toggle checked={darkMode}>Dark mode</Toggle>
      </Button>
      <Button
        iconName="settings"
        onClick={(): void => {
          setConfigModalVisible(true);
        }}
      >
        Configure
      </Button>
      <Button
        iconName="status-info"
        onClick={(): void => {
          setHelpModalVisible(true);
        }}
      >
        Help
      </Button>
    </SpaceBetween>
  );
};

export default HeaderActions;
