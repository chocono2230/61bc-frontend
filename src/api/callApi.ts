import {
  CreatePostRequest,
  CreatePostResponse,
  GetAllPostResponse,
  DeletePostRequest,
  isCreatePostResponse,
  isGetAllPostResponse,
} from './types/post';
import { GetAllUsersResponse, isGetAllUsersResponse } from './types/user';
import { API } from 'aws-amplify';
import { CreateUserRequest, CreateUserResponse, isCreateUserResponse } from './types/user';

export const createPost = async (request: CreatePostRequest, authToken: string): Promise<CreatePostResponse | null> => {
  const payload = createPayload(authToken, request);
  const response = (await API.post('api', '/posts', payload)) as unknown;
  if (isCreatePostResponse(response)) {
    return response;
  }
  return null;
};

export const getAllPost = async (authToken: string, userId?: string): Promise<GetAllPostResponse | null> => {
  const payload = createPayload(authToken);
  const path = userId ? `/posts/${userId}` : '/posts';
  const response = (await API.get('api', path, payload)) as unknown;
  if (isGetAllPostResponse(response)) {
    return response;
  }
  return null;
};

export const createUser = async (request: CreateUserRequest, authToken: string): Promise<CreateUserResponse | null> => {
  const payload = createPayload(authToken, request);
  const response = (await API.post('api', '/users', payload)) as unknown;
  if (isCreateUserResponse(response)) {
    return response;
  }
  return null;
};

export const getAllPublicUser = async (authToken: string): Promise<GetAllUsersResponse | null> => {
  const payload = createPayload(authToken);
  const response = (await API.get('api', '/users', payload)) as unknown;
  if (isGetAllUsersResponse(response)) {
    return response;
  }
  return null;
};

export const deletePost = async (request: DeletePostRequest, authToken: string): Promise<void> => {
  const payload = createPayload(authToken, request);
  const path = `/posts/${request.id}`;
  await API.del('api', path, payload);
};

const createPayload = (authToken: string, body?: unknown) => {
  const payload: {
    headers: {
      Authorization: string;
    };
    body?: unknown;
  } = {
    headers: {
      Authorization: authToken,
    },
  };
  if (body) {
    payload.body = body;
  }
  return payload;
};
