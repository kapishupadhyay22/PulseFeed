import { Post, CreatePostData, CreateCommentData, CreateLikeData, User, Comment } from '../types';

const API_BASE_URL = 'http://localhost:8080';

export const api = {
  // User endpoints
  async createUser(userData: Omit<User, 'id'>): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
  },

  async deleteUser(email: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/user?email=${email}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  },

  // Post endpoints
  async createPost(postData: CreatePostData): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create post');
    }
    
    return response.json();
  },

  async getAllPosts(): Promise<Post[]> {
    const response = await fetch(`${API_BASE_URL}/post`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    
    return response.json();
  },

  // Comment endpoints
  async createComment(commentData: CreateCommentData): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create comment');
    }
  },

  async getCommentsByPostID(postId: string): Promise<Comment[]> {
    const response = await fetch(`${API_BASE_URL}/comments?postID=${postId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }
    
    return response.json();
  },

  async deleteComment(commentId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/comment?id=${commentId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete comment');
    }
  },

  // Like endpoints
  async createLike(likeData: CreateLikeData): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(likeData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create like');
    }
  },

  async deleteLike(postId: string, email: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/like?postID=${postId}&email=${email}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete like');
    }
  },

  async getLikeCountByPostID(postId: string): Promise<{ likeCount: number }> {
    const response = await fetch(`${API_BASE_URL}/likes/count?postID=${postId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch like count');
    }
    
    return response.json();
  },

  async getLikersByPostID(postId: string): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/likes/users?postID=${postId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch likers');
    }
    
    return response.json();
  },
};