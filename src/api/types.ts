import { hasProperty } from '../utils/typeUtils';

export type Post = {
  id: string;
  userId: string;
  timestamp: number;
  gsiSKey: string;
  replyId?: string;
  lastReplyId?: string;
  content: {
    comment?: string;
  };
  reactions?: object[];
};

export type CreatePostRequest = {
  userId: string;
  replyId?: string;
  content: {
    comment?: string;
  };
};

export type CreatePostResponse = {
  post: Post;
};

export const isPost = (post: unknown): post is Post => {
  if (hasProperty(post, 'id', 'userId', 'timestamp', 'gsiSKey', 'content')) {
    if (
      typeof post.id === 'string' &&
      typeof post.userId === 'string' &&
      typeof post.timestamp === 'number' &&
      typeof post.gsiSKey === 'string'
    ) {
      if (post.content instanceof Object) {
        if (hasProperty(post.content, 'comment') && typeof post.content.comment === 'string') {
          return true;
        }
      }
    }
  }
  return false;
};

export const isCreatePostRequest = (request: unknown): request is CreatePostRequest => {
  if (hasProperty(request, 'userId', 'content')) {
    if (typeof request.userId === 'string' && request.content instanceof Object) {
      if (hasProperty(request.content, 'comment') && typeof request.content.comment === 'string') {
        return true;
      }
    }
  }
  return false;
};

export const isCreatePostResponse = (response: unknown): response is CreatePostResponse => {
  if (hasProperty(response, 'post')) {
    if (isPost(response.post)) {
      return true;
    }
  }
  return false;
};
