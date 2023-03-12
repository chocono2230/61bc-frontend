import { useEffect } from 'react';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { PublicUser } from '../../api/types/user';
import { Post, DeletePostRequest } from '../../api/types/post';
import { deletePost } from '../../api/callApi';

type Props = {
  userId: string;
  authToken: string;
  identity: string;
  posts: Post[];
  users: Map<string, PublicUser> | null;
  setUnknownUser: React.Dispatch<React.SetStateAction<boolean>>;
};

const TimeLine = (props: Props) => {
  const { userId, authToken, identity, posts, users, setUnknownUser } = props;
  useEffect(() => {
    if (!users) return;
    const unknownUsers = posts.filter((post) => !users.get(post.userId));
    if (unknownUsers.length > 0) {
      setUnknownUser(true);
    }
  }, [users, posts, setUnknownUser]);

  const callDeletePost = async (postId: string) => {
    try {
      const req: DeletePostRequest = {
        id: postId,
        userId: userId,
        identity: identity,
      };
      await deletePost(req, authToken);
    } catch (e) {
      console.error(e);
    }
  };

  const viewPost = (post: Post, userName: string) => {
    return (
      <ListItem
        key={post.id}
        secondaryAction={
          <IconButton
            edge='end'
            aria-label='delete'
            onClick={() => {
              void callDeletePost(post.id);
            }}
          >
            <DeleteIcon />
          </IconButton>
        }
      >
        <ListItemText primary={post.content.comment} secondary={userName} />
      </ListItem>
    );
  };

  return (
    <List>
      {posts.map((post) => {
        const user = users?.get(post.userId);
        const userName = user?.displayName || 'Unknown User';
        return viewPost(post, userName);
      })}
    </List>
  );
};

export default TimeLine;
