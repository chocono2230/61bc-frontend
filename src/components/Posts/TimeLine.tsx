import { useEffect } from 'react';
import { List } from '@mui/material';

import ViewPost from './ViewPost';
import { PublicUser } from '../../api/types/user';
import { Post, UpdateReactionResponse } from '../../api/types/post';

type Props = {
  posts: Post[];
  users: Map<string, PublicUser> | null;
  setUnknownUser: React.Dispatch<React.SetStateAction<boolean>>;
  userId?: string;
  authToken?: string;
  identity?: string;
  setDeletePostId?: React.Dispatch<React.SetStateAction<string>>;
  setLikeResponse: React.Dispatch<React.SetStateAction<UpdateReactionResponse | null>>;
};

const TimeLine = (props: Props) => {
  const { userId, authToken, identity, posts, users, setUnknownUser, setDeletePostId, setLikeResponse } = props;

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
            setDeletePostId={setDeletePostId}
            setLikeResponse={setLikeResponse}
          />
        );
      })}
    </List>
  );
};

export default TimeLine;
