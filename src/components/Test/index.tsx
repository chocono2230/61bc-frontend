import { Container } from '@mui/material';
import { API } from 'aws-amplify';
import { useAuthenticator } from '@aws-amplify/ui-react';

const Test = () => {
  const { user } = useAuthenticator((context) => [context.user]);

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
  return (
    <>
      <Container maxWidth='sm'>
        <button onClick={handleClick}>click me</button>
      </Container>
    </>
  );
};
export default Test;
