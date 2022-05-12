import { useEffect, useState } from 'react';
import { Car } from '../types';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Input, DatePicker } from 'components';
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
    startDate: string;
    endDate: string;
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

    const inputs = (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Input name="name" label="Name" control={control} defaultValue="" />
            <Input
                name="phone"
                label="Phone"
                control={control}
                onlyNumbers={true}
                maxLength={9}
                defaultValue=""
            />
            <Input
                name="email"
                label="Email"
                control={control}
                defaultValue=""
            />
            <DatePicker name="startDate" label="Start Date" control={control} />
            <DatePicker name="endDate" label="End Date" control={control} />
        </LocalizationProvider>
    );

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
                    alt="green iguana"
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
