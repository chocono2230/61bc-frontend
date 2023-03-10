import { useState, useEffect, createContext } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Container } from '@mui/material';

import { CreateUserRequest, User } from './api/types/user';
import { createUser } from './api/callApi';
import Test from './components/Test';
import Home from './pages/Home';

export const UserContext = createContext<User | null>(null);

const Top = () => {
  const [iuser, setIuser] = useState<User | null>(null);
  const { user } = useAuthenticator((context) => [context.user]);
  const token = user.getSignInUserSession()?.getIdToken().getJwtToken();
  useEffect(() => {
    void (async () => {
      const request: CreateUserRequest = {
        displayName: user?.username || '',
        identity: user?.attributes?.sub || '',
      };
      if (!token || request.displayName === '' || request.identity === '') return;
      try {
        const res = await createUser(request, token);
        if (res) {
          setIuser(res.user);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [token, user]);

  if (!user) return <></>;
  return (
    <Container maxWidth='sm'>
      <UserContext.Provider value={iuser}>
        <Test />
        <Home />
      </UserContext.Provider>
    </Container>
  );
};

export default Top;
