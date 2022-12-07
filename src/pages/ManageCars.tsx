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
import { ApiError, Car } from 'types';

export const ManageCars = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const showAlert = useUiStore((state) => state.showAlert);
  const hideAlert = useUiStore((state) => state.hideAlert);

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    name: '',
    _id: '',
  });

  const { isInitialLoading, data } = useQuery<Car[], ApiError>(['cars'], () =>
    connectApi({ endpoint: 'cars' })
  );

  const mutation = useMutation<unknown, ApiError, { _id: string }>(
    (data) =>
      connectApi({
        endpoint: `cars/${data._id}`,
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
          body: 'Car deleted successfully!',
        });
        queryClient.invalidateQueries({ queryKey: ['cars'] });
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

  const cars = data ?? [];

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
        <Typography variant="h5">Cars</Typography>
        <IconButton onClick={() => navigate('/manage-cars/add')}>
          <Add />
        </IconButton>
      </Stack>
      <TableContainer component={Paper} sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price per day</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cars.map((row, i) => (
              <TableRow
                key={row._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {i + 1}
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.pricePerDay}</TableCell>
                <TableCell align="right" sx={{ p: 0 }}>
                  <IconButton
                    onClick={() => navigate(`/manage-cars/${row._id}/edit`)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      setDeleteModal({
                        open: true,
                        name: row.name,
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
        <DialogTitle>Delete car</DialogTitle>
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
