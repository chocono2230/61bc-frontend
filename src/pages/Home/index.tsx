import { useState, useEffect, useContext } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { getAllPost } from '../../api/callApi';
import { CreatePostResponse, Post } from '../../api/types/post';
import TimeLine from '../../components/Posts/TimeLine';
import EditPosts from '../../components/Posts/EditPosts';
import { UserContext, UsersMapContext } from '../../Top';
import CustomizedSnackbar from '../../components/CustomizedSnackbar';

const Home = () => {
  const token = useAuthenticator((context) => [context.user])
    .user.getSignInUserSession()
    ?.getIdToken()
    .getJwtToken();
  const user = useContext(UserContext);
  const usersMap = useContext(UsersMapContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [response, setResponse] = useState<CreatePostResponse | null>(null);
  const [unknownUser, setUnknownUser] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        if (!token) return;
        const res = await getAllPost(token);
        if (res) {
          setPosts(res.posts);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (!response) return;
    setPosts((prev) => [response, ...prev]);
  }, [response]);

  if (!token || !user) return <></>;
  return (
    <>
      <EditPosts userId={user.id} authToken={token} setResponse={setResponse} />
      <TimeLine posts={posts} users={usersMap} setUnknownUser={setUnknownUser} />
      <CustomizedSnackbar
        msg={'リロードしてユーザ情報を更新してください'}
        serverity={'warning'}
        open={unknownUser}
        setOpen={setUnknownUser}
      />
    </>
  );
};

export default Home;
