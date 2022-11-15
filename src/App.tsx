import { Box, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { connectApi } from 'api';
import { Loading } from 'components';
import { Main, Payment, Rent } from 'pages';
import { ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ApiError, Car } from 'types';
import styles from './App.module.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App = () => {
  const { isLoading, isError, error, data } = useQuery<Car[], ApiError>(
    ['cars'],
    () => connectApi({ endpoint: 'cars' })
  );

  let content: ReactElement;

  if (isLoading) {
    content = <Loading />;
  } else if (isError) {
    content = (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 3,
        }}
      >
        {error.message}
      </Box>
    );
  } else if (!data) {
    content = <>Unknown error.</>;
  } else {
    content = (
      <Routes>
        <Route path="rent/:carId" element={<Rent cars={data} />} />
        <Route path="payment/:paymentId" element={<Payment />} />
        <Route path="*" element={<Main cars={data} />} />
      </Routes>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={styles.app}>{content}</div>
    </ThemeProvider>
  );
};

export default App;
