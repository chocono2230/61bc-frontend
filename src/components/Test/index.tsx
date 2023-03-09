import { API } from 'aws-amplify';
import { useAuthenticator } from '@aws-amplify/ui-react';

import { CreatePostRequest } from '../../api/types';
import { createPost } from '../../api/callApi';

const Test = () => {
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  const handleClick = () => {
    void apiCall();
  };

  const apiCall = async () => {
    const token = user.getSignInUserSession()?.getIdToken().getJwtToken();
    const myInit = {
      headers: {
        Authorization: token,
      },
    };
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const res = await API.get('api', '/healthcheck', myInit);
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  const callCreatePost = async () => {
    const token = user.getSignInUserSession()?.getIdToken().getJwtToken();
    const attr = user.attributes;
    if (!attr || !attr.sub) return;
    if (!token) return;
    const d = new Date();
    const request: CreatePostRequest = {
      userId: attr.sub,
      content: {
        comment: 'test : ' + d.toISOString(),
      },
    };
    try {
      const res = await createPost(request, token);
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <button onClick={handleClick}>click me</button>
      <button
        onClick={() => {
          void callCreatePost();
        }}
      >
        PostPostsAPI
      </button>
      <button
        onClick={() => {
          void signOut();
        }}
      >
        signOut
      </button>
    </>
  );
};
export default Test;
