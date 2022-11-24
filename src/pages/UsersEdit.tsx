import { Button, Divider, Stack, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { connectApi } from 'api';
import { Input, Loading, Select } from 'components';
import { UserRole } from 'enums';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useUiStore } from 'stores';
import { ApiError, User } from 'types';

type Inputs = {
  email: string;
  role: UserRole;
  password?: string;
};

export const UsersEdit = () => {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { control, handleSubmit } = useForm<Inputs>();
  const showAlert = useUiStore((state) => state.showAlert);
  const hideAlert = useUiStore((state) => state.hideAlert);

  const { isInitialLoading, data } = useQuery<User[], ApiError>(['users'], () =>
    connectApi({ endpoint: 'user/all' })
  );

  const id = params.id;

  const mutation = useMutation<unknown, ApiError, Inputs>(
    (data) =>
      connectApi({
        endpoint: `user/${id}`,
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
          body: 'Account edited successfully!',
        });
        queryClient.invalidateQueries({ queryKey: ['users'] });
        navigate(`/users`);
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

  if (isInitialLoading) {
    return <Loading />;
  }

  const user = data?.find((x) => x._id === id);

  if (!id || !user) {
    navigate('/users');
    return null;
  }

  const onSubmit = (data: Inputs) => {
    mutation.mutate(data);
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
      <Select
        name="role"
        title="Role"
        fullWidth
        control={control}
        options={[UserRole.user, UserRole.employee, UserRole.admin]}
        defaultValue={user.role}
      />
      <Stack spacing={2}>
        <Button variant="contained" type="submit">
          Edit
        </Button>
        <Divider>OR</Divider>
        <Button variant="contained" onClick={() => navigate('/users')}>
          Back
        </Button>
      </Stack>
    </Stack>
  );
};
