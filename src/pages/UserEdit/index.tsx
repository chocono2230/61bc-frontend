import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Box, Button, TextField } from '@mui/material';

import registerMui from '../../utils/registerMui';
import { onPromise } from '../../utils/otherUtils';
import { putUser } from '../../api/callApi';
import { PutUserRequest } from '../../api/types/user';
import CustomizedSnackbar from '../../components/CustomizedSnackbar';

import { UserContext, UsersMapContext } from '../../Top';

type FormInputs = {
  displayName: string;
};

const UserEdit = () => {
  const token = useAuthenticator((context) => [context.user])
    .user.getSignInUserSession()
    ?.getIdToken()
    .getJwtToken();
  const userContext = useContext(UserContext);
  const usersMapContext = useContext(UsersMapContext);
  const { register, handleSubmit } = useForm<FormInputs>({
    defaultValues: {
      displayName: userContext?.user?.displayName || '',
    },
  });
  const [successApi, setSuccessApi] = useState<boolean>(false);

  const onSubmit = async (data: FormInputs) => {
    if (data.displayName === '' || !userContext || !userContext.user || !token) return;
    try {
      const req: PutUserRequest = {
        id: userContext.user.id,
        displayName: data.displayName,
        identity: userContext.user.identity,
      };
      const r = await putUser(req, token);
      if (r) {
        userContext.setUser(r.user);
        usersMapContext?.setUsersMap((prev) => {
          const newUsersMap = new Map(prev);
          newUsersMap.set(r.user.id, r.user);
          return newUsersMap;
        });
        setSuccessApi(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <form onSubmit={onPromise(handleSubmit(onSubmit))}>
        <Box sx={{ display: 'flex', flexFlow: 'column' }}>
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
      <CustomizedSnackbar
        open={successApi}
        setOpen={setSuccessApi}
        msg='ユーザ表示名を更新しました'
        severity='success'
        time={2000}
      />
    </>
  );
};

export default UserEdit;
