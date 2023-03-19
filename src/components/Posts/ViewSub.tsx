import { useNavigate } from 'react-router-dom';
import { Typography, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';

type Props = {
  userName: string;
  userId: string;
  idDisabled: boolean;
  timestamp: number;
  likes?: number;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  callLike: () => Promise<void>;
};

const ViewSub = (props: Props) => {
  const { userName, userId, idDisabled, timestamp, likes, setDialogOpen, callLike } = props;
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
        {userName}
      </Typography>
      <Typography variant='body2' sx={{ m: 1 }}>
        {timestamp2date(timestamp)}
      </Typography>
      <IconButton
        onClick={() => {
          void callLike();
        }}
      >
        <FavoriteIcon sx={{ color: 'rgb(249, 24, 128)' }} />
      </IconButton>
      <Typography>{likes ? likes : 0}</Typography>
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
