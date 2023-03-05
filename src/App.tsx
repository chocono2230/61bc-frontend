import { Amplify } from 'aws-amplify';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from './aws-exports';
import awsmobilemanual from './aws-exports-manual-dev';
Amplify.configure(awsExports);
Amplify.configure(awsmobilemanual);

import Test from './components/Test';

const App = () => {
  return (
    <Authenticator loginMechanisms={['username']} hideSignUp={true}>
      {({ signOut, user }) => (
        <>
          {user && <h1>Hello {user.username}</h1>}
          <Test />
          <button onClick={signOut}>Sign out</button>
        </>
      )}
    </Authenticator>
  );
};

export default App;
