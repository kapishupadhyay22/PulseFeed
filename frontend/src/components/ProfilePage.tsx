import React, { useState } from 'react';
import { User, Post } from '../types';
import { Settings, Grid, Heart, MessageCircle, Calendar, Mail, ArrowLeft, Edit2 } from 'lucide-react';

interface ProfilePageProps {
  user: User;
  userPosts: Post[];
  isOwnProfile: boolean;
  onEditProfile?: () => void;
  onBack: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  userPosts,
  isOwnProfile,
  onEditProfile,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'liked'>('posts');

  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return 'Recently joined';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  // const totalLikes = userPosts.reduce((acc, post) => acc + (Math.floor(Math.random() * 50) + 1), 0);

  return (
    <div className="max-w-4xl mx-auto pt-8 pb-8 px-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Feed</span>
      </button>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 md:mb-0">{user.name}</h1>
              {isOwnProfile ? (
                <div className="flex space-x-2">
                  <button
                    onClick={onEditProfile}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                  <button className="text-gray-500 hover:text-gray-700 transition-colors p-2">
                    <Settings className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Follow
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="flex justify-center md:justify-start space-x-8 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{userPosts.length}</p>
                <p className="text-gray-500 text-sm">Posts</p>
              </div>
              {/* <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">1.2K</p>
                <p className="text-gray-500 text-sm">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">856</p>
                <p className="text-gray-500 text-sm">Following</p>
              </div> */}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <p className="text-gray-700">
                {user.bio || 'No bio available.'}
              </p>
              <div className="flex items-center justify-center md:justify-start space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatJoinDate(user.joining)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${activeTab === 'posts'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Grid className="h-5 w-5" />
                <span>Posts</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('liked')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${activeTab === 'liked'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>Liked</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'posts' && (
            <div>
              {userPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userPosts.map((post) => (
                    <div
                      key={post.id}
                      className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
                    >
                      {post.data ? (
                        <img
                          src={post.data}
                          alt="Post"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                          <p className="text-gray-600 text-center p-4">{post.text}</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-4 text-white">
                          <div className="flex items-center space-x-1">
                            <Heart className="h-5 w-5" />
                            <span>{Math.floor(Math.random() * 50) + 1}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-5 w-5" />
                            <span>{Math.floor(Math.random() * 20) + 1}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Grid className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No posts yet</p>
                  <p className="text-gray-400 text-sm">
                    {isOwnProfile ? "Share your first post to get started!" : "This user hasn't posted anything yet."}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'liked' && (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No liked posts yet</p>
              <p className="text-gray-400 text-sm">Posts you like will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};