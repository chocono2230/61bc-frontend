import { useState } from 'react';
import { ListItem, ListItemText, IconButton } from '@mui/material';
import { Post, DeletePostRequest } from '../../api/types/post';
import { deletePost } from '../../api/callApi';
import DeleteIcon from '@mui/icons-material/Delete';

import GenericDialog from '../GenericDialog';

type Props = {
  post: Post;
  userName: string;
  userId?: string;
  authToken?: string;
  identity?: string;
  setDeletePostId?: React.Dispatch<React.SetStateAction<string>>;
};

const ViewPost = (props: Props) => {
  const { post, userName, userId, authToken, identity, setDeletePostId } = props;
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const idDisabled = post.userId !== userId;

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
        okMsg='削除'
        doOk={() => void callDeletePost(post.id)}
        doCancel={() => setDialogOpen(false)}
        irreversibleFlag
      />
      <ListItemText primary={post.content.comment} secondary={userName} />
    </ListItem>
  );
};

export default ViewPost;
