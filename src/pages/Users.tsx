import { Add, Delete, Edit } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { connectApi } from 'api';
import { Loading } from 'components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUiStore } from 'stores';
import { ApiError, User } from 'types';

export const Users = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const showAlert = useUiStore((state) => state.showAlert);
  const hideAlert = useUiStore((state) => state.hideAlert);

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    name: '',
    _id: '',
  });

  const { isInitialLoading, data } = useQuery<User[], ApiError>(['users'], () =>
    connectApi({ endpoint: 'user/all' })
  );

  const mutation = useMutation<unknown, ApiError, { _id: string }>(
    (data) =>
      connectApi({
        endpoint: `user/${data._id}`,
        method: 'DELETE',
      }),
    {
      onMutate: () => {
        hideAlert();
      },
      onSuccess: () => {
        showAlert({
          title: 'Success',
          variant: 'success',
          body: 'Account deleted successfully!',
        });
        queryClient.invalidateQueries({ queryKey: ['users'] });
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

  const users = data ?? [];

  const handleCloseDelete = () =>
    setDeleteModal((state) => ({ ...state, open: false }));

  const handleDelete = () => {
    mutation.mutate({ _id: deleteModal._id });
    handleCloseDelete();
  };

  return (
    <>
      <Stack
        mb={2}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Typography variant="h5">Users</Typography>
        <IconButton onClick={() => navigate('/users/add')}>
          <Add />
        </IconButton>
      </Stack>
      <TableContainer component={Paper} sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((row, i) => (
              <TableRow
                key={row._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {i + 1}
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>
                  {row.role.charAt(0).toUpperCase() + row.role.slice(1)}
                </TableCell>
                <TableCell align="right" sx={{ p: 0 }}>
                  <IconButton
                    onClick={() => navigate(`/users/${row._id}/edit`)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      setDeleteModal({
                        open: true,
                        name: row.email,
                        _id: row._id,
                      })
                    }
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={deleteModal.open} onClose={handleCloseDelete}>
        <DialogTitle>Delete user</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {deleteModal.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Disagree</Button>
          <Button onClick={handleDelete} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
