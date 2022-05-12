import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Car } from '../types';

export const Main = ({ cars }: { cars: Car[] }) => {
    const carsOutput = cars.map(car => (
        <Card sx={{ maxWidth: 250 }} key={car.id}>
            <CardMedia
                component="img"
                alt="green iguana"
                height="140"
                image={car.url}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {car.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Price: {car.pricePerDay} PLN
                </Typography>
            </CardContent>
            <CardActions>
                <Button component={Link} to={`/rent/${car.id}`}>
                    Rent now!
                </Button>
            </CardActions>
        </Card>
    ));

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 3,
            }}
        >
            {carsOutput}
        </Box>
    );
};
