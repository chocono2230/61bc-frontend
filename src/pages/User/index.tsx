import { useState, useEffect, useContext } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useParams } from 'react-router-dom';

import { UserContext } from '../../Top';
import { UsersMapContext } from '../../Top';
import { getAllPost } from '../../api/callApi';
import { Post } from '../../api/types/post';
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
  const [unknownUser, setUnknownUser] = useState<boolean>(false);
  const [faildLoading, setFaildLoading] = useState<boolean>(false);
  const [deletePost, setDeletePost] = useState<boolean>(false);
  const [deletePostId, setDeletePostId] = useState<string>('');

  useEffect(() => {
    void (async () => {
      if (!token || !id) return;
      try {
        const res = await getAllPost(token, id, '', 0);
        if (res) {
          setPosts(res.posts);
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
      />
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
    </>
  );
};

export default User;
