import React, { useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal, Trash2, Send } from 'lucide-react';
import { Post, User, Comment } from '../types';
import { RichTextEditor } from './RichTextEditor';
import { RichTextDisplay } from './RichTextDisplay';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onLike: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onDeleteComment: (commentId: string, postId: string) => void;
  isLiked: boolean;
  likesData: { count: number; users: User[]; isLiked: boolean };
  comments: Comment[];
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onLike,
  onComment,
  onDeleteComment,
  isLiked,
  likesData,
  comments
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showLikers, setShowLikers] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && !isSubmittingComment) {
      setIsSubmittingComment(true);
      try {
        await onComment(post.id, commentText);
        setCommentText('');
      } finally {
        setIsSubmittingComment(false);
      }
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const hasCommentContent = commentText.replace(/<[^>]*>/g, '').trim().length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold transform transition-transform hover:scale-110">
            {post.creatorInfo.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
              {post.creatorInfo.name}
            </p>
            <p className="text-sm text-gray-500">{formatTimeAgo(post.timestamp)}</p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Image */}
      {post.data && (
        <div className="aspect-square bg-gray-100 overflow-hidden">
          <img 
            src={post.data} 
            alt="Post content" 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onLike(post.id)}
              className={`transition-all duration-300 transform hover:scale-110 ${
                isLiked ? 'text-red-500' : 'text-gray-700 hover:text-red-500'
              }`}
            >
              <Heart className={`h-6 w-6 ${isLiked ? 'fill-current animate-pulse' : ''}`} />
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="text-gray-700 hover:text-blue-600 transition-all duration-300 transform hover:scale-110"
            >
              <MessageCircle className="h-6 w-6" />
            </button>
            <button className="text-gray-700 hover:text-blue-600 transition-all duration-300 transform hover:scale-110">
              <Share className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Likes count */}
        {likesData.count > 0 && (
          <button
            onClick={() => setShowLikers(!showLikers)}
            className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors"
          >
            {likesData.count} {likesData.count === 1 ? 'like' : 'likes'}
          </button>
        )}

        {/* Likers list */}
        {showLikers && likesData.users.length > 0 && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg animate-fadeIn">
            <p className="text-sm font-medium text-gray-700 mb-2">Liked by:</p>
            <div className="space-y-1">
              {likesData.users.map((user, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-700">{user.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Caption */}
        <div className="mb-3">
          <p className="text-gray-900">
            <span className="font-semibold mr-2">{post.creatorInfo.name}</span>
            <RichTextDisplay content={post.text} />
          </p>
        </div>

        {/* Comments */}
        {comments.length > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-gray-500 text-sm mb-3 hover:text-gray-700 transition-colors"
          >
            View all {comments.length} comments
          </button>
        )}

        {showComments && (
          <div className="space-y-3 mb-4 animate-slideDown">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-2 group">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 mt-1">
                  {comment.creatorInfo?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        {comment.creatorInfo?.name || 'Unknown'}
                      </p>
                      <div className="text-sm text-gray-700">
                        <RichTextDisplay content={comment.text} />
                      </div>
                    </div>
                    {comment.creatorInfo?.email === currentUser.email && (
                      <button
                        onClick={() => onDeleteComment(comment.id, post.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all duration-200 p-1 rounded-full hover:bg-red-50 ml-2 flex-shrink-0"
                        title="Delete comment"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rich Text Comment Input */}
        <form onSubmit={handleCommentSubmit} className="space-y-3">
          <div className="flex items-start space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 mt-2">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <RichTextEditor
                value={commentText}
                onChange={setCommentText}
                placeholder="Add a comment with rich formatting..."
                className="w-full"
              />
            </div>
          </div>
          
          {hasCommentContent && (
            <div className="flex justify-end animate-fadeIn">
              <button
                type="submit"
                disabled={isSubmittingComment}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmittingComment ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Post</span>
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};