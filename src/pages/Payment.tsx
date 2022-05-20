import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Input, Loading } from 'components';
import { Payment as PaymentType, ApiError } from 'types';
import { getData } from 'api';
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
    name: string;
};

export const Payment = () => {
    const { paymentId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!paymentId) {
            return navigate('/');
        }
    }, [paymentId, navigate]);

    const { control, handleSubmit } = useForm<Inputs>({ mode: 'onTouched' });

    const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

    const { isLoading, isError /* data */ } = useQuery<PaymentType, ApiError>(
        'payment',
        () => getData(`payment/${paymentId}`),
    );

    useEffect(() => {
        if (isError) {
            return navigate('/');
        }
    }, [isError, navigate]);

    if (isLoading) {
        return <Loading />;
    }

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
                    /* subheader={`${car.name} - 1 Day - ${car.pricePerDay} PLN`} */
                />
                <CardContent>
                    <Stack spacing={2} direction="column">
                        <Stack
                            justifyContent="space-between"
                            spacing={2}
                            direction={{
                                xs: 'column',
                                md: 'row',
                            }}
                        >
                            <Input
                                name="card"
                                label="Card Number"
                                control={control}
                                onlyNumbers={true}
                                minLength={19}
                                maxLength={19}
                                defaultValue=""
                                sx={{ flexGrow: 1 }}
                                spacesBetween={true}
                            />
                            <Input
                                name="cvc"
                                label="CVC"
                                control={control}
                                onlyNumbers={true}
                                minLength={3}
                                maxLength={3}
                                defaultValue=""
                                sx={{
                                    maxWidth: {
                                        xs: 'none',
                                        md: 150,
                                    },
                                }}
                            />
                        </Stack>
                        <Input
                            name="name"
                            label="Cardholder Name"
                            control={control}
                            defaultValue=""
                            pattern={
                                /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/
                            }
                            fullWidth={true}
                        />
                    </Stack>
                </CardContent>
                <CardActions>
                    <Button type="submit">Order</Button>
                </CardActions>
            </Card>
        </Box>
    );
};
