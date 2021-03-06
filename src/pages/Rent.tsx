import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { Car, ApiError } from 'types';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Input, DatePicker } from 'components';
import { connectApi } from 'api';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

type Inputs = {
    name: string;
    phone: string;
    email: string;
    startDate: Date | null;
    endDate: Date | null;
};

type Data = {
    carId: string;
    name: string;
    phone: number;
    email: string;
    startDate: string;
    endDate: string;
};

const isValidDate = (date: Date | null) => {
    return date instanceof Date && !isNaN(date.getTime());
};

export const Rent = ({ cars }: { cars: Car[] }) => {
    const { carId } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState<Car>();
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!carId) {
            return navigate('/');
        }

        const car = cars.find(car => car._id === carId);

        if (!car) {
            return navigate('/');
        }

        setCar(car);
    }, [cars, carId, navigate]);

    const { control, setError, handleSubmit } = useForm<Inputs>({
        mode: 'onTouched',
    });

    const mutation = useMutation<{ paymentId: string }, ApiError, Data>(
        newOrder => connectApi({ endpoint: 'order', reqData: newOrder, method: 'POST' }),
        {
            onMutate: () => {
                setErrorMessage('');
            },
            onSuccess: ({ paymentId }) => {
                return navigate(`/payment/${paymentId}`);
            },
            onError: apiError => {
                if (apiError.inputName) {
                    setError(apiError.inputName as keyof Inputs, {});
                }

                setErrorMessage(apiError.message);
            },
        },
    );

    const onSubmit: SubmitHandler<Inputs> = data => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!car) {
            return;
        }

        if (
            !data.startDate ||
            !isValidDate(data.startDate) ||
            data.startDate.getTime() < today.getTime()
        ) {
            setError('startDate', {});
            return;
        }

        if (!data.endDate || !isValidDate(data.endDate)) {
            setError('endDate', {});
            return;
        }

        if (data.endDate.getTime() - data.startDate.getTime() < 0) {
            setError('startDate', {});
            setError('endDate', {});
            return;
        }

        mutation.mutate({
            carId: car._id,
            name: data.name,
            email: data.email,
            endDate: data.endDate.toISOString(),
            phone: +data.phone,
            startDate: data.startDate.toISOString(),
        });
    };

    if (!car) {
        return null;
    }

    const inputs = (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Input name="name" label="Name" control={control} defaultValue="" />
            <Input
                name="phone"
                label="Phone"
                control={control}
                onlyNumbers={true}
                minLength={9}
                maxLength={9}
                defaultValue=""
            />
            <Input
                name="email"
                label="Email"
                control={control}
                defaultValue=""
                pattern={
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i
                }
            />
            <DatePicker name="startDate" label="Start Date" control={control} />
            <DatePicker name="endDate" label="End Date" control={control} />
        </LocalizationProvider>
    );

    const errorContent = errorMessage ? (
        <Box mt={4} sx={{ color: '#f44336' }}>
            Error: {errorMessage}
        </Box>
    ) : null;

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
            }}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            autoComplete="off"
            pb={3}
        >
            <Card sx={{ minWidth: 275, width: { xs: '90%', md: '70%' } }}>
                <CardMedia
                    component="img"
                    alt={car.name}
                    height="400"
                    image={car.url}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {car.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Price per day: {car.pricePerDay} PLN
                    </Typography>
                    <Stack spacing={2} mt={2} direction="column">
                        {inputs}
                    </Stack>
                    {errorContent}
                </CardContent>
                <CardActions>
                    <Button component={Link} to="/">
                        Back
                    </Button>
                    <Button type="submit">Rent now!</Button>
                </CardActions>
            </Card>
        </Box>
    );
};
