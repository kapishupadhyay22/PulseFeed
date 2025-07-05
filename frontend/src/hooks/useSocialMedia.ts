import { useState, useEffect } from 'react';
import { Post, User, Comment } from '../types';
import { api } from '../services/api';

const samplePosts: Post[] = [
  {
    id: 'sample-1',
    text: 'Welcome to our social media platform! 🎉 Share your thoughts and connect with others.',
    data: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
    creatorInfo: {
      id: 'sample-user-1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com'
    },
    timestamp: Date.now() - 3600000 // 1 hour ago
  },
  {
    id: 'sample-2',
    text: 'Beautiful sunset from my evening walk today. Nature never fails to amaze me! 🌅',
    data: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800',
    creatorInfo: {
      id: 'sample-user-2',
      name: 'Mike Chen',
      email: 'mike@example.com'
    },
    timestamp: Date.now() - 7200000 // 2 hours ago
  },
  {
    id: 'sample-3',
    text: 'Just finished reading an amazing book on productivity. Highly recommend "Atomic Habits" by James Clear! 📚',
    data: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800',
    creatorInfo: {
      id: 'sample-user-3',
      name: 'Emma Davis',
      email: 'emma@example.com'
    },
    timestamp: Date.now() - 10800000 // 3 hours ago
  },
  {
    id: 'sample-4',
    text: 'Coffee and code - the perfect combination for a productive morning! ☕️💻',
    data: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800',
    creatorInfo: {
      id: 'sample-user-4',
      name: 'Alex Rodriguez',
      email: 'alex@example.com'
    },
    timestamp: Date.now() - 14400000 // 4 hours ago
  }
];

export const useSocialMedia = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<{ [postId: string]: Comment[] }>({});
  const [likes, setLikes] = useState<{ [postId: string]: { count: number; users: User[]; isLiked: boolean } }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentUser: User = {
    id: 'current-user',
    name: 'John Doe',
    email: 'john@example.com'
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await api.getAllPosts();
      const sortedPosts = fetchedPosts.sort((a, b) => b.timestamp - a.timestamp);
      setPosts(sortedPosts);
      
      // Fetch comments and likes for each post
      for (const post of sortedPosts) {
        await fetchCommentsForPost(post.id);
        await fetchLikesForPost(post.id);
      }
    } catch (err) {
      console.warn('API unavailable, using sample posts:', err);
      setPosts(samplePosts.sort((a, b) => b.timestamp - a.timestamp));
      
      // Initialize empty comments and likes for sample posts
      const emptyComments: { [postId: string]: Comment[] } = {};
      const emptyLikes: { [postId: string]: { count: number; users: User[]; isLiked: boolean } } = {};
      
      samplePosts.forEach(post => {
        emptyComments[post.id] = [];
        emptyLikes[post.id] = { count: 0, users: [], isLiked: false };
      });
      
      setComments(emptyComments);
      setLikes(emptyLikes);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommentsForPost = async (postId: string) => {
    try {
      const postComments = await api.getCommentsByPostID(postId);
      setComments(prev => ({ ...prev, [postId]: postComments }));
    } catch (err) {
      console.warn(`Failed to fetch comments for post ${postId}:`, err);
      setComments(prev => ({ ...prev, [postId]: [] }));
    }
  };

  const fetchLikesForPost = async (postId: string) => {
    try {
      const [likeCount, likers] = await Promise.all([
        api.getLikeCountByPostID(postId),
        api.getLikersByPostID(postId)
      ]);
      
      const isLiked = likers.some(user => user.email === currentUser.email);
      
      setLikes(prev => ({
        ...prev,
        [postId]: {
          count: likeCount.likeCount,
          users: likers,
          isLiked
        }
      }));
    } catch (err) {
      console.warn(`Failed to fetch likes for post ${postId}:`, err);
      setLikes(prev => ({ ...prev, [postId]: { count: 0, users: [], isLiked: false } }));
    }
  };

  const createPost = async (text: string, imageData: string) => {
    try {
      const postData = {
        text,
        data: imageData,
        creatorInfo: currentUser,
        timestamp: Date.now()
      };
      
      const newPost = await api.createPost(postData);
      setPosts(prev => [newPost, ...prev]);
      
      // Initialize empty comments and likes for new post
      setComments(prev => ({ ...prev, [newPost.id]: [] }));
      setLikes(prev => ({ ...prev, [newPost.id]: { count: 0, users: [], isLiked: false } }));
    } catch (err) {
      setError('Failed to create post');
      console.error(err);
    }
  };

  const toggleLike = async (postId: string) => {
    try {
      const currentLikeState = likes[postId];
      
      if (currentLikeState?.isLiked) {
        await api.deleteLike(postId, currentUser.email);
      } else {
        await api.createLike({ postID: postId, creatorInfo: currentUser });
      }
      
      // Refresh likes for this post
      await fetchLikesForPost(postId);
    } catch (err) {
      setError('Failed to toggle like');
      console.error(err);
    }
  };

  const addComment = async (postId: string, text: string) => {
    try {
      const commentData = {
        postID: postId,
        text,
        creatorInfo: currentUser
      };
      
      await api.createComment(commentData);
      await fetchCommentsForPost(postId);
    } catch (err) {
      setError('Failed to add comment');
      console.error(err);
    }
  };

  const deleteComment = async (commentId: string, postId: string) => {
    try {
      await api.deleteComment(commentId);
      await fetchCommentsForPost(postId);
    } catch (err) {
      setError('Failed to delete comment');
      console.error(err);
    }
  };

  const getPostLikes = (postId: string) => {
    return likes[postId] || { count: 0, users: [], isLiked: false };
  };

  const getPostComments = (postId: string) => {
    return comments[postId] || [];
  };

  const isPostLiked = (postId: string) => {
    return likes[postId]?.isLiked || false;
  };

  return {
    posts,
    loading,
    error,
    currentUser,
    createPost,
    toggleLike,
    addComment,
    deleteComment,
    getPostLikes,
    getPostComments,
    isPostLiked,
    refreshPosts: fetchPosts
  };
};