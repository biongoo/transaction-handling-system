import { Button, Divider, Stack, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { connectApi } from 'api';
import { Input } from 'components';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useUiStore } from 'stores';
import { ApiError } from 'types';

type Inputs = {
  email: string;
  password: string;
};

export const SignUp = () => {
  const navigate = useNavigate();
  const showAlert = useUiStore((state) => state.showAlert);
  const hideAlert = useUiStore((state) => state.hideAlert);
  const { control, handleSubmit } = useForm<Inputs>();

  const mutation = useMutation<unknown, ApiError, Inputs>(
    (data) =>
      connectApi({
        endpoint: 'auth/register',
        reqData: data,
        method: 'POST',
      }),
    {
      onMutate: () => {
        hideAlert();
      },
      onSuccess: () => {
        showAlert({
          title: 'Success',
          variant: 'success',
          body: 'Account created successfully!',
        });
        navigate(`/auth/login`);
      },
      onError: () => {
        showAlert({
          title: 'Error',
          variant: 'error',
          body: 'User already exists',
        });
      },
    }
  );

  const onSubmit = (data: Inputs) => {
    mutation.mutate(data);
  };

  return (
    <Stack
      spacing={3}
      sx={{ width: 300 }}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      autoComplete="off"
    >
      <Typography variant="h6" align="center">
        Sing up for free!
      </Typography>
      <Input
        name="email"
        label="Email"
        control={control}
        defaultValue=""
        pattern={
          // eslint-disable-next-line unicorn/better-regex, unicorn/no-unsafe-regex
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i
        }
      />
      <Input
        name="password"
        label="Password"
        type="password"
        minLength={8}
        maxLength={24}
        control={control}
        defaultValue=""
      />
      <Stack spacing={2}>
        <Button variant="contained" type="submit">
          Sign Up
        </Button>
        <Divider>OR</Divider>
        <Button variant="contained" onClick={() => navigate('/auth/login')}>
          Login
        </Button>
      </Stack>
    </Stack>
  );
};
