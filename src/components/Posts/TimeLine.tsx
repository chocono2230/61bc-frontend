import { List, ListItem, ListItemText } from '@mui/material';
import { Post } from '../../api/types/post';

type Props = {
  posts: Post[];
};

const viewPost = (post: Post) => {
  return (
    <ListItem key={post.id}>
      <ListItemText primary={post.content.comment} secondary={post.userId} />
    </ListItem>
  );
};

const TimeLine = (props: Props) => {
  const { posts } = props;
  return <List>{posts.map((post) => viewPost(post))}</List>;
};

export default TimeLine;
