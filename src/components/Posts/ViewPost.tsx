import { useState, useEffect, useContext } from 'react';
import { Box, ListItem, ListItemText, Paper } from '@mui/material';
import Image from 'mui-image';

import { Base64ImageContext, Base64ImageDispatchContext } from '../../context/image';
import { Post, DeletePostRequest, UpdateReactionResponse } from '../../api/types/post';
import { Base64Image } from '../../api/types/image';
import { deletePost, getImage, updateLike } from '../../api/callApi';
import ViewSub from './ViewSub';
import GenericDialog from '../GenericDialog';

type Props = {
  post: Post;
  userName: string;
  userId?: string;
  authToken?: string;
  identity?: string;
  setDeletePostId?: React.Dispatch<React.SetStateAction<string>>;
  setLikeResponse: React.Dispatch<React.SetStateAction<UpdateReactionResponse | null>>;
};

const ViewPost = (props: Props) => {
  const base64ImageContext = useContext(Base64ImageContext);
  const base64ImageDispatchContext = useContext(Base64ImageDispatchContext);
  const { post, userName, userId, authToken, identity, setDeletePostId, setLikeResponse } = props;
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [base64Image, setBase64Image] = useState<Base64Image | null>(null);
  const idDisabled = post.userId !== userId;

  useEffect(() => {
    void (async () => {
      try {
        if (!post.content.image || !authToken) return;
        if (base64ImageContext) {
          const res = base64ImageContext.get(post.content.image.compressedId);
          if (res) {
            setBase64Image(res);
            return;
          }
        }
        const res = await getImage(post.content.image.compressedId, authToken);
        if (res) {
          setBase64Image(res);
          if (base64ImageDispatchContext) {
            base64ImageDispatchContext(post.content.image.compressedId, res);
          }
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [post, authToken, base64ImageContext, base64ImageDispatchContext]);

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

  const callLike = async () => {
    try {
      if (!userId || !identity || !authToken) return;
      const r = await updateLike(post.id, authToken);
      if (r) {
        setLikeResponse(r);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ListItem sx={{ padding: '8px' }}>
      <Paper elevation={3} sx={{ width: '100%' }}>
        <GenericDialog
          msg='本当に削除しますか？'
          isOpen={dialogOpen}
          okMsg='削除する'
          doOk={() => void callDeletePost(post.id)}
          doCancel={() => setDialogOpen(false)}
          irreversibleFlag
        />
        <Box sx={{ width: '100%' }}>
          <ListItemText primary={post.content.comment} sx={{ m: 3, whiteSpace: 'pre-line' }} />
          {base64Image && <Image src={base64Image.data} duration={1000} />}
          <ViewSub
            userName={userName}
            userId={post.userId}
            idDisabled={idDisabled}
            timestamp={post.timestamp}
            likes={post.reactions}
            setDialogOpen={setDialogOpen}
            callLike={callLike}
          />
        </Box>
      </Paper>
    </ListItem>
  );
};

export default ViewPost;
