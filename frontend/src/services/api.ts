import { Post, CreatePostData, CreateCommentData, CreateLikeData, User, Comment, AuthResponse, LoginCredentials, RegisterData, CreatedBy } from '../types';

const API_BASE_URL = 'http://localhost:8080';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Auth endpoints
  async register(userData: RegisterData): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to register');
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to login');
    }
    
    const data = await response.json();
    this.setToken(data.token);
    return data;
  }

  // User endpoints
  async getAuthenticatedUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get user data');
    }
    
    return response.json();
  }

  async createUser(userData: Omit<User, 'id'>): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
  }

  async deleteUser(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  }

  // Post endpoints
  async createPost(postData: CreatePostData): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/post`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(postData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create post');
    }
    
    return response.json();
  }

  async getAllPosts(): Promise<Post[]> {
    const response = await fetch(`${API_BASE_URL}/post`, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    
    return response.json();
  }

  async deletePost(postId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/post?id=${postId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete post');
    }
  }

  // Comment endpoints
  async createComment(commentData: CreateCommentData): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/comment`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(commentData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create comment');
    }
  }

  async getCommentsByPostID(postId: string): Promise<Comment[]> {
    const response = await fetch(`${API_BASE_URL}/comments?postID=${postId}`, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }
    
    return response.json();
  }

  async deleteComment(commentId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/comment?id=${commentId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete comment');
    }
  }

  async updateComment(commentId: string, text: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/comment?id=${commentId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ text }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update comment');
    }
  }

  // Like endpoints
  async createLike(likeData: CreateLikeData): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/like`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(likeData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create like');
    }
  }

  async deleteLike(postId: string, email: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/like?postID=${postId}&email=${email}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete like');
    }
  }

  async getLikeCountByPostID(postId: string): Promise<{ likeCount: number }> {
    const response = await fetch(`${API_BASE_URL}/likes/count?postID=${postId}`, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch like count');
    }
    
    return response.json();
  }

  async getLikersByPostID(postId: string): Promise<CreatedBy[]> {
    const response = await fetch(`${API_BASE_URL}/likes/users?postID=${postId}`, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch likers');
    }
    
    return response.json();
  }
}

export const api = new ApiService();