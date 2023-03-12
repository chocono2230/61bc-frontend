import { forwardRef } from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

export type Serverity = 'info' | 'success' | 'error' | 'warning';

type Props = {
  msg: string;
  serverity: Serverity;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  time?: number;
};

const CustomizedSnackbar = (props: Props) => {
  const { msg, serverity, open, setOpen, time } = props;

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={open} autoHideDuration={time !== undefined ? time : 6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={serverity} sx={{ width: '100%' }}>
          {msg}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default CustomizedSnackbar;
