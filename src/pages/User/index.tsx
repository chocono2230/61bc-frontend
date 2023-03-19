import { useState, useEffect, useContext } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Box, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useParams } from 'react-router-dom';

import { onPromise } from '../../utils/otherUtils';
import { UserContext } from '../../Top';
import { UsersMapContext } from '../../Top';
import { getAllPost } from '../../api/callApi';
import { Post, UpdateReactionResponse } from '../../api/types/post';
import TimeLine from '../../components/Posts/TimeLine';
import CustomizedSnackbar from '../../components/CustomizedSnackbar';

const User = () => {
  const token = useAuthenticator((context) => [context.user])
    .user.getSignInUserSession()
    ?.getIdToken()
    .getJwtToken();
  const usersMapContext = useContext(UsersMapContext);
  const userContext = useContext(UserContext);
  const { id } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [eskId, setEskId] = useState<string>('');
  const [eskTs, setEskTs] = useState<number>(0);
  const [unknownUser, setUnknownUser] = useState<boolean>(false);
  const [faildLoading, setFaildLoading] = useState<boolean>(false);
  const [deletePost, setDeletePost] = useState<boolean>(false);
  const [deletePostId, setDeletePostId] = useState<string>('');
  const [likeResponse, setLikeResponse] = useState<UpdateReactionResponse | null>(null);
  const [allLoaded, setAllLoaded] = useState<boolean>(false);

  useEffect(() => {
    void (async () => {
      if (!token || !id) return;
      try {
        const res = await getAllPost(token, id, '', 0);
        if (res) {
          setPosts(res.posts);
          if (res.eskId) setEskId(res.eskId);
          if (res.eskTs) setEskTs(res.eskTs);
          if (!res.eskId || !res.eskTs) setAllLoaded(true);
        }
      } catch (err) {
        console.error(err);
        setFaildLoading(true);
      }
    })();
  }, [id, token]);

  useEffect(() => {
    if (deletePostId === '') return;
    setPosts((prev) => prev.filter((p) => p.id !== deletePostId));
    setDeletePost(true);
  }, [deletePostId]);

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
      if (!token || !id) return;
      const res = await getAllPost(token, id, eskId, eskTs);
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

  return (
    <>
      <TimeLine
        posts={posts}
        users={usersMapContext?.usersMap ?? null}
        setUnknownUser={setUnknownUser}
        userId={userContext?.user?.id}
        authToken={token}
        identity={userContext?.user?.identity}
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
        msg={'投稿の取得に失敗しました'}
        severity={'error'}
        open={faildLoading}
        setOpen={setFaildLoading}
      />
      <CustomizedSnackbar
        msg={'全ての投稿を読み込みました'}
        severity={'info'}
        open={allLoaded}
        setOpen={setAllLoaded}
        time={2000}
      />
    </>
  );
};

export default User;
