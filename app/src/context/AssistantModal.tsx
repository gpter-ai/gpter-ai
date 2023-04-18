import { ReactNode, createContext, useContext, useMemo, useState } from 'react';
import AssistantModal, {
  Props as AssistantModalProps,
} from '@/components/AssistantModal';
import { Nullable } from '@/types';
import { AssistantFormFields } from '@/data/types';

type OpenModalProps = Pick<AssistantModalProps, 'onSubmit'>;

type AssistantModalContextValue = {
  openModal: (props: OpenModalProps) => void;
};

type AssistantModalProviderProps = {
  children: ReactNode;
};

const AssistantModalContext =
  createContext<Nullable<AssistantModalContextValue>>(null);

const AssistantModalProvider = ({ children }: AssistantModalProviderProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [onModalSubmit, setOnModalSubmit] = useState<
    AssistantModalProps['onSubmit']
  >(() => {});

  const openModal = ({ onSubmit }: OpenModalProps) => {
    setOnModalSubmit(() => (props: AssistantFormFields) => onSubmit(props));
    setVisible(true);
  };

  const value = useMemo(
    () => ({
      openModal,
    }),
    [],
  );

  return (
    <>
      <AssistantModalContext.Provider value={value}>
        {children}
      </AssistantModalContext.Provider>
      <AssistantModal
        visible={visible}
        setVisible={setVisible}
        onSubmit={onModalSubmit}
      />
    </>
  );
};

export const useAssistantModal = () => useContext(AssistantModalContext);

export default AssistantModalProvider;
