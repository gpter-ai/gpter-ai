import { ReactNode, createContext, useContext, useMemo, useState } from 'react';
import AssistantModal, {
  Props as AssistantModalProps,
} from '@/components/AssistantModal';
import { Nullable } from '@/types';
import { AssistantFormFields } from '@/data/types';

type OpenModalProps = Pick<AssistantModalProps, 'onSubmit'> &
  Partial<Pick<AssistantModalProps, 'initData'>>;

type AssistantModalContextValue = {
  openModal: (props: OpenModalProps) => void;
};

type AssistantModalProviderProps = {
  children: ReactNode;
};

const AssistantModalContext =
  createContext<Nullable<AssistantModalContextValue>>(null);

const AssistantModalProvider = ({ children }: AssistantModalProviderProps) => {
  const emptyFormData = {
    name: '',
    prompt: '',
  };

  const [visible, setVisible] = useState<boolean>(false);
  const [initModalData, setInitModalData] =
    useState<AssistantFormFields>(emptyFormData);
  const [onModalSubmit, setOnModalSubmit] = useState<
    AssistantModalProps['onSubmit']
  >(() => {});

  const openModal = ({ onSubmit, initData }: OpenModalProps) => {
    setOnModalSubmit(() => (props: AssistantFormFields) => onSubmit(props));
    setInitModalData(initData ?? emptyFormData);

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
        initData={initModalData}
      />
    </>
  );
};

export const useAssistantModal = () => useContext(AssistantModalContext);

export default AssistantModalProvider;
