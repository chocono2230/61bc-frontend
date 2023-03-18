import {
  CreatePostRequest,
  CreatePostResponse,
  GetAllPostResponse,
  DeletePostRequest,
  isCreatePostResponse,
  isGetAllPostResponse,
} from './types/post';
import {
  GetAllUsersResponse,
  isGetAllUsersResponse,
  PutUserRequest,
  PutUserResponse,
  isPutUserResponse,
} from './types/user';
import { API } from 'aws-amplify';
import { CreateUserRequest, CreateUserResponse, isCreateUserResponse } from './types/user';
import { Base64Image, isBase64Image } from './types/image';

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
  const path = userId ? `/posts?userid=${userId}` : '/posts';
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

export const putUser = async (request: PutUserRequest, authToken: string): Promise<PutUserResponse | null> => {
  const payload = createPayload(authToken, request);
  const path = `/users/${request.id}`;
  const response = (await API.put('api', path, payload)) as unknown;
  if (isPutUserResponse(response)) {
    return response;
  }
  return null;
};

export const putImage = async (file: File, authToken: string): Promise<void> => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      const base64 = reader.result as string;
      const data = base64.split(',')[1];
      try {
        const p: Base64Image = { data };
        const payload = createPayload(authToken, p);
        console.log(payload);
        await API.put('api', `/images/${file.name}`, payload);
        resolve();
      } catch (e) {
        console.error(e);
        reject(e);
      }
    };
    reader.readAsDataURL(file);
  });
};

export const getImage = async (id: string, authToken: string): Promise<Base64Image | null> => {
  const payload = createPayload(authToken);
  const response = (await API.get('api', `/images/${id}`, payload)) as unknown;
  if (isBase64Image(response)) {
    return response;
  }
  return null;
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
