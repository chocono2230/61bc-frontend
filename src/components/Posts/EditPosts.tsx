import { useForm } from 'react-hook-form';
import { CreatePostRequest } from '../../api/types';
import { createPost } from '../../api/callApi';
import { Box, Button, TextField } from '@mui/material';
import registerMui from '../../utils/registerMui';

type FormInputs = CreatePostRequest;
type Props = {
  userId: string;
  authToken: string;
};

const EditPosts = (props: Props) => {
  const { userId, authToken } = props;
  const { register, handleSubmit } = useForm<FormInputs>({
    defaultValues: {
      userId: userId,
      content: {},
    },
  });

  const onSubmit = async (data: FormInputs) => {
    if (!data.content.comment || data.content.comment === '') return;
    try {
      const r = await createPost(data, authToken);
      return r;
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  return (
    <>
      <form onSubmit={void handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexFlow: 'column', maxWidth: '500px' }}>
          <TextField
            sx={{ mr: 1, ml: 1 }}
            label='Time'
            type='string'
            InputLabelProps={{ shrink: true }}
            {...registerMui(
              register('content.comment', {
                maxLength: 140,
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

export default EditPosts;
