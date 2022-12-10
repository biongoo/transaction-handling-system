import { Delete } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Link as LinkMui,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { connectApi } from 'api';
import { Loading } from 'components';
import { UserRole } from 'enums';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore, useUiStore } from 'stores';
import { ApiError, Order } from 'types';

export const Orders = () => {
  const user = useAuthStore((x) => x.user);
  const showAlert = useUiStore((x) => x.showAlert);
  const hideAlert = useUiStore((x) => x.hideAlert);
  const queryClient = useQueryClient();

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    name: '',
    _id: '',
  });

  const [paidModal, setPaidModal] = useState({
    open: false,
    name: '',
    _id: '',
  });

  const { isInitialLoading, data } = useQuery<Order[], ApiError>(
    ['order'],
    () => connectApi({ endpoint: 'order' })
  );

  const deleteOrder = useMutation<unknown, ApiError, { _id: string }>(
    (data) =>
      connectApi({
        endpoint: `order/${data._id}`,
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
          body: 'Order deleted successfully!',
        });
        queryClient.invalidateQueries({ queryKey: ['order'] });
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

  const paidOrder = useMutation<unknown, ApiError, { _id: string }>(
    (data) =>
      connectApi({
        endpoint: `order/${data._id}`,
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
          body: 'Changed successfully!',
        });
        queryClient.invalidateQueries({ queryKey: ['order'] });
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

  const orders = data ?? [];

  const handleCloseDelete = () =>
    setDeleteModal((state) => ({ ...state, open: false }));

  const handleClosePaid = () =>
    setPaidModal((state) => ({ ...state, open: false }));

  const handleDelete = () => {
    deleteOrder.mutate({ _id: deleteModal._id });
    handleCloseDelete();
  };

  const handlePaid = () => {
    paidOrder.mutate({ _id: paidModal._id });
    handleClosePaid();
  };

  return (
    <>
      <Typography variant="h5" mb={2}>
        Orders
      </Typography>
      <TableContainer component={Paper} sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              {user?.role === UserRole.user ? null : (
                <TableCell>Email</TableCell>
              )}
              {user?.role === UserRole.user ? null : (
                <TableCell>Phone</TableCell>
              )}
              <TableCell>Car</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Is paid</TableCell>
              {user?.role === UserRole.user ? null : <TableCell></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((row, i) => (
              <TableRow
                key={row._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {i + 1}
                </TableCell>
                <TableCell>{row.name}</TableCell>
                {user?.role === UserRole.user ? null : (
                  <TableCell>{row.email}</TableCell>
                )}
                {user?.role === UserRole.user ? null : (
                  <TableCell>{row.phone}</TableCell>
                )}
                <TableCell>{row.car.name}</TableCell>
                <TableCell>
                  {new Date(row.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(row.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{row.payment.value} PLN</TableCell>
                <TableCell>
                  {row.payment.status === 'paid' ? (
                    'Yes'
                  ) : // eslint-disable-next-line unicorn/no-nested-ternary
                  user?.role === UserRole.user ? (
                    <LinkMui
                      component={Link}
                      to={`/payment/${row.payment._id}`}
                    >
                      Pay now
                    </LinkMui>
                  ) : (
                    <LinkMui
                      onClick={() =>
                        setPaidModal({
                          open: true,
                          name: `order with id ${i + 1}`,
                          _id: row._id,
                        })
                      }
                    >
                      Set as paid
                    </LinkMui>
                  )}
                </TableCell>
                {user?.role === UserRole.user ? null : (
                  <TableCell>
                    <IconButton
                      onClick={() =>
                        setDeleteModal({
                          open: true,
                          name: `order with id ${i + 1}`,
                          _id: row._id,
                        })
                      }
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                )}
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
      <Dialog open={paidModal.open} onClose={handleClosePaid}>
        <DialogTitle>Set as paid</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to set as paid {paidModal.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaid}>Disagree</Button>
          <Button onClick={handlePaid} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
