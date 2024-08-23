import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../components/Auth/Login';
import { UserProvider } from '../context/UserContext';

test('renders login form', () => {
  render(
    <UserProvider>
      <Login />
    </UserProvider>
  );
  expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
});

test('shows error on empty form submission', () => {
  render(
    <UserProvider>
      <Login />
    </UserProvider>
  );
  fireEvent.click(screen.getByText(/Login/i));
  expect(screen.getByText(/Required/i)).toBeInTheDocument();
});
