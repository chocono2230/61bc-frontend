import { useEffect } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

import { PublicUser } from '../../api/types/user';
import { Post } from '../../api/types/post';

type Props = {
  posts: Post[];
  users: Map<string, PublicUser> | null;
  setUnknownUser: React.Dispatch<React.SetStateAction<boolean>>;
};

const viewPost = (post: Post, userName: string) => {
  return (
    <ListItem key={post.id}>
      <ListItemText primary={post.content.comment} secondary={userName} />
    </ListItem>
  );
};

const TimeLine = (props: Props) => {
  const { posts, users, setUnknownUser } = props;
  useEffect(() => {
    if (!users) return;
    const unknownUsers = posts.filter((post) => !users.get(post.userId));
    if (unknownUsers.length > 0) {
      setUnknownUser(true);
    }
  }, [users, posts, setUnknownUser]);

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
