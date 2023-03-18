import { hasProperty } from '../../utils/typeUtils';

export type Post = {
  id: string;
  userId: string;
  timestamp: number;
  gsiSKey: string;
  replyId?: string;
  lastReplyId?: string;
  content: {
    comment?: string;
    image?: Image;
  };
  reactions?: object[];
};

export type Image = {
  originId: string;
  compressedId: string;
};

export type CreatePostRequest = {
  userId: string;
  replyId?: string;
  content: {
    comment?: string;
    image?: Image;
  };
};

export type CreatePostResponse = Post;

export type DeletePostRequest = {
  id: string;
  userId: string;
  identity: string;
};

export type GetAllPostResponse = {
  posts: Post[];
};

export const isImage = (image: unknown): image is Image => {
  if (hasProperty(image, 'originId', 'compressedId')) {
    if (typeof image.originId === 'string' && typeof image.compressedId === 'string') {
      return true;
    }
  }
  return false;
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
        if (hasProperty(post.content, 'comment', 'image')) {
          if (post.content.comment === undefined && post.content.image === undefined) return false;
          if (typeof post.content.comment === 'string' || post.content.comment === undefined) {
            if (post.content.image === undefined || isImage(post.content.image)) {
              return true;
            }
          }
        }
      }
    }
  }
  return false;
};

export const isCreatePostRequest = (request: unknown): request is CreatePostRequest => {
  if (hasProperty(request, 'userId', 'content')) {
    if (typeof request.userId === 'string' && request.content instanceof Object) {
      if (hasProperty(request.content, 'comment', 'image')) {
        if (request.content.comment === undefined && request.content.image === undefined) return false;
        if (typeof request.content.comment === 'string' || request.content.comment === undefined) {
          if (request.content.image === undefined || isImage(request.content.image)) {
            return true;
          }
        }
      }
    }
  }
  return false;
};

export const isCreatePostResponse = (response: unknown): response is CreatePostResponse => {
  if (isPost(response)) {
    return true;
  }
  return false;
};

export const isGetAllPostResponse = (response: unknown): response is GetAllPostResponse => {
  if (hasProperty(response, 'posts')) {
    if (Array.isArray(response.posts)) {
      if (response.posts.every((post) => isPost(post))) {
        return true;
      }
    }
  }
  return false;
};
