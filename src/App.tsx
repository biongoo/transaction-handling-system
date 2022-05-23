import { ReactElement } from 'react';
import { useQuery } from 'react-query';
import { Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ApiError, Car } from 'types';
import { connectApi } from 'api';
import { Main, Rent, Payment } from 'pages';
import { Loading } from 'components';
import styles from './App.module.css';

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const App = () => {
    const { isLoading, isError, error, data } = useQuery<Car[], ApiError>(
        'cars',
        () => connectApi({ endpoint: 'cars' }),
    );

    let content: ReactElement;

    if (isLoading) {
        content = <Loading />;
    } else if (isError) {
        content = <>{error.message}</>;
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
