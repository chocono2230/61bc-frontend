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
  const [unknownUser, setUnknownUser] = useState<boolean>(false);
  const [deletePost, setDeletePost] = useState<boolean>(false);
  const [deletePostId, setDeletePostId] = useState<string>('');

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

  useEffect(() => {
    if (deletePostId === '') return;
    setPosts((prev) => prev.filter((p) => p.id !== deletePostId));
    setDeletePost(true);
  }, [deletePostId]);

  if (!token || !user) return <></>;
  return (
    <>
      <EditPosts userId={user.id} authToken={token} setResponse={setResponse} />
      <TimeLine
        userId={user.id}
        authToken={token}
        identity={user.identity}
        posts={posts}
        users={usersMap}
        setUnknownUser={setUnknownUser}
        setDeletePostId={setDeletePostId}
      />
      <CustomizedSnackbar
        msg={'リロードしてユーザ情報を更新してください'}
        serverity={'warning'}
        open={unknownUser}
        setOpen={setUnknownUser}
      />
      <CustomizedSnackbar
        msg={'投稿を削除しました'}
        serverity={'success'}
        open={deletePost}
        setOpen={setDeletePost}
        time={2000}
      />
    </>
  );
};

export default Home;
