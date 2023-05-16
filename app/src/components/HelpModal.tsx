import {
  Box,
  Button,
  Icon,
  Modal,
  SpaceBetween,
} from '@cloudscape-design/components';
import { FC } from 'react';

type Props = {
  visible: boolean;
  setVisible: (value: boolean) => void;
};

const HelpModal: FC<Props> = ({ visible, setVisible }) => {
  return (
    <Modal
      visible={visible}
      closeAriaLabel="Close modal"
      size="medium"
      onDismiss={() => setVisible(false)}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button onClick={() => setVisible(false)} variant="link">
              Close
            </Button>
          </SpaceBetween>
        </Box>
      }
      header="Frequently Asked Questions"
    >
      <h3>Why do I need an API key?</h3>
      <p>
        As any application using OpenAI under the hood - GPTer needs a key to
        communicate with OpenAI on your behalf.
      </p>
      <h3>How can I get an API key?</h3>
      <ol>
        <li>
          Go to{' '}
          <a
            target="_blank"
            href="https://platform.openai.com/account/api-keys"
            rel="noreferrer"
          >
            OpenAI page
          </a>
        </li>
        <li>Create an account with OpenAI if you have not done it already.</li>
        <li>
          Press <i>Create new secret key</i>. Choose a name for it and click{' '}
          <i>Create</i>
        </li>
        <li>
          Copy your key into our application. Preferably also copy it to some
          safe place. Remember - we do not store your key anywhere but on your
          device.
        </li>
      </ol>
      <p>
        You can create new keys anytime following the procedure above. This is
        for free.
      </p>
      <h3>Can my key leak?</h3>
      <p>
        No, your key stays stored on your computer. It only gets sent to OpenAI
        with every request you make.
      </p>
      <h3>How expensive is using your service?</h3>
      <p>
        We do not charge you any fees. However, the requests you send actually
        go to an OpenAI model and you need to pay to OpenAI for tokens you send
        and receive. Check the exact price at their{' '}
        <a target="_blank" href="https://openai.com/pricing" rel="noreferrer">
          {' '}
          pricing page <Icon name="external" size="small" />
        </a>
        .
      </p>
      <p>
        We use the chat model called <b>gpt-3.5-turbo.</b>
      </p>
      {/* <div>
        <h3>
          Learn more <Icon name="external" />
        </h3>
        <ul>
          <li>
            <a href="https://openai.com/pricing">OpenAI Pricing</a>
          </li>
          <li>
            <a href="">Link to documentation</a>
          </li>
        </ul>
      </div> */}
    </Modal>
  );
};

export default HelpModal;
