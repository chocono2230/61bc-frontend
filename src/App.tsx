import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Container } from '@mui/material';

import awsExports from './aws-exports';
import awsmobilemanual from './aws-exports-manual';
Amplify.configure(awsExports);
Amplify.configure(awsmobilemanual);

import Test from './components/Test';
import Home from './pages/Home';

const App = () => {
  return (
    <Authenticator loginMechanisms={['username']} hideSignUp={true}>
      <Container maxWidth='sm'>
        <Test />
        <Home />
      </Container>
    </Authenticator>
  );
};

export default App;
