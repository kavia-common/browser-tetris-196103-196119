import { render, screen } from '@testing-library/react';
import App from './App';

test('renders tetris title', () => {
  render(<App />);
  const title = screen.getByText(/browser tetris/i);
  expect(title).toBeInTheDocument();
});
