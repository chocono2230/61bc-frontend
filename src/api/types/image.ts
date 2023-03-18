import { hasProperty } from '../../utils/typeUtils';

export type Base64Image = {
  data: string;
};

export const isBase64Image = (image: unknown): image is Base64Image => {
  if (hasProperty(image, 'data') && typeof image.data === 'string') {
    return true;
  }
  return false;
};
