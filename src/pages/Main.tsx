import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ApiError, Car } from '../types';
import { useQuery } from '@tanstack/react-query';
import { connectApi } from 'api';
import { Loading } from 'components';
import { useAuthStore } from 'stores';

export const Main = () => {
  const token = useAuthStore((store) => store.token);
  const { isInitialLoading, data } = useQuery<Car[], ApiError>(['cars'], () =>
    connectApi({ endpoint: 'cars' })
  );

  if (isInitialLoading) {
    return <Loading />;
  }

  const cars = data ?? [];

  const carsOutput = cars.map((car) => {
    const to = token ? `/rent/${car._id}` : '/auth/login';

    return (
      <Card sx={{ maxWidth: 250 }} key={car._id}>
        <CardMedia
          component="img"
          alt={car.name}
          height="140"
          image={car.url}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {car.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Price: {car.pricePerDay} PLN
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Acceleration: {car.acceleration}s
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Engine type:{' '}
            {car.engineType.at(0)?.toUpperCase() + car.engineType.slice(1)}
          </Typography>
        </CardContent>
        <CardActions>
          <Button component={Link} to={to}>
            Rent now!
          </Button>
        </CardActions>
      </Card>
    );
  });

  const content =
    carsOutput.length > 0 ? carsOutput : 'No car has been added yet.';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 3,
      }}
    >
      {content}
    </Box>
  );
};
