import { forwardRef } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

export type Severity = 'info' | 'success' | 'error' | 'warning';

type Props = {
  msg: string;
  severity: Severity;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  time?: number;
};

const CustomizedSnackbar = (props: Props) => {
  const { msg, severity, open, setOpen, time } = props;

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={time !== undefined ? time : 6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {msg}
      </Alert>
    </Snackbar>
  );
};

export default CustomizedSnackbar;
