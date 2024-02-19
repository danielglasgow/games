import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { newRandomBoard } from './board/state';

test('renders learn react link', () => {
  render(<App layout={newRandomBoard()} />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
