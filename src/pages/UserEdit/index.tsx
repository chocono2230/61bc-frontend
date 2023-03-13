import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Box, Button, TextField } from '@mui/material';

import registerMui from '../../utils/registerMui';
import { onPromise } from '../../utils/otherUtils';

import { UserContext } from '../../Top';

type FormInputs = {
  displayName: string;
};

const UserEdit = () => {
  const token = useAuthenticator((context) => [context.user])
    .user.getSignInUserSession()
    ?.getIdToken()
    .getJwtToken();
  const user = useContext(UserContext);
  const { register, handleSubmit } = useForm<FormInputs>({
    defaultValues: {
      displayName: user?.displayName || '',
    },
  });

  const onSubmit = (data: FormInputs) => {
    if (data.displayName === '') return;
    try {
      console.log(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <form onSubmit={onPromise(handleSubmit(onSubmit))}>
        <Box sx={{ display: 'flex', flexFlow: 'column', maxWidth: '500px' }}>
          <TextField
            sx={{ mb: 1, mt: 1 }}
            label='DisplayName'
            type='string'
            InputLabelProps={{ shrink: true }}
            {...registerMui(
              register('displayName', {
                maxLength: 30,
              })
            )}
          />
          <Button variant='contained' color='primary' type='submit'>
            Submit
          </Button>
        </Box>
      </form>
    </>
  );
};

export default UserEdit;
