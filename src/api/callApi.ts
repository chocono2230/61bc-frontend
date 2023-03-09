import { CreatePostRequest, CreatePostResponse, isCreatePostResponse } from './types';
import { API } from 'aws-amplify';

export const createPost = async (request: CreatePostRequest, authToken: string): Promise<CreatePostResponse | null> => {
  const payload = {
    headers: {
      Authorization: authToken,
    },
    body: request,
  };
  const response = (await API.post('api', '/posts', payload)) as unknown;
  if (isCreatePostResponse(response)) {
    return response;
  }
  return null;
};
