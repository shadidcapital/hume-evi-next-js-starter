import React from 'react';
import { render } from '@testing-library/react';

// Error path: ensure toast.error is called when VoiceProvider triggers onError
vi.doMock('@humeai/voice-react', () => ({
  VoiceProvider: ({ onError, children }: any) => {
    if (onError) onError(new Error('Voice error'));
    return <>{children}</>;
  },
}));
vi.doMock('sonner', () => ({
  toast: { error: vi.fn() },
}));
vi.doMock('../components/Messages', () => ({
  default: () => <div data-testid="messages">Messages</div>,
}));
vi.doMock('../components/Controls', () => ({
  default: () => <div data-testid="controls">Controls</div>,
}));
vi.doMock('../components/StartCall', () => ({
  default: () => <div data-testid="start-call">StartCall</div>,
}));

describe('Chat error handling', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  test('calls toast.error on VoiceProvider error', () => {
    const ChatModule = require('../components/Chat').default as any;
    render(React.createElement(ChatModule, { accessToken: 'token' }));
    const { toast } = require('sonner');
    expect(toast.error).toHaveBeenCalledWith('Voice error');
  });
});
