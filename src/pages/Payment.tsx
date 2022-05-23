import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { connectApi } from 'api';
import { Loading, PaidPayment } from 'components';
import { NewPayment } from 'components';
import { Payment as PaymentType, ApiError } from 'types';




export const Payment = () => {
    const navigate = useNavigate();
    const { paymentId } = useParams();
    
    useEffect(() => {
        if (!paymentId) {
            return navigate('/');
        }
    }, [paymentId, navigate]);

    const { isLoading, isError, data } = useQuery<PaymentType, ApiError>(
        'payment',
        () => connectApi({ endpoint: `payment/${paymentId}` }),
    );

    useEffect(() => {
        if (isError) {
            return navigate('/');
        }
    }, [isError, navigate]);

    if (isLoading) {
        return <Loading />;
    }

    if (data?.status === 'new') {
        return <NewPayment />;
    }

    if (data?.status === 'paid') {
        return <PaidPayment />
    }

    return <Navigate to="/" />;
};
