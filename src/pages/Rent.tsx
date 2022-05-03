import { useEffect, useState } from 'react';
import { Car } from '../types';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

type Inputs = {
    card: string;
    cvc: string;
    name: string;
};

const allowOnlyNumber = (value: string) => {
    return value.replace(/[^0-9]/g, '');
};

export const Rent = ({ cars }: { cars: Car[] }) => {
    const { carId } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState<Car>();

    const { control, handleSubmit } = useForm<Inputs>({ mode: 'onTouched' });

    const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

    useEffect(() => {
        if (!carId) {
            return navigate('/');
        }

        const car = cars.find(car => car.id === +carId);

        if (!car) {
            return navigate('/');
        }

        setCar(car);
    }, [cars, carId, navigate]);

    if (!car) {
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
                    subheader={`${car.name} - 1 Day - ${car.pricePerDay} PLN`}
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
                            <Controller
                                name="card"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: true,
                                    minLength: 19,
                                    maxLength: 19,
                                }}
                                render={({ field, fieldState: { error } }) => {
                                    return (
                                        <TextField
                                            sx={{ flexGrow: 1 }}
                                            {...field}
                                            id={field.name}
                                            label="Card Number"
                                            error={Boolean(error)}
                                            helperText={
                                                Boolean(error) &&
                                                'Card number is invalid'
                                            }
                                            onChange={x => {
                                                if (
                                                    x.target.value.length > 19
                                                ) {
                                                    return;
                                                }

                                                return field.onChange(
                                                    allowOnlyNumber(
                                                        x.target.value
                                                    )
                                                        .replace(
                                                            /(.{4})/g,
                                                            '$1 '
                                                        )
                                                        .trim()
                                                );
                                            }}
                                        />
                                    );
                                }}
                            />
                            <Controller
                                name="cvc"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: true,
                                    minLength: 3,
                                    maxLength: 3,
                                }}
                                render={({ field, fieldState: { error } }) => {
                                    return (
                                        <TextField
                                            {...field}
                                            id={field.name}
                                            sx={{
                                                maxWidth: {
                                                    xs: 'none',
                                                    md: 150,
                                                },
                                            }}
                                            label="CVC"
                                            error={Boolean(error)}
                                            helperText={
                                                Boolean(error) &&
                                                'CVC is invalid'
                                            }
                                            onChange={x => {
                                                if (x.target.value.length > 3) {
                                                    return;
                                                }

                                                return field.onChange(
                                                    allowOnlyNumber(
                                                        x.target.value
                                                    )
                                                );
                                            }}
                                        />
                                    );
                                }}
                            />
                        </Stack>
                        <Controller
                            name="name"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: true,
                                pattern:
                                    /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/,
                            }}
                            render={({ field, fieldState: { error } }) => {
                                return (
                                    <TextField
                                        {...field}
                                        id={field.name}
                                        fullWidth
                                        label="Cardholder Name"
                                        error={Boolean(error)}
                                        helperText={
                                            Boolean(error) &&
                                            'Cardholder Name is invalid'
                                        }
                                    />
                                );
                            }}
                        />
                    </Stack>
                </CardContent>
                <CardActions>
                    <Button size="small" type="submit">
                        Order
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
};
