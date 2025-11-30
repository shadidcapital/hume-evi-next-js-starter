import React from 'react';
import { render, screen } from '@testing-library/react';
import Chat from '../components/Chat';

// Basic rendering tests with mocked subcomponents and VoiceProvider
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
  default: () => <div data-testid="start-call">StartCall</div>,
}));
vi.mock('sonner', () => ({
  toast: { error: () => {} },
}));

describe('Chat component', () => {
  beforeEach(() => {
    vi.resetModules();
    // Re-require after mocks to ensure fresh module instances
  });

  test('renders Messages, Controls, and StartCall components', () => {
    const ChatModule = require('../components/Chat').default;
    render(<ChatModule accessToken="test-token" />);
    expect(screen.getByTestId('voice-provider')).toBeInTheDocument();
    expect(screen.getByTestId('messages')).toBeInTheDocument();
    expect(screen.getByTestId('controls')).toBeInTheDocument();
    expect(screen.getByTestId('start-call')).toBeInTheDocument();
  });
});
