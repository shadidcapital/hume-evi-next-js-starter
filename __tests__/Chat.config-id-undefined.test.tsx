import React from 'react';
import { render, screen } from '@testing-library/react';

// Ensure NEXT_PUBLIC_HUME_CONFIG_ID is undefined and not passed to StartCall

vi.resetModules();
delete process.env.NEXT_PUBLIC_HUME_CONFIG_ID;

vi.mock('@humeai/voice-react', () => ({
  VoiceProvider: ({ children }: any) => <div data-testid="voice-provider">{children}</div>,
}));
vi.mock('../components/Messages', () => ({
  default: () => <div data-testid="messages">Messages</div>,
}));
vi.mock('../components/Controls', () => ({
  default: () => <div data-testid="controls">Controls</div>,
}));
vi.mock('../components/StartCall', () => ({
  default: (props: any) => (
    <div data-testid="start-call" {...(props.configId !== undefined ? { 'data-configid': props.configId } : {})}>StartCall</div>
  ),
}));
vi.mock('sonner', () => ({
  toast: { error: () => {} },
}));

describe('Chat component configId undefined propagation', () => {
  test('does not pass a configId when NEXT_PUBLIC_HUME_CONFIG_ID is undefined', () => {
    // Re-require after mocks to ensure fresh module instances
    const ChatModule = require('../components/Chat').default;
    render(<ChatModule accessToken="token-undefined" />);

    const startCall = screen.getByTestId('start-call');
    expect(startCall).toBeInTheDocument();
    expect(startCall.getAttribute('data-configid')).toBeNull();
  });
});
