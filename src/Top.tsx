import { useState, useEffect, createContext } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Container } from '@mui/material';

import { CreateUserRequest, PublicUser, User } from './api/types/user';
import { createUser, getAllPublicUser } from './api/callApi';
import Router from './Router';
import ImageProvider from './context/image';

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

type UsersMapContextType = {
  usersMap: Map<string, PublicUser> | null;
  setUsersMap: React.Dispatch<React.SetStateAction<Map<string, PublicUser> | null>>;
};

export const UserContext = createContext<UserContextType | null>(null);
export const UsersMapContext = createContext<UsersMapContextType | null>(null);

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
        const p1 = createUser(request, token);
        const p2 = getAllPublicUser(token);
        const [res, res2] = await Promise.all([p1, p2]);
        if (res) {
          setIuser(res.user);
        }
        if (res2) {
          const map = new Map<string, PublicUser>();
          res2.users.forEach((u) => {
            map.set(u.id, u);
          });
          if (res) {
            const r = map.get(res.user.id);
            if (!r) {
              map.set(res.user.id, res.user);
            }
          }
          setUsersMap(map);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [token, user]);

  if (!user) return <></>;
  return (
    <ImageProvider>
      <UserContext.Provider value={{ user: iuser, setUser: setIuser }}>
        <UsersMapContext.Provider value={{ usersMap, setUsersMap }}>
          <Container maxWidth='sm'>
            <Router />
          </Container>
        </UsersMapContext.Provider>
      </UserContext.Provider>
    </ImageProvider>
  );
};

export default Top;
