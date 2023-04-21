import {
  Box,
  Button,
  Modal,
  SpaceBetween,
} from '@cloudscape-design/components';
import { FC } from 'react';

type Props = {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  text: string;
  header: string;
};

const DangerModal: FC<Props> = ({
  visible,
  onConfirm,
  onCancel,
  text,
  header,
}) => {
  return (
    <Modal
      visible={visible}
      closeAriaLabel="Close modal"
      size="small"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button onClick={onCancel} variant="link">
              Cancel
            </Button>
            <Button onClick={onConfirm} variant="primary">
              Confirm
            </Button>
          </SpaceBetween>
        </Box>
      }
      header={header}
    >
      {text}
    </Modal>
  );
};

export default DangerModal;
