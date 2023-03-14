import { useState, useEffect, useContext } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useParams } from 'react-router-dom';

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
  const { id } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [unknownUser, setUnknownUser] = useState<boolean>(false);
  const [faildLoading, setFaildLoading] = useState<boolean>(false);

  useEffect(() => {
    void (async () => {
      if (!token) return;
      try {
        const res = await getAllPost(token, id);
        if (res) {
          setPosts(res.posts);
        }
      } catch (err) {
        console.error(err);
        setFaildLoading(true);
      }
    })();
  }, [id, token]);

  return (
    <>
      <TimeLine posts={posts} users={usersMapContext?.usersMap ?? null} setUnknownUser={setUnknownUser} />
      <CustomizedSnackbar
        msg={'リロードしてユーザ情報を更新してください'}
        severity={'warning'}
        open={unknownUser}
        setOpen={setUnknownUser}
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
