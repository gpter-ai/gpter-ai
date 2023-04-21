import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import AssistantModal, {
  Props as AssistantModalProps,
} from '@/components/AssistantModal';
import { AssistantFormFields } from '@/data/types';

type OpenModalProps = Pick<AssistantModalProps, 'onSubmit'> &
  Partial<Pick<AssistantModalProps, 'initData'>>;

type AssistantModalContextValue = {
  openModal: (props: OpenModalProps) => void;
};

type AssistantModalProviderProps = {
  children: ReactNode;
};

const AssistantModalContext = createContext<AssistantModalContextValue>(
  {} as AssistantModalContextValue,
);

const AssistantModalProvider: FC<AssistantModalProviderProps> = ({
  children,
}) => {
  const emptyFormData = useMemo(
    () => ({
      name: '',
      prompt: '',
    }),
    [],
  );

  const [visible, setVisible] = useState<boolean>(false);
  const [initModalData, setInitModalData] =
    useState<AssistantFormFields>(emptyFormData);
  const [onModalSubmit, setOnModalSubmit] = useState<
    AssistantModalProps['onSubmit']
  >(() => {});

  const openModal = useCallback(
    ({ onSubmit, initData }: OpenModalProps): void => {
      setOnModalSubmit(() => (props: AssistantFormFields) => onSubmit(props));
      setInitModalData(initData ?? emptyFormData);

      setVisible(true);
    },
    [emptyFormData],
  );

  const value = useMemo(
    () => ({
      openModal,
    }),
    [openModal],
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

export const useAssistantModal = (): AssistantModalContextValue =>
  useContext(AssistantModalContext);

export default AssistantModalProvider;
