import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  Slider,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { connectApi } from 'api';
import { Loading } from 'components';
import { EngineType } from 'enums';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from 'stores';
import { Feature } from 'types/feature';
import { ApiError, Car } from '../types';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const Main = () => {
  const token = useAuthStore((store) => store.token);
  const [feature, setFeature] = useState<string[]>([]);
  const [engineType, setEngineType] = useState<EngineType[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([200, 5000]);
  const [accelerationRange, setAccelerationRange] = useState<number[]>([1, 20]);

  const { isInitialLoading, data } = useQuery<Car[], ApiError>(['cars'], () =>
    connectApi({ endpoint: 'cars' })
  );

  const { data: features } = useQuery<Feature[], ApiError>(['features'], () =>
    connectApi({ endpoint: 'cars-feature' })
  );

  const handleChangePrice = (_event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handleChangeAcceleration = (
    _event: Event,
    newValue: number | number[]
  ) => {
    setAccelerationRange(newValue as number[]);
  };

  const handleChangeEngineType = (
    event: SelectChangeEvent<typeof engineType>
  ) => {
    const {
      target: { value },
    } = event;
    setEngineType(
      typeof value === 'string' ? (value.split(',') as EngineType[]) : value
    );
  };

  const handleChangeFeature = (event: SelectChangeEvent<typeof feature>) => {
    const {
      target: { value },
    } = event;
    setFeature(typeof value === 'string' ? value.split(',') : value);
  };

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
        flexDirection: 'column',
        alignItems: '',
        gap: 3,
      }}
    >
      <Paper
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 3,
        }}
      >
        <Box sx={{ width: 150 }}>
          <Typography id="input-slider" gutterBottom>
            Price range
          </Typography>
          <Slider
            value={priceRange}
            onChange={handleChangePrice}
            valueLabelDisplay="auto"
            min={0}
            max={5000}
          />
        </Box>

        <FormControl sx={{ width: 220 }}>
          <InputLabel id="engine-type-label">Engine Type</InputLabel>
          <Select
            labelId="engine-type-label"
            id="engine-type"
            multiple
            value={engineType}
            onChange={handleChangeEngineType}
            input={<OutlinedInput label="Engine Type" />}
            renderValue={(selected) =>
              selected
                .map((x) => x.at(0)?.toUpperCase() + x.slice(1))
                .join(', ')
            }
            MenuProps={MenuProps}
          >
            {Object.keys(EngineType).map((x) => (
              <MenuItem key={x} value={x}>
                <Checkbox checked={engineType.includes(x as EngineType)} />
                <ListItemText primary={x.at(0)?.toUpperCase() + x.slice(1)} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ width: 220 }}>
          <InputLabel id="features-label">Features</InputLabel>
          <Select
            labelId="features-label"
            id="features"
            multiple
            value={feature}
            onChange={handleChangeFeature}
            input={<OutlinedInput label="Features" />}
            renderValue={(selected) =>
              selected
                .map((x) => features?.find((y) => y._id === x)?.name)
                .join(', ')
            }
            MenuProps={MenuProps}
          >
            {features?.map((x) => (
              <MenuItem key={x._id} value={x._id}>
                <Checkbox checked={feature.includes(x._id)} />
                <ListItemText primary={x.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ width: 150 }}>
          <Typography id="input-slider" gutterBottom>
            Acceleration
          </Typography>
          <Slider
            value={accelerationRange}
            onChange={handleChangeAcceleration}
            valueLabelDisplay="auto"
            min={0}
            max={20}
          />
        </Box>
      </Paper>
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
    </Box>
  );
};
