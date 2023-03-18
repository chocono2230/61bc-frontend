import { useState, useEffect } from 'react';
import { Box, Typography, ListItem, ListItemText, IconButton, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Image from 'mui-image';
import { useNavigate } from 'react-router-dom';

import { Post, DeletePostRequest } from '../../api/types/post';
import { Base64Image } from '../../api/types/image';
import { deletePost, getImage } from '../../api/callApi';

import GenericDialog from '../GenericDialog';

type Props = {
  post: Post;
  userName: string;
  userId?: string;
  authToken?: string;
  identity?: string;
  setDeletePostId?: React.Dispatch<React.SetStateAction<string>>;
};

type ViewUserNameProps = {
  userName: string;
  userId: string;
};

const ViewUserName = (props: ViewUserNameProps) => {
  const navigate = useNavigate();
  const { userName, userId } = props;

  const handleClick = () => {
    const path = `/user/${userId}`;
    navigate(path);
  };

  return (
    <Typography onClick={handleClick} variant='caption'>
      {userName}
    </Typography>
  );
};

const ViewPost = (props: Props) => {
  const { post, userName, userId, authToken, identity, setDeletePostId } = props;
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [base64Image, setBase64Image] = useState<Base64Image | null>(null);
  const idDisabled = post.userId !== userId;

  useEffect(() => {
    void (async () => {
      try {
        if (!post.content.image || !authToken) return;
        const res = await getImage(post.content.image.compressedId, authToken);
        if (res) {
          setBase64Image(res);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [post, authToken]);

  const callDeletePost = async (postId: string) => {
    try {
      if (!userId || !identity || !authToken) return;
      const req: DeletePostRequest = {
        id: postId,
        userId: userId,
        identity: identity,
      };
      await deletePost(req, authToken);
      setDialogOpen(false);
      if (setDeletePostId) {
        setDeletePostId(postId);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ListItem
      sx={{ border: '1px solid #e0e0e0', borderRadius: '4px', padding: '8px' }}
      secondaryAction={
        <IconButton
          edge='end'
          aria-label='delete'
          onClick={() => {
            setDialogOpen(true);
          }}
          disabled={idDisabled}
        >
          <DeleteIcon />
        </IconButton>
      }
    >
      <GenericDialog
        msg='本当に削除しますか？'
        isOpen={dialogOpen}
        okMsg='削除する'
        doOk={() => void callDeletePost(post.id)}
        doCancel={() => setDialogOpen(false)}
        irreversibleFlag
      />
      <Box sx={{ width: '100%' }}>
        <ListItemText primary={post.content.comment} sx={{ whiteSpace: 'pre-line' }} />
        {base64Image && (
          <Paper sx={{ width: '100%' }}>
            <Image src={base64Image.data} />
          </Paper>
        )}
        <ViewUserName userName={userName} userId={post.userId} />
      </Box>
    </ListItem>
  );
};

export default ViewPost;
