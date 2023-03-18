import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, TextField } from '@mui/material';

import ImageEditForm from '../Image/ImageEditForm';
import { CreatePostRequest, CreatePostResponse } from '../../api/types/post';
import { createPost } from '../../api/callApi';
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
  const [image, setImage] = useState<File | null>(null);

  const validate = (data: FormInputs) => {
    if (image && image.type.slice(0, 6) === 'image/') return true;
    if (!data.content.comment && data.content.comment !== '') return true;
    return false;
  };

  const onSubmit = async (data: FormInputs) => {
    if (!validate(data)) return;
    try {
      const r = await createPost(data, authToken);
      setResponse(r);
      reset();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <form onSubmit={onPromise(handleSubmit(onSubmit))}>
        <Box sx={{ display: 'flex', flexFlow: 'column' }}>
          <TextField
            sx={{ mt: 1 }}
            label='Post'
            type='string'
            InputLabelProps={{ shrink: true }}
            multiline
            maxRows={10}
            {...registerMui(
              register('content.comment', {
                maxLength: 140,
              })
            )}
          />
          <ImageEditForm image={image} setImage={setImage} />
          <Button variant='contained' color='primary' type='submit' sx={{ mt: 2 }}>
            投稿する
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditPosts;
