import React, { useState } from 'react';
import { Header } from './components/Header';
import { CreatePostModal } from './components/CreatePostModal';
import { PostCard } from './components/PostCard';
import { ProfilePage } from './components/ProfilePage';
import { EditProfileModal } from './components/EditProfileModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useSocialMedia } from './hooks/useSocialMedia';
import { AlertCircle } from 'lucide-react';

function App() {
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'profile'>('home');
  
  const {
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
    isPostLiked
  } = useSocialMedia();

  const handleEditProfile = (userData: { name: string; email: string }) => {
    // In a real app, this would update the user data via API
    console.log('Updating user profile:', userData);
  };

  const userPosts = posts.filter(post => post.creatorInfo.email === currentUser.email);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          onCreatePost={() => setIsCreatePostModalOpen(true)} 
          onNavigate={setCurrentPage}
          currentPage={currentPage}
        />
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          onCreatePost={() => setIsCreatePostModalOpen(true)} 
          onNavigate={setCurrentPage}
          currentPage={currentPage}
        />
        <div className="max-w-2xl mx-auto pt-8 px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3 animate-fadeIn">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onCreatePost={() => setIsCreatePostModalOpen(true)} 
        onNavigate={setCurrentPage}
        currentPage={currentPage}
      />
      
      {currentPage === 'home' ? (
        <main className="max-w-2xl mx-auto pt-8 pb-8 px-4">
          <div className="space-y-8">
            {posts.length === 0 ? (
              <div className="text-center py-12 animate-fadeIn">
                <p className="text-gray-500 text-lg">No posts yet. Be the first to share something!</p>
                <button
                  onClick={() => setIsCreatePostModalOpen(true)}
                  className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Create Your First Post
                </button>
              </div>
            ) : (
              posts.map((post, index) => (
                <div
                  key={post.id}
                  className="animate-slideUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <PostCard
                    post={post}
                    currentUser={currentUser}
                    onLike={toggleLike}
                    onComment={addComment}
                    onDeleteComment={deleteComment}
                    isLiked={isPostLiked(post.id)}
                    likesData={getPostLikes(post.id)}
                    comments={getPostComments(post.id)}
                  />
                </div>
              ))
            )}
          </div>
        </main>
      ) : (
        <ProfilePage
          currentUser={currentUser}
          userPosts={userPosts}
          onEditProfile={() => setIsEditProfileModalOpen(true)}
        />
      )}

      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onCreatePost={createPost}
        currentUser={currentUser}
      />

      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        currentUser={currentUser}
        onSave={handleEditProfile}
      />
    </div>
  );
}

export default App;