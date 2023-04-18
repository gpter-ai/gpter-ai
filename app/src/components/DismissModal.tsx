import {
  Box,
  Button,
  Modal,
  SpaceBetween,
} from '@cloudscape-design/components';

type Props = {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const DismissModal = ({ visible, onConfirm, onCancel }: Props) => {
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
              Ok
            </Button>
          </SpaceBetween>
        </Box>
      }
      header="Attention!"
    >
      You are about to close the creator! All unsaved changes will be lost!
    </Modal>
  );
};

export default DismissModal;
