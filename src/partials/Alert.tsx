import { Alert as AlertMui, AlertTitle, Snackbar } from '@mui/material';
import { useUiStore } from 'stores';

export const Alert = () => {
  const alert = useUiStore((state) => state.alert);
  const hideAlert = useUiStore((state) => state.hideAlert);

  const title = alert.title ? (
    <AlertTitle>{alert.title}</AlertTitle>
  ) : undefined;

  const body = alert.body ? <AlertTitle>{alert.body}</AlertTitle> : undefined;

  return (
    <Snackbar
      open={alert.open}
      autoHideDuration={alert.time}
      sx={{ maxWidth: { sm: 500, md: 600 }, opacity: 0.9 }}
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'bottom',
      }}
      onClose={hideAlert}
    >
      <AlertMui
        variant="filled"
        sx={{ width: '100%' }}
        severity={alert.variant}
        onClose={hideAlert}
      >
        {title}
        {body}
      </AlertMui>
    </Snackbar>
  );
};
