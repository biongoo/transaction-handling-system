import { Payment } from 'types';
import { useQueryClient } from 'react-query';


export const PaidPayment = () => {
    const queryClient = useQueryClient();
    const payment = queryClient.getQueryData(["payment"]) as Payment;

    return <h2>{payment.carName}</h2>;
};
