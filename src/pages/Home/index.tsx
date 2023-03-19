import { useState, useEffect, useContext } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Box, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { onPromise } from '../../utils/otherUtils';
import { getAllPost } from '../../api/callApi';
import { CreatePostResponse, Post, UpdateReactionResponse } from '../../api/types/post';
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
  const [likeResponse, setLikeResponse] = useState<UpdateReactionResponse | null>(null);
  const [eskId, setEskId] = useState<string>('');
  const [eskTs, setEskTs] = useState<number>(0);
  const [unknownUser, setUnknownUser] = useState<boolean>(false);
  const [deletePost, setDeletePost] = useState<boolean>(false);
  const [deletePostId, setDeletePostId] = useState<string>('');
  const [createPost, setCreatePost] = useState<boolean>(false);
  const [start, setStart] = useState<boolean>(false);
  const [allLoaded, setAllLoaded] = useState<boolean>(false);

  useEffect(() => {
    void (async () => {
      try {
        if (!token) return;
        const res = await getAllPost(token, '', '', 0);
        if (res) {
          setPosts(res.posts);
          if (res.eskId) setEskId(res.eskId);
          if (res.eskTs) setEskTs(res.eskTs);
          if (!res.eskId || !res.eskTs) setAllLoaded(true);
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
  }, [deletePostId, posts]);

  useEffect(() => {
    if (!likeResponse) return;
    setPosts((prev) => {
      const newPosts = [...prev];
      const idx = newPosts.findIndex((p) => p.id === likeResponse.post.id);
      if (idx >= 0) {
        newPosts[idx] = likeResponse.post;
      }
      return newPosts;
    });
  }, [likeResponse]);

  const addPosts = async () => {
    try {
      if (!token) return;
      const res = await getAllPost(token, '', eskId, eskTs);
      if (res) {
        setPosts((prev) => [...prev, ...res.posts]);
        if (res.eskId) setEskId(res.eskId);
        else setEskId('');
        if (res.eskTs) setEskTs(res.eskTs);
        else setEskTs(0);
        if (!res.eskId || !res.eskTs) setAllLoaded(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!token || !userContext || !userContext.user || !usersMapContext || !usersMapContext.usersMap) return <></>;
  return (
    <Box sx={{ mt: 2 }}>
      <EditPosts
        userId={userContext.user.id}
        authToken={token}
        setResponse={setResponse}
        start={start}
        setStart={setStart}
      />
      <TimeLine
        userId={userContext.user.id}
        authToken={token}
        identity={userContext.user.identity}
        posts={posts}
        users={usersMapContext.usersMap}
        setUnknownUser={setUnknownUser}
        setDeletePostId={setDeletePostId}
        setLikeResponse={setLikeResponse}
      />
      {eskId !== '' && (
        <Box sx={{ textAlign: 'center', m: 2 }}>
          <IconButton aria-label='add' color='primary' onClick={onPromise(addPosts)}>
            <AddCircleOutlineIcon sx={{ fontSize: 40 }} />
          </IconButton>
        </Box>
      )}
      <CustomizedSnackbar
        msg={'リロードしてユーザ情報を更新してください'}
        severity={'warning'}
        open={unknownUser}
        setOpen={setUnknownUser}
      />
      <CustomizedSnackbar
        msg={'投稿を削除しました'}
        severity={'success'}
        open={deletePost}
        setOpen={setDeletePost}
        time={2000}
      />
      <CustomizedSnackbar
        msg={'投稿しました'}
        severity={'success'}
        open={createPost}
        setOpen={setCreatePost}
        time={2000}
      />
      <CustomizedSnackbar msg={'投稿中です'} severity={'info'} open={start} setOpen={setStart} />
      <CustomizedSnackbar
        msg={'全ての投稿を読み込みました'}
        severity={'info'}
        open={allLoaded}
        setOpen={setAllLoaded}
        time={2000}
      />
    </Box>
  );
};

export default Home;
