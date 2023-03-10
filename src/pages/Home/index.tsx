import { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { getAllPost } from '../../api/callApi';
import { CreatePostResponse, Post } from '../../api/types/post';
import TimeLine from '../../components/Posts/TimeLine';
import EditPosts from '../../components/Posts/EditPosts';

const Home = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  const token = user.getSignInUserSession()?.getIdToken().getJwtToken();
  const [posts, setPosts] = useState<Post[]>([]);
  const [response, setResponse] = useState<CreatePostResponse | null>(null);

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
    console.log(response);
    setPosts((prev) => [response, ...prev]);
  }, [response]);

  if (!user.attributes || !user.attributes.sub) return <></>;
  if (!token) return <></>;
  return (
    <>
      <EditPosts userId={user.attributes.sub} authToken={token} setResponse={setResponse} />
      <TimeLine posts={posts} />
    </>
  );
};

export default Home;
