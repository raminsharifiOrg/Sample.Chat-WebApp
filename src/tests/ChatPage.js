import { render, screen } from '@testing-library/react';
import ChatPage from '../pages/ChatPage';
import { UserProvider } from '../context/UserContext';

test('renders chat page with no selected user', () => {
  render(
    <UserProvider>
      <ChatPage />
    </UserProvider>
  );
  expect(screen.getByText(/Select a user to start chatting/i)).toBeInTheDocument();
});
