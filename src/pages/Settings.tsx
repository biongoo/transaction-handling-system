import { Button, Divider, Stack, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { connectApi } from 'api';
import { Input } from 'components';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useUiStore } from 'stores';
import { ApiError } from 'types';

type Inputs = {
  email: string;
  password?: string;
};

export const Settings = () => {
  const navigate = useNavigate();
  const user = useAuthStore((x) => x.user);
  const logOut = useAuthStore((x) => x.logOut);
  const setEmail = useAuthStore((x) => x.setEmail);
  const { control, handleSubmit } = useForm<Inputs>();
  const showAlert = useUiStore((state) => state.showAlert);
  const hideAlert = useUiStore((state) => state.hideAlert);

  if (!user) {
    navigate('/');
    return null;
  }

  const mutation = useMutation<unknown, ApiError, Inputs>(
    (data) =>
      connectApi({
        endpoint: `user/${user._id}`,
        reqData: data,
        method: 'PATCH',
      }),
    {
      onMutate: () => {
        hideAlert();
      },
      onSuccess: (_x, y) => {
        showAlert({
          title: 'Success',
          variant: 'success',
          body: 'Account edited successfully!',
        });
        setEmail(y.email);
        navigate(`/`);
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

  const mutationDelete = useMutation<unknown, ApiError>(
    () =>
      connectApi({
        endpoint: `user/${user._id}`,
        method: 'DELETE',
      }),
    {
      onMutate: () => {
        hideAlert();
      },
      onSuccess: () => {
        logOut();
        showAlert({
          title: 'Success',
          variant: 'success',
          body: 'Account deleted successfully!',
        });
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

  const onSubmit = (data: Inputs) => {
    mutation.mutate(data);
  };

  const handleDelete = () => {
    mutationDelete.mutate();
  };

  return (
    <Stack
      spacing={3}
      sx={{ width: 500, margin: 'auto' }}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      autoComplete="off"
    >
      <Typography variant="h5">Edit user</Typography>
      <Input
        name="email"
        label="Email"
        control={control}
        defaultValue={user.email}
        pattern={
          // eslint-disable-next-line unicorn/better-regex, unicorn/no-unsafe-regex
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i
        }
      />
      <Input
        name="password"
        label="Password (Optional)"
        type="password"
        control={control}
        required={false}
        defaultValue=""
        minLength={8}
        maxLength={24}
      />
      <Stack spacing={2}>
        <Button variant="contained" type="submit">
          Edit
        </Button>
        <Divider>OR</Divider>
        <Button variant="contained" onClick={handleDelete}>
          Delete account
        </Button>
      </Stack>
    </Stack>
  );
};
