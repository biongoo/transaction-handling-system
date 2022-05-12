import { useQuery } from 'react-query';
import { Routes, Route } from 'react-router-dom';
import { Main, Rent } from './pages';
import CssBaseline from '@mui/material/CssBaseline';
import styles from './App.module.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Car } from './types';

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const App = () => {
    const { isLoading, error, data } = useQuery<Car[], Error>('cars', () =>
        fetch('http://localhost:8080/cars').then(res => res.json()),
    );

    if (isLoading || !data) {
        return null;
    }

    const content = error ? (
        error.message
    ) : (
        <Routes>
            <Route path="rent/:carId" element={<Rent cars={data} />} />
            <Route path="*" element={<Main cars={data} />} />
        </Routes>
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className={styles.app}>{content}</div>
        </ThemeProvider>
    );
};

export default App;
