import { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { getAllPost } from '../../api/callApi';
import { CreatePostResponse, Post } from '../../api/types';
import TimeLine from '../../components/Posts/TimeLine';
import EditPosts from '../../components/Posts/EditPosts';

const Home = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  const token = user.getSignInUserSession()?.getIdToken().getJwtToken();
  if (!user.attributes || !user.attributes.sub) return <></>;
  if (!token) return <></>;
  const [posts, setPosts] = useState<Post[]>([]);
  const [response, setResponse] = useState<CreatePostResponse | null>(null);

  useEffect(() => {
    void (async () => {
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

  useEffect(() => {
    if (!response) return;
    console.log(response);
    setPosts((prev) => [response, ...prev]);
  }, [response]);

  return (
    <>
      <EditPosts userId={user.attributes.sub} authToken={token} setResponse={setResponse} />
      <TimeLine posts={posts} />
    </>
  );
};

export default Home;
