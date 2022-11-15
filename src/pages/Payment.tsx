import { useQuery } from '@tanstack/react-query';
import { connectApi } from 'api';
import { Loading, NewPayment, PaidPayment } from 'components';
import { useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ApiError, Payment as PaymentType } from 'types';

export const Payment = () => {
  const navigate = useNavigate();
  const { paymentId } = useParams();

  useEffect(() => {
    if (!paymentId) {
      return navigate('/');
    }
  }, [paymentId, navigate]);

  const { isLoading, isError, data } = useQuery<PaymentType, ApiError>(
    ['payment'],
    () => connectApi({ endpoint: `payment/${paymentId}` })
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
    return <PaidPayment />;
  }

  return <Navigate to="/" />;
};
