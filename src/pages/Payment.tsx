import { useEffect, useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useParams, Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { connectApi } from 'api';
import { Input, Loading } from 'components';
import { Payment as PaymentType, ApiError } from 'types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

type Inputs = {
    card: string;
    cvc: string;
    mm: string;
    yy: string;
};

type Data = {
    orderId: string;
    card: number;
    cvc: number;
    mm: number;
    yy: number;
};

export const Payment = () => {
    const { paymentId } = useParams();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!paymentId) {
            return navigate('/');
        }
    }, [paymentId, navigate]);

    const { control, handleSubmit, setError } = useForm<Inputs>({
        mode: 'onTouched',
    });

    const { isLoading, isError, data } = useQuery<PaymentType, ApiError>(
        'payment',
        () => connectApi({ endpoint: `payment/${paymentId}` }),
    );

    console.log(data);

    const payment = useMutation<
        { status: boolean; paymentId: string },
        ApiError,
        Data
    >(newOrder => connectApi({ endpoint: 'order', reqData: newOrder }), {
        onMutate: () => {
            setErrorMessage('');
        },
        onSuccess: ({ paymentId }) => {
            return navigate(`/payment/${paymentId}/status`);
        },
        onError: apiError => {
            if (apiError.inputName) {
                setError(apiError.inputName as keyof Inputs, {});
            }

            setErrorMessage(apiError.message);
        },
    });

    const onSubmit: SubmitHandler<Inputs> = submitData => {
        const card = +submitData.card.split(' ').join('');

        if (!data?._id) {
            return;
        }

        payment.mutate({
            orderId: data._id,
            card,
            cvc: +submitData.cvc,
            mm: +submitData.mm,
            yy: +submitData.yy,
        });
    };

    useEffect(() => {
        if (isError) {
            return navigate('/');
        }
    }, [isError, navigate]);

    if (isLoading) {
        return <Loading />;
    }

    if (!data) {
        return null;
    }

    const errorContent = errorMessage ? (
        <Box mt={4} sx={{ color: '#f44336' }}>
            Error: {errorMessage}
        </Box>
    ) : null;

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            p={3}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            autoComplete="off"
        >
            <Card sx={{ minWidth: 275, width: '70%' }}>
                <CardHeader
                    title="Payment details"
                    subheader={`${data.carName} - ${data.days} days - ${data.value} PLN`}
                />
                <CardContent>
                    <Stack spacing={2} direction="column">
                        <Input
                            name="card"
                            label="Card Number"
                            control={control}
                            onlyNumbers={true}
                            minLength={19}
                            maxLength={19}
                            defaultValue=""
                            spacesBetween={true}
                        />
                        <Stack
                            justifyContent="space-between"
                            spacing={2}
                            direction={{
                                xs: 'column',
                                md: 'row',
                            }}
                        >
                            <Input
                                name="mm"
                                label="Month Shortcut"
                                control={control}
                                onlyNumbers={true}
                                minLength={2}
                                maxLength={2}
                                defaultValue=""
                                sx={{ flexGrow: 1 }}
                                pattern={/0[1-9]|1[0-2]/}
                            />
                            <Input
                                name="yy"
                                label="Year Shortcut"
                                control={control}
                                onlyNumbers={true}
                                minLength={2}
                                maxLength={2}
                                defaultValue=""
                                sx={{ flexGrow: 1 }}
                                pattern={/^(0?[1-9]|[1-9][0-9])$/}
                            />
                            <Input
                                name="cvc"
                                label="CVC"
                                control={control}
                                onlyNumbers={true}
                                minLength={3}
                                maxLength={3}
                                defaultValue=""
                                sx={{ flexGrow: 1 }}
                            />
                        </Stack>
                        {errorContent}
                    </Stack>
                </CardContent>
                <CardActions>
                    <Button component={Link} to="/">
                        Back
                    </Button>
                    <Button type="submit">Order</Button>
                </CardActions>
            </Card>
        </Box>
    );
};
