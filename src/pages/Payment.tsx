import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useParams, Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { getData } from 'api';
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

export const Payment = () => {
    const { paymentId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!paymentId) {
            return navigate('/');
        }
    }, [paymentId, navigate]);

    const { control, handleSubmit } = useForm<Inputs>({ mode: 'onTouched' });

    const { isLoading, isError, data } = useQuery<PaymentType, ApiError>(
        'payment',
        () => getData(`payment/${paymentId}`),
    );

    const onSubmit: SubmitHandler<Inputs> = data => {
        console.log(data);
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
                            spacing={1}
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
