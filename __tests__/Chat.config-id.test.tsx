import React from 'react';
import { render, screen } from '@testing-library/react';

// This test verifies that NEXT_PUBLIC_HUME_CONFIG_ID env var is read by Chat.tsx
// and passed down to StartCall as the configId prop.

vi.resetModules();
process.env.NEXT_PUBLIC_HUME_CONFIG_ID = 'test-config';

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
    <div data-testid="start-call" data-configid={props.configId}>StartCall</div>
  ),
}));
vi.mock('sonner', () => ({
  toast: { error: () => {} },
}));

describe('Chat component configId propagation', () => {
  test('passes NEXT_PUBLIC_HUME_CONFIG_ID to StartCall as configId', () => {
    // Re-require after mocks to ensure fresh module instances
    const ChatModule = require('../components/Chat').default;
    render(<ChatModule accessToken="token-xyz" />);

    const startCall = screen.getByTestId('start-call');
    expect(startCall).toBeInTheDocument();
    expect(startCall.getAttribute('data-configid')).toBe('test-config');
  });
});
