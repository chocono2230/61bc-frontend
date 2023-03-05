import { Amplify } from 'aws-amplify';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

const App = () => {
  return (
    <Authenticator loginMechanisms={['username']} hideSignUp={true}>
      {({ signOut, user }) => (
        <>
          {user && <h1>Hello {user.username}</h1>}
          <button onClick={signOut}>Sign out</button>
        </>
      )}
    </Authenticator>
  );
};

export default App;
