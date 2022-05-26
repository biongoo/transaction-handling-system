import { render, screen } from '@testing-library/react';
import { Loading } from './Loading';

describe('Loading', () => {
    test('renders spinner', () => {
        render(<Loading />);

        const labelElement = screen.getByTestId('spinner');
        expect(labelElement).toBeInTheDocument();
    });
});
