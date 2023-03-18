import { useState } from 'react';

import { onPromise } from '../../utils/otherUtils';
import { Base64Image } from '../../api/types/image';
import { putImage, getImage } from '../../api/callApi';

type Props = {
  authToken: string;
};

const ImageEdit = (props: Props) => {
  const { authToken } = props;
  const [image] = useState<File | null>(null);
  const [b64Image, setB64Image] = useState<Base64Image | null>(null);

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
      const r = await getImage('tst.JPG', authToken);
      setB64Image(r);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <form>
        {/* <MuiFileInput value={image} onChange={getImageHandle} size='small' hideSizeText /> */}
        <input type='button' value='保存' onClick={onPromise(submitImage)} />
      </form>
      <button type='button' onClick={onPromise(getImageUrl)}>
        チェック
      </button>
      {b64Image && <img src={'data:image/jpeg;base64,' + b64Image.data} alt='test' />}
    </>
  );
};

export default ImageEdit;
