import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import CssBaseline from '@mui/material/CssBaseline';
import '@aws-amplify/ui-react/styles.css';

import awsExports from './aws-exports';
import awsmobilemanual from './aws-exports-manual';
import Top from './Top';

Amplify.configure(awsExports);
Amplify.configure(awsmobilemanual);

const App = () => {
  return (
    <Authenticator loginMechanisms={['username']} hideSignUp={true}>
      <CssBaseline />
      <Top />
    </Authenticator>
  );
};

export default App;
