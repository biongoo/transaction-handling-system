import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { connectApi } from 'api';
import { Loading } from 'components';
import { UserRole } from 'enums';
import { useAuthStore } from 'stores';
import { ApiError, Car, Order } from 'types';

export const Orders = () => {
  const user = useAuthStore((x) => x.user);
  const { isInitialLoading: isInitialLoadingCars, data: carsData } = useQuery<
    Car[],
    ApiError
  >(['cars'], () => connectApi({ endpoint: 'cars' }));

  const { isInitialLoading, data } = useQuery<Order[], ApiError>(
    ['order'],
    () => connectApi({ endpoint: 'order' })
  );

  if (isInitialLoading || isInitialLoadingCars) {
    return <Loading />;
  }

  const orders = data ?? [];
  const cars = carsData ?? [];

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
              <TableCell>Car</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
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
                <TableCell>
                  {cars.find((x) => x._id === row.car)?.name}
                </TableCell>
                <TableCell>
                  {new Date(row.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(row.endDate).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
