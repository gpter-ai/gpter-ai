import { render, screen, fireEvent } from '@testing-library/react';
import ConfigModal from './ConfigModal';

describe('ConfigModal', () => {
  const onConfirm = jest.fn();

  const renderConfigModal = (): void => {
    const initValues = {};
    const visible = true;

    render(
      <ConfigModal
        visible={visible}
        onConfirm={onConfirm}
        initValues={initValues}
      />,
    );
  };

  const getApiKeyInput = (): HTMLInputElement =>
    screen.getByLabelText('Put your API key here.') as HTMLInputElement;

  const getMaxTokensInput = (): HTMLInputElement =>
    screen.getByLabelText(
      'Select the max amount of response tokens.',
    ) as HTMLInputElement;

  const getSaveButton = (): HTMLButtonElement =>
    screen.getByRole('button', {
      name: 'Save',
    }) as HTMLButtonElement;

  it('calls onConfirm with the correct values when Save button is clicked', () => {
    const apiKey = 'sk-alsmdlad98d32dj0239i1209e120pokd12p0osk0p12ksm192';
    const maxTokens = '100';
    renderConfigModal();

    const apiKeyInput = getApiKeyInput();
    const maxTokensInput = getMaxTokensInput();
    const saveButton = getSaveButton();

    fireEvent.change(apiKeyInput, { target: { value: apiKey } });
    fireEvent.change(maxTokensInput, { target: { value: maxTokens } });
    fireEvent.click(saveButton);

    expect(onConfirm).toHaveBeenCalledWith({
      apiKey,
      maxTokens: parseInt(maxTokens, 10),
    });
  });

  it('displays an error message when API key is empty', () => {
    const apiKey = '';
    const maxTokens = '100';
    renderConfigModal();

    const apiKeyInput = getApiKeyInput();
    const maxTokensInput = getMaxTokensInput();
    const saveButton = getSaveButton();

    fireEvent.change(apiKeyInput, { target: { value: apiKey } });
    fireEvent.change(maxTokensInput, { target: { value: maxTokens } });
    fireEvent.click(saveButton);

    expect(screen.getByText('Api Key is requried!')).not.toBeNull();
  });

  it('displays an error message when API key is wrong', () => {
    const apiKey = 'a wrong api key';
    const maxTokens = '100';
    renderConfigModal();

    const apiKeyInput = getApiKeyInput();
    const maxTokensInput = getMaxTokensInput();
    const saveButton = getSaveButton();

    fireEvent.change(apiKeyInput, { target: { value: apiKey } });
    fireEvent.change(maxTokensInput, { target: { value: maxTokens } });
    fireEvent.click(saveButton);

    expect(screen.findByText('Api Key is wrong!!')).not.toBeNull();
  });
});
