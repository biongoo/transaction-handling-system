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

const cars: Car[] = [
  {
      id: 1,
      name: 'BMW M5 GTS',
      pricePerDay: 1200,
      url: 'https://www.tuningblog.eu/wp-content/uploads/2019/10/Vorsteiner-GTS-Carbon-Bodykit-Tuning-BMW-M5-F90-1.jpg',
  },
  {
      id: 2,
      name: 'Ferrari 488 Pista',
      pricePerDay: 2500,
      url: 'https://cdn.car-recalls.eu/wp-content/uploads/2020/04/Ferrari-488-Pista-2018-recall-fuel-fire.jpg',
  },
  {
      id: 3,
      name: 'VW Golf 8 R',
      pricePerDay: 800,
      url: 'https://img.chceauto.pl/volkswagen/golf/volkswagen-golf-hatchback-5-drzwiowy-4514-50024_head.webp',
  },
]

const App = () => {
    return ( 
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className={styles.app}>
            <Routes>
                <Route path="rent/:carId" element={<Rent cars={cars} />} />
                <Route path="*" element={<Main cars={cars} />} />
            </Routes>
          </div>
        </ThemeProvider>    
    );
}

export default App;
