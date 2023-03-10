import {
  CreatePostRequest,
  CreatePostResponse,
  GetAllPostResponse,
  isCreatePostResponse,
  isGetAllPostResponse,
} from './types/post';
import { API } from 'aws-amplify';
import { CreateUserRequest, CreateUserResponse, isCreateUserResponse } from './types/user';

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

export const getAllPost = async (authToken: string, userId?: string): Promise<GetAllPostResponse | null> => {
  const payload = {
    headers: {
      Authorization: authToken,
    },
  };
  const path = userId ? `/posts/${userId}` : '/posts';
  const response = (await API.get('api', path, payload)) as unknown;
  if (isGetAllPostResponse(response)) {
    return response;
  }
  return null;
};

export const createUser = async (request: CreateUserRequest, authToken: string): Promise<CreateUserResponse | null> => {
  const payload = {
    headers: {
      Authorization: authToken,
    },
    body: request,
  };
  const response = (await API.post('api', '/users', payload)) as unknown;
  if (isCreateUserResponse(response)) {
    return response;
  }
  return null;
};
