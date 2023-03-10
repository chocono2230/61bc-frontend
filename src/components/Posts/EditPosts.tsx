import { useForm } from 'react-hook-form';
import { CreatePostRequest, CreatePostResponse } from '../../api/types/post';
import { createPost } from '../../api/callApi';
import { Box, Button, TextField } from '@mui/material';
import registerMui from '../../utils/registerMui';
import { onPromise } from '../../utils/otherUtils';

type FormInputs = CreatePostRequest;
type Props = {
  userId: string;
  authToken: string;
  setResponse: React.Dispatch<React.SetStateAction<CreatePostResponse | null>>;
};

const EditPosts = (props: Props) => {
  const { userId, authToken, setResponse } = props;
  const { register, handleSubmit, reset } = useForm<FormInputs>({
    defaultValues: {
      userId: userId,
      content: {},
    },
  });

  const onSubmit = async (data: FormInputs) => {
    if (!data.content.comment || data.content.comment === '') return;
    try {
      const r = await createPost(data, authToken);
      setResponse(r);
      reset();
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
            label='Post'
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
