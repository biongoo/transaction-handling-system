import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useMutation, useQuery } from '@tanstack/react-query';
import { connectApi } from 'api';
import { DatePicker, Input, Loading } from 'components';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from 'stores';
import { ApiError, Car } from 'types';

type Inputs = {
  name: string;
  phone: string;
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

type Availability = {
  startDate: string;
  endDate: string;
};

const isValidDate = (date: Date | null) => {
  return date instanceof Date && !Number.isNaN(date.getTime());
};

export const Rent = () => {
  const user = useAuthStore((x) => x.user);
  const { carId } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car>();
  const [errorMessage, setErrorMessage] = useState('');

  const { isInitialLoading: isInitialLoading2, data: availability } = useQuery<
    Availability[],
    ApiError
  >(['availability'], () =>
    connectApi({ endpoint: `cars/${carId ?? 0}/availability` })
  );

  const { isInitialLoading, data: cars } = useQuery<Car[], ApiError>(
    ['cars', carId ?? 0],
    () => connectApi({ endpoint: 'cars' })
  );

  useEffect(() => {
    if (!carId) {
      return navigate('/');
    }

    if (cars) {
      const car = cars.find((car) => car._id === carId);

      if (!car) {
        return navigate('/');
      }

      setCar(car);
    }
  }, [cars, carId]);

  const { control, setError, handleSubmit, watch, setValue } = useForm<Inputs>({
    mode: 'onTouched',
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  useEffect(() => {
    if (!endDate || !startDate) {
      return;
    }

    for (const x of availability ?? []) {
      const start = new Date(x.startDate).getTime();
      const end = new Date(x.endDate).getTime();

      if (startDate.getTime() < start && endDate.getTime() > end) {
        setValue('endDate', null);
        return;
      }
    }
  }, [startDate]);

  useEffect(() => {
    if (!endDate || !startDate) {
      return;
    }

    for (const x of availability ?? []) {
      const start = new Date(x.startDate).getTime();
      const end = new Date(x.endDate).getTime();

      if (startDate.getTime() < start && endDate.getTime() > end) {
        setValue('startDate', null);
        return;
      }
    }
  }, [endDate]);

  const mutation = useMutation<{ paymentId: string }, ApiError, Data>(
    (newOrder) =>
      connectApi({
        endpoint: 'order',
        reqData: newOrder,
        method: 'POST',
      }),
    {
      onMutate: () => {
        setErrorMessage('');
      },
      onSuccess: ({ paymentId }) => {
        return navigate(`/payment/${paymentId}`);
      },
      onError: (apiError) => {
        if (apiError.inputName) {
          setError(apiError.inputName as keyof Inputs, {});
        }

        setErrorMessage(apiError.message);
      },
    }
  );

  const onSubmit: SubmitHandler<Inputs> = (data) => {
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
      email: user?.email ?? '',
      endDate: data.endDate.toISOString(),
      phone: +data.phone,
      startDate: data.startDate.toISOString(),
    });
  };

  const shouldDisableStart = (date: Date) => {
    const time = date.getTime();

    if (endDate && time > endDate.getTime()) {
      return true;
    }

    for (const x of availability ?? []) {
      const start = new Date(x.startDate).getTime();
      const end = new Date(x.endDate).getTime();

      if (time >= start && time <= end) {
        return true;
      }
    }

    return false;
  };

  const shouldDisableEnd = (date: Date) => {
    const time = date.getTime();

    if (startDate && time < startDate.getTime()) {
      return true;
    }

    for (const x of availability ?? []) {
      const start = new Date(x.startDate).getTime();
      const end = new Date(x.endDate).getTime();

      if (time >= start && time <= end) {
        return true;
      }
    }

    return false;
  };

  if (isInitialLoading || isInitialLoading2) {
    return <Loading />;
  }

  if (!car) {
    return null;
  }

  const maxDate = new Date(new Date().setMonth(new Date().getMonth() + 3));

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
      <DatePicker
        name="startDate"
        label="Start Date"
        control={control}
        disablePast={true}
        shouldDisableDate={shouldDisableStart}
        maxDate={maxDate}
      />
      <DatePicker
        name="endDate"
        label="End Date"
        control={control}
        disablePast={true}
        shouldDisableDate={shouldDisableEnd}
        maxDate={maxDate}
      />
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
          <Typography variant="body2" color="text.secondary">
            Acceleration: {car.acceleration}s
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Engine type:{' '}
            {car.engineType.at(0)?.toUpperCase() + car.engineType.slice(1)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Features: {car.features.map((x) => x.name).join(', ')}
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
