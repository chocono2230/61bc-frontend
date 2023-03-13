import { useState, useEffect, createContext } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Box, Container } from '@mui/material';

import { CreateUserRequest, PublicUser, User } from './api/types/user';
import { createUser, getAllPublicUser } from './api/callApi';
import Test from './components/Test';
import Home from './pages/Home';
import Header from './components/Header';

export const UserContext = createContext<User | null>(null);
export const UsersMapContext = createContext<Map<string, PublicUser> | null>(null);

const Top = () => {
  const [iuser, setIuser] = useState<User | null>(null);
  const [usersMap, setUsersMap] = useState<Map<string, PublicUser> | null>(null);
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

  useEffect(() => {
    void (async () => {
      if (!token) return;
      try {
        const res = await getAllPublicUser(token);
        if (res) {
          const map = new Map<string, PublicUser>();
          res.users.forEach((u) => {
            map.set(u.id, u);
          });
          setUsersMap(map);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [token]);

  if (!user) return <></>;
  return (
    <Box sx={{ margin: '0' }}>
      <Header />
      <Container maxWidth='sm'>
        <UserContext.Provider value={iuser}>
          <UsersMapContext.Provider value={usersMap}>
            <Test />
            <Home />
          </UsersMapContext.Provider>
        </UserContext.Provider>
      </Container>
    </Box>
  );
};

export default Top;
