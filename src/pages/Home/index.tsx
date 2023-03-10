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
  const userContext = useContext(UserContext);
  const usersMapContext = useContext(UsersMapContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [response, setResponse] = useState<CreatePostResponse | null>(null);
  const [unknownUser, setUnknownUser] = useState<boolean>(false);
  const [deletePost, setDeletePost] = useState<boolean>(false);
  const [deletePostId, setDeletePostId] = useState<string>('');
  const [createPost, setCreatePost] = useState<boolean>(false);

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
    setCreatePost(true);
  }, [response]);

  useEffect(() => {
    if (deletePostId === '') return;
    setPosts((prev) => prev.filter((p) => p.id !== deletePostId));
    setDeletePost(true);
  }, [deletePostId]);

  if (!token || !userContext || !userContext.user || !usersMapContext || !usersMapContext.usersMap) return <></>;
  return (
    <>
      <EditPosts userId={userContext.user.id} authToken={token} setResponse={setResponse} />
      <TimeLine
        userId={userContext.user.id}
        authToken={token}
        identity={userContext.user.identity}
        posts={posts}
        users={usersMapContext.usersMap}
        setUnknownUser={setUnknownUser}
        setDeletePostId={setDeletePostId}
      />
      <CustomizedSnackbar
        msg={'????????????????????????????????????????????????????????????'}
        serverity={'warning'}
        open={unknownUser}
        setOpen={setUnknownUser}
      />
      <CustomizedSnackbar
        msg={'???????????????????????????'}
        serverity={'success'}
        open={deletePost}
        setOpen={setDeletePost}
        time={2000}
      />
      <CustomizedSnackbar
        msg={'??????????????????'}
        serverity={'success'}
        open={createPost}
        setOpen={setCreatePost}
        time={2000}
      />
    </>
  );
};

export default Home;
