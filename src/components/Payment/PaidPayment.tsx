import { Box } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Payment } from 'types';

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
      Congratulations! Your transaction with id `&quot;`{payment._id}`&quot;`
      was paid. You rented {payment.carName}.
    </Box>
  );
};
