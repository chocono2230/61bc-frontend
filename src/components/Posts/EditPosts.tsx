import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, TextField, CircularProgress } from '@mui/material';
import imageCompression from 'browser-image-compression';

import ImageEditForm from '../Image/ImageEditForm';
import { PostImage, CreatePostRequest, CreatePostResponse, isCreatePostResponse } from '../../api/types/post';
import { createPost, putImage } from '../../api/callApi';
import registerMui from '../../utils/registerMui';
import { onPromise, generateUuid } from '../../utils/otherUtils';

type FormInputs = CreatePostRequest;
type Props = {
  userId: string;
  authToken: string;
  setResponse: React.Dispatch<React.SetStateAction<CreatePostResponse | null>>;
  start: boolean;
  setStart: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditPosts = (props: Props) => {
  const { userId, authToken, setResponse, start, setStart } = props;
  const { register, handleSubmit, reset } = useForm<FormInputs>({
    defaultValues: {
      userId: userId,
      content: {},
    },
  });
  const [image, setImage] = useState<File | null>(null);
  const [original, setOriginal] = useState<boolean>(false);

  const validate = (data: FormInputs) => {
    if (image && image.type.slice(0, 6) === 'image/') return true;
    if (data.content.comment && data.content.comment !== '') return true;
    return false;
  };

  const onSubmit = async (data: FormInputs) => {
    console.log(validate(data));
    if (!validate(data)) return;
    setStart(true);
    try {
      let payload = data;
      const promiseArray: Promise<unknown>[] = [];
      if (image) {
        const compressOption = {
          maxSizeMB: 0.05,
          maxWidthOrHeight: 1080,
          initialQuality: 0.85,
        };
        const compressedImage = await imageCompression(image, compressOption);
        const u = generateUuid();
        const img: PostImage = {
          originId: original ? generateUuid() : u,
          compressedId: u,
        };
        promiseArray.push(putImage(compressedImage, img.compressedId, authToken));
        if (original) {
          promiseArray.push(putImage(image, img.originId, authToken));
        }
        payload = {
          ...data,
          content: {
            ...data.content,
            image: {
              ...img,
            },
          },
        };
      }
      promiseArray.unshift(createPost(payload, authToken));
      const [r] = await Promise.all(promiseArray);
      if (isCreatePostResponse(r)) {
        setResponse(r);
      }
      reset();
      setImage(null);
      setStart(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <form onSubmit={onPromise(handleSubmit(onSubmit))}>
        <Box sx={{ display: 'flex', flexFlow: 'column' }}>
          <TextField
            sx={{ mt: 2 }}
            label='投稿'
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
          <ImageEditForm image={image} setImage={setImage} original={original} setOriginal={setOriginal} />
          <Button variant='contained' color='primary' type='submit' disabled={start} sx={{ mt: 2 }}>
            投稿する
          </Button>
        </Box>
      </form>
      {start && (
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
          <CircularProgress sx={{ mt: 2 }} />
        </Box>
      )}
    </Box>
  );
};

export default EditPosts;
