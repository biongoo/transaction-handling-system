import { Payment } from 'types';
import { useQueryClient } from 'react-query';
import { Box } from '@mui/material';

export const PaidPayment = () => {
    const queryClient = useQueryClient();
    const payment = queryClient.getQueryData(['payment']) as Payment;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 3,
            }}
        >
            Congratulations! You rented {payment.carName}.
        </Box>
    );
};
