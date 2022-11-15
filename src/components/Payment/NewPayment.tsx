import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { connectApi } from 'api';
import { Input } from 'components';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { ApiError, Payment } from 'types';

type Request = {
    card: number;
    cvc: number;
    mm: number;
    yy: number;
};

type Inputs = {
    card: string;
    cvc: string;
    mm: string;
    yy: string;
};

export const NewPayment = () => {
    const queryClient = useQueryClient();
    const [errorMessage, setErrorMessage] = useState('');

    const payment = queryClient.getQueryData(['payment']) as Payment;

    const { control, handleSubmit, setError } = useForm<Inputs>({
        mode: 'onTouched',
    });

    const { mutate } = useMutation<{ status: string }, ApiError, Request>(
        data =>
            connectApi({
                endpoint: `payment/${payment._id}`,
                method: 'PATCH',
                reqData: data,
            }),
        {
            onMutate: () => {
                setErrorMessage('');
            },
            onSuccess: ({ status }) => {
                if (status === 'ok') {
                    queryClient.invalidateQueries({ queryKey: ['payment'] });
                }
            },
            onError: apiError => {
                if (apiError.inputName) {
                    setError(apiError.inputName as keyof Inputs, {});
                }

                setErrorMessage(apiError.message);
            },
        },
    );

    const onSubmit: SubmitHandler<Inputs> = submitData => {
        if (!payment) {
            return;
        }

        const { cvc, mm, yy } = submitData;
        const card = +submitData.card.split(' ').join('');

        const now = new Date();
        const yearFromYY = +`20${yy}`;
        const parsedMM = parseInt(mm, 10);

        if (
            now.getFullYear() > yearFromYY ||
            (now.getFullYear() === yearFromYY && now.getMonth() + 1 >= parsedMM)
        ) {
            setErrorMessage('Your card is expired!');
            return;
        }

        mutate({
            card,
            cvc: +cvc,
            mm: parsedMM,
            yy: yearFromYY,
        });
    };

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
                    title={`Transaction with id: ${payment._id}`}
                    subheader={`${payment.carName} - ${payment.days} days - ${payment.value} PLN`}
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
                                label="Month Shortcut (MM)"
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
                                label="Year Shortcut (YY)"
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
