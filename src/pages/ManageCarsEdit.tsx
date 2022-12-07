import {
  Button,
  Checkbox,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { connectApi } from 'api';
import { Input, Loading, Select } from 'components';
import { EngineType } from 'enums';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useUiStore } from 'stores';
import { ApiError, Car } from 'types';
import { Feature } from 'types/feature';

type Inputs = {
  name: string;
  pricePerDay: string;
  acceleration: string;
  engineType: EngineType;
  url: string;
};

type Request = {
  name: string;
  pricePerDay: number;
  acceleration: number;
  engineType: string;
  url: string;
  featuresId: string[];
};

function not(a: string[], b: string[]) {
  return a.filter((value) => !b.includes(value));
}

function intersection(a: string[], b: string[]) {
  return a.filter((value) => b.includes(value));
}

export const ManageCarsEdit = () => {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { control, handleSubmit, setError } = useForm<Inputs>();
  const showAlert = useUiStore((state) => state.showAlert);
  const hideAlert = useUiStore((state) => state.hideAlert);
  const [checked, setChecked] = useState<string[]>([]);
  const [left, setLeft] = useState<string[]>([]);
  const [right, setRight] = useState<string[]>([]);

  const { data: features } = useQuery<Feature[], ApiError>(['features'], () =>
    connectApi({ endpoint: 'cars-feature' })
  );

  const { isInitialLoading, data } = useQuery<Car[], ApiError>(['cars'], () =>
    connectApi({ endpoint: 'cars' })
  );

  const id = params.id;

  const car = data?.find((x) => x._id === id);

  if (!id) {
    navigate('/manage-cars');
    return null;
  }

  useEffect(() => {
    if (features) {
      const carFeatures = car?.features.map((x) => x._id) ?? [];

      setLeft(
        features.map((x) => x._id).filter((x) => !carFeatures.includes(x))
      );
      setRight(carFeatures);
    }
  }, [features?.length, car?.features.length]);

  const mutation = useMutation<unknown, ApiError, Request>(
    (data) =>
      connectApi({
        endpoint: `cars/${id}`,
        reqData: data,
        method: 'PATCH',
      }),
    {
      onMutate: () => {
        hideAlert();
      },
      onSuccess: () => {
        showAlert({
          title: 'Success',
          variant: 'success',
          body: 'Car edited successfully!',
        });
        queryClient.invalidateQueries({ queryKey: ['cars'] });
        navigate(`/manage-cars`);
      },
      onError: (e) => {
        showAlert({
          title: 'Error',
          variant: 'error',
          body: e.message,
        });
      },
    }
  );

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setRight([...right, ...left]);
    setLeft([]);
    setChecked([]);
  };

  const handleCheckedRight = () => {
    setRight([...right, ...leftChecked]);
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft([...left, ...rightChecked]);
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft([...left, ...right]);
    setRight([]);
    setChecked([]);
  };

  const customList = (items: string[]) => (
    <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
      <List dense component="div" role="list">
        {items.map((value: string) => {
          const labelId = `transfer-list-item-${value}-label`;
          const name = features?.find((x) => x._id === value)?.name;

          return (
            <ListItem
              key={value}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.includes(value)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={name} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );

  const onSubmit = (data: Inputs) => {
    if (Number.isNaN(+data.acceleration)) {
      setError('acceleration', {});
    }

    mutation.mutate({
      url: data.url,
      name: data.name,
      engineType: data.engineType,
      pricePerDay: +data.pricePerDay,
      acceleration: +data.acceleration,
      featuresId: right,
    });
  };

  if (isInitialLoading) {
    return <Loading />;
  }

  if (!id || !car) {
    navigate('/manage-cars');
    return null;
  }

  return (
    <Stack
      spacing={3}
      sx={{ width: 500, margin: 'auto' }}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      autoComplete="off"
    >
      <Typography variant="h5">Edit Car</Typography>
      <Input
        name="name"
        label="Name"
        control={control}
        defaultValue={car.name}
      />
      <Input
        name="pricePerDay"
        label="Price per day"
        onlyNumbers={true}
        control={control}
        defaultValue={car.pricePerDay.toString()}
        minLength={2}
        maxLength={5}
      />
      <Input
        name="acceleration"
        label="Acceleration"
        onlyFloats={true}
        control={control}
        defaultValue={car.acceleration.toString()}
        minLength={1}
        maxLength={4}
      />
      <Input
        name="url"
        label="Url"
        control={control}
        defaultValue={car.url}
        maxLength={1024}
      />
      <Select
        name="engineType"
        title="Engine type"
        fullWidth
        control={control}
        options={[
          EngineType.diesel,
          EngineType.electric,
          EngineType.hybrid,
          EngineType.petrol,
        ]}
        defaultValue={car.engineType}
      />
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>{customList(left)}</Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center">
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleAllRight}
              disabled={left.length === 0}
              aria-label="move all right"
            >
              ≫
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleAllLeft}
              disabled={right.length === 0}
              aria-label="move all left"
            >
              ≪
            </Button>
          </Grid>
        </Grid>
        <Grid item>{customList(right)}</Grid>
      </Grid>
      <Stack spacing={2}>
        <Button variant="contained" type="submit">
          Edit
        </Button>
        <Divider>OR</Divider>
        <Button variant="contained" onClick={() => navigate('/manage-cars')}>
          Back
        </Button>
      </Stack>
    </Stack>
  );
};
