/* eslint-disable @typescript-eslint/no-misused-promises */
import { useState } from 'react';

import { Base64Image } from '../../api/types/image';
import { putImage, getImage } from '../../api/callApi';

type Props = {
  authToken: string;
};

const ImageEdit = (props: Props) => {
  const { authToken } = props;
  const [image, setImage] = useState<File>();
  const [b64Image, setB64Image] = useState<Base64Image | null>(null);

  const getImageHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const img: File = e.target.files[0];
    setImage(img);
  };

  const submitImage = async () => {
    try {
      if (!image) return;
      await putImage(image, authToken);
    } catch (e) {
      console.error(e);
    }
  };

  const getImageUrl = async () => {
    try {
      const r = await getImage('tstss.jpg', authToken);
      setB64Image(r);
    } catch (e) {
      console.error(e);
    }
  };
  console.log(b64Image);
  return (
    <>
      <form>
        <label htmlFor='img'>画像</label>
        <input id='img' type='file' accept='image/*,.png,.jpg,.jpeg,.gif' onChange={getImageHandle} />
        <input type='button' value='保存' onClick={submitImage} />
      </form>
      <button type='button' onClick={getImageUrl}>
        チェック
      </button>
    </>
  );
};

export default ImageEdit;
