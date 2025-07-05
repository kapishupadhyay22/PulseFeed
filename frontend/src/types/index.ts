export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Post {
  id: string;
  text: string;
  data: string; // base64 encoded image
  creatorInfo: User;
  timestamp: number;
}

export interface Comment {
  id: string;
  postID: string;
  text: string;
  creatorInfo: User;
}

export interface Like {
  id: string;
  postID: string;
  creatorInfo: User;
}

export interface CreatePostData {
  text: string;
  data: string;
  creatorInfo: User;
  timestamp: number;
}

export interface CreateCommentData {
  postID: string;
  text: string;
  creatorInfo: User;
}

export interface CreateLikeData {
  postID: string;
  creatorInfo: User;
}