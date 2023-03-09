import { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { getAllPost } from '../../api/callApi';
import { Post } from '../../api/types';
import TimeLine from '../../components/Posts/TimeLine';

const Home = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    void (async () => {
      if (!user) return;
      const token = user.getSignInUserSession()?.getIdToken().getJwtToken();
      if (!token) return;
      try {
        const res = await getAllPost(token);
        if (res) {
          setPosts(res.posts);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <>
      <TimeLine posts={posts} />
    </>
  );
};

export default Home;
