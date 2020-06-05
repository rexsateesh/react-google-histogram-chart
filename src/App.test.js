import React from 'react';
import { render, fireEvent, waitFor, screen, waitForElement } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/VdoCipher/i);
  expect(linkElement).toBeInTheDocument();
});

test('loads and generate report', async () => {
  const { getByText, queryByLabelText } = render(<App />);
  const button = getByText(/Generate Report/i);

  button.click();

  const wordsCountLabel = await waitForElement(() => screen.getByText(/Words Count Report/i));
  const postLabel = await waitForElement(() => screen.getByText(/Posts/i));
  const pageLabel = await waitForElement(() => screen.getByText(/Pages/i));

  expect(wordsCountLabel.textContent).toEqual('Words Count Report');
  expect(postLabel.textContent).toEqual('Posts');
  expect(pageLabel.textContent).toEqual('Pages');
})