export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  joining?: string;
}

export interface CreatedBy {
  id: string;
  name: string;
  email: string;
}

export interface Post {
  id: string;
  text: string;
  data: string; // base64 encoded image
  creatorInfo: CreatedBy;
  timestamp: number;
}

export interface Comment {
  id: string;
  postID: string;
  text: string;
  creatorInfo: CreatedBy;
}

export interface Like {
  id: string;
  postID: string;
  creatorInfo: CreatedBy;
}

export interface CreatePostData {
  text: string;
  data: string;
  creatorInfo: CreatedBy;
  timestamp: number;
}

export interface CreateCommentData {
  postID: string;
  text: string;
  creatorInfo: CreatedBy;
}

export interface CreateLikeData {
  postID: string;
  creatorInfo: CreatedBy;
}

export interface AuthResponse {
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  bio?: string;
  joining: string;
}