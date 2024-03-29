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
    image?: PostImage;
  };
  reactions?: number;
};

export type PostImage = {
  originId: string;
  compressedId: string;
};

export type CreatePostRequest = {
  userId: string;
  replyId?: string;
  content: {
    comment?: string;
    image?: PostImage;
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
  eskId?: string;
  eskTs?: number;
};

export type UpdateReactionRequest = {
  id: string;
  type: 'like';
  payload?: unknown;
};

export type UpdateReactionResponse = {
  post: Post;
};

export const isPostImage = (image: unknown): image is PostImage => {
  if (hasProperty(image, 'originId', 'compressedId')) {
    if (typeof image.originId === 'string' && typeof image.compressedId === 'string') {
      return true;
    }
  }
  return false;
};

export const isPost = (post: unknown): post is Post => {
  if (hasProperty(post, 'reactions')) {
    if (post.reactions != undefined && typeof post.reactions !== 'number') return false;
  }
  if (hasProperty(post, 'id', 'userId', 'timestamp', 'gsiSKey', 'content')) {
    if (
      typeof post.id === 'string' &&
      typeof post.userId === 'string' &&
      typeof post.timestamp === 'number' &&
      typeof post.gsiSKey === 'string'
    ) {
      if (post.content instanceof Object) {
        if (hasProperty(post.content, 'comment')) {
          if (typeof post.content.comment == 'string') return true;
        }
        if (hasProperty(post.content, 'image')) {
          if (isPostImage(post.content.image)) return true;
        }
      }
    }
  }
  return false;
};

export const isCreatePostRequest = (request: unknown): request is CreatePostRequest => {
  if (hasProperty(request, 'userId', 'content')) {
    if (typeof request.userId === 'string' && request.content instanceof Object) {
      if (hasProperty(request.content, 'comment')) {
        if (typeof request.content.comment === 'string') return true;
      }
      if (hasProperty(request.content, 'image')) {
        if (isPostImage(request.content.image)) return true;
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
  if (hasProperty(response, 'eskId')) {
    if (typeof response.eskId !== 'string') return false;
  }
  if (hasProperty(response, 'eskTs')) {
    if (typeof response.eskTs !== 'number') return false;
  }
  if (hasProperty(response, 'posts')) {
    if (Array.isArray(response.posts)) {
      if (response.posts.every((post) => isPost(post))) {
        return true;
      }
    }
  }
  return false;
};

export const isUpdateReactionResponse = (response: unknown): response is UpdateReactionResponse => {
  if (hasProperty(response, 'post')) {
    if (isPost(response.post)) {
      return true;
    }
  }
  return false;
};
