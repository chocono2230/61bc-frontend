import {
  CreatePostRequest,
  CreatePostResponse,
  GetAllPostResponse,
  isCreatePostResponse,
  isGetAllPostResponse,
} from './types';
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

export const getAllPost = async (authToken: string): Promise<GetAllPostResponse | null> => {
  const payload = {
    headers: {
      Authorization: authToken,
    },
  };
  const response = (await API.get('api', '/posts', payload)) as unknown;
  if (isGetAllPostResponse(response)) {
    return response;
  }
  return null;
};
