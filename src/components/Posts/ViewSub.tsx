import { useNavigate } from 'react-router-dom';
import { Typography, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

type Props = {
  userName: string;
  userId: string;
  idDisabled: boolean;
  timestamp: number;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ViewSub = (props: Props) => {
  const { userName, userId, idDisabled, timestamp, setDialogOpen } = props;
  const navigate = useNavigate();

  const handleClick = () => {
    const path = `/user/${userId}`;
    navigate(path);
  };

  const timestamp2date = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');
    return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
  };

  return (
    <Box sx={{ display: 'flex', p: 1, alignItems: 'center' }}>
      <Typography onClick={handleClick} variant='body2' sx={{ m: 1 }}>
        投稿者: {userName}
      </Typography>
      <Typography variant='body2' sx={{ m: 1 }}>
        {timestamp2date(timestamp)}
      </Typography>
      <IconButton
        onClick={() => {
          setDialogOpen(true);
        }}
        disabled={idDisabled}
        sx={{ ml: 'auto' }}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default ViewSub;
