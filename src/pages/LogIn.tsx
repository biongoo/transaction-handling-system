import { Button, Divider, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useMutation } from '@tanstack/react-query';
import { connectApi } from 'api';
import { Input } from 'components';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useUiStore } from 'stores';
import { ApiError, User } from 'types';

type Inputs = {
  email: string;
  password: string;
};

export const LogIn = () => {
  const navigate = useNavigate();
  const logIn = useAuthStore((state) => state.logIn);
  const showAlert = useUiStore((state) => state.showAlert);
  const hideAlert = useUiStore((state) => state.hideAlert);
  const { control, handleSubmit } = useForm<Inputs>();

  const mutation = useMutation<{ token: string; user: User }, ApiError, Inputs>(
    (data) =>
      connectApi({
        endpoint: 'auth/login',
        reqData: data,
        method: 'POST',
      }),
    {
      onMutate: () => {
        hideAlert();
      },
      onSuccess: (data) => {
        logIn(data.token, {
          _id: data.user._id,
          email: data.user.email,
          role: data.user.role,
        });

        showAlert({
          title: 'Success',
          variant: 'success',
          body: 'Logged in successfully!',
        });
      },
      onError: () => {
        showAlert({
          title: 'Error',
          variant: 'error',
          body: 'Invalid email or password',
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
        Log in to your account
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
      <Stack spacing={2}>
        <Input
          name="password"
          label="Password"
          type="password"
          control={control}
          defaultValue=""
          minLength={8}
          maxLength={24}
        />
        <Button variant="contained" type="submit">
          Login
        </Button>
        <Divider>OR</Divider>
        <Button variant="contained" onClick={() => navigate('/auth/signup')}>
          Create Account
        </Button>
      </Stack>
    </Stack>
  );
};
