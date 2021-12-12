import { render, screen } from '@testing-library/react';
import App from './App';

test('render h1 element', () => {
  render(<App />);

  screen.debug();

  expect(screen.getByText('Hello World')).toBeInTheDocument();
});
