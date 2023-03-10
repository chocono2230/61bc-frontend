import { hasProperty } from '../../utils/typeUtils';

export type User = {
  id: string;
  displayName: string;
  identity: string;
};

export type PublicUser = {
  id: string;
  displayName: string;
};

export type CreateUserRequest = {
  displayName: string;
  identity: string;
};

export type CreateUserResponse = {
  user: User;
};

export const isUser = (user: unknown): user is User => {
  if (hasProperty(user, 'id', 'displayName', 'identity')) {
    if (typeof user.id === 'string' && typeof user.displayName === 'string' && typeof user.identity === 'string') {
      return true;
    }
  }
  return false;
};

export const isPublicUser = (user: unknown): user is PublicUser => {
  if (hasProperty(user, 'id', 'displayName')) {
    if (typeof user.id === 'string' && typeof user.displayName === 'string') {
      return true;
    }
  }
  return false;
};

export const isCreateUserRequest = (request: unknown): request is CreateUserRequest => {
  if (hasProperty(request, 'displayName', 'identity')) {
    if (typeof request.displayName === 'string' && typeof request.identity === 'string') {
      return true;
    }
  }
  return false;
};

export const isCreateUserResponse = (response: unknown): response is CreateUserResponse => {
  if (hasProperty(response, 'user')) {
    if (isUser(response.user)) {
      return true;
    }
  }
  return false;
};
