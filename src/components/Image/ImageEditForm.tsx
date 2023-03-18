import { useRef } from 'react';
import Image from 'mui-image';

import { IconButton, Box, Typography, Switch, FormControlLabel } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';

type Props = {
  image: File | null;
  original: boolean;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
  setOriginal: React.Dispatch<React.SetStateAction<boolean>>;
};

const ImageEditForm = (props: Props) => {
  const { image, setImage, original, setOriginal } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const getImageHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const img: File = e.target.files[0];
    setImage(img);
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
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
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

        <FormControlLabel
          control={
            <Switch
              checked={original}
              onChange={() => {
                setOriginal(!original);
              }}
            />
          }
          label='圧縮前画像も送信する'
        />
        {showImage()}
      </Box>
      {image && <Image src={URL.createObjectURL(image)} fit='contain' height={'30vh'} duration={100} />}
    </>
  );
};

export default ImageEditForm;
