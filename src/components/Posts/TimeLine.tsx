import { useEffect } from 'react';
import { List } from '@mui/material';

import ViewPost from './ViewPost';
import { PublicUser } from '../../api/types/user';
import { Post } from '../../api/types/post';

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

  return (
    <List>
      {posts.map((post) => {
        const user = users?.get(post.userId);
        const userName = user?.displayName || 'Unknown User';
        return (
          <ViewPost
            key={post.id}
            post={post}
            userName={userName}
            userId={userId}
            authToken={authToken}
            identity={identity}
          />
        );
      })}
    </List>
  );
};

export default TimeLine;
