import { Link, Stack, Typography } from '@mui/material';
import { Link as LinkRR } from 'react-router-dom';

export const ErrorPage = () => (
  <Stack
    direction="column"
    justifyContent="center"
    alignItems="center"
    spacing={1}
    height="100vh"
  >
    <Typography variant="h5">ERROR</Typography>
    <Link component={LinkRR} to="/" color="inherit">
      <Typography variant="h6">Go back</Typography>
    </Link>
  </Stack>
);
