import { useRef } from 'react';
import Image from 'mui-image';

import { IconButton, Box, Typography } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';

type Props = {
  image: File | null;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
};

const ImageEditForm = (props: Props) => {
  const { image, setImage } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const getImageHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const img: File = e.target.files[0];
    setImage(img);
    console.log(img);
  };

  const showImage = () => {
    if (!image) return <></>;
    const showByte = (byte: number) => {
      if (byte < 1000) return `${byte} B`;
      if (byte < 1000 * 1000) return `${(byte / 1000).toFixed(2)} KB`;
      if (byte < 1000 * 1000 * 1000) return `${(byte / 1000 / 1000).toFixed(2)} MB`;
      return `${(byte / 1000 / 1000 / 1000).toFixed(2)} GB`;
    };
    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex' }}>
        <Typography variant='h6' sx={{ p: 1 }}>
          {image.name}
        </Typography>
        <Typography variant='h6' sx={{ p: 1 }}>
          {showByte(image.size)}
        </Typography>
      </Box>
    );
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <input type='file' accept='image/*' ref={inputRef} onChange={getImageHandle} hidden />
        <IconButton
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.click();
            }
          }}
        >
          <ImageIcon fontSize='large' />
        </IconButton>
        {showImage()}
      </Box>
      {image && <Image src={URL.createObjectURL(image)} fit='contain' height={'30vh'} />}
    </>
  );
};

export default ImageEditForm;
