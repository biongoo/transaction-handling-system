import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

describe('App', () => {
  test('renders spinner while loading', () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    const labelElement = screen.getByTestId('spinner');
    expect(labelElement).toBeInTheDocument();
  });

  test('Contains more than 0 cards with car', async () => {
    const queryClient = new QueryClient();

    render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    );

    const buttons = await screen.findAllByText('Rent now!');

    expect(buttons.length).toBeGreaterThan(0);
  });
});
