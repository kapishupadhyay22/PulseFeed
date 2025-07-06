import React, { useState } from 'react';
import { Header } from './components/Header';
import { CreatePostModal } from './components/CreatePostModal';
import { PostCard } from './components/PostCard';
import { ProfilePage } from './components/ProfilePage';
import { EditProfileModal } from './components/EditProfileModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import { LoginModal } from './components/LoginModal';
import { useSocialMedia } from './hooks/useSocialMedia';
import { useAuth } from './hooks/useAuth';
import { AlertCircle } from 'lucide-react';
import { User } from './types';

function App() {
  const { user, loading: authLoading, login, register, logout, isAuthenticated } = useAuth();
  const {
    posts,
    loading,
    error,
    createPost,
    deletePost,
    toggleLike,
    addComment,
    deleteComment,
    editComment,
    getPostLikes,
    getPostComments,
    isPostLiked
  } = useSocialMedia(user || { id: '', name: '', email: '' });

  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'profile'>('home');
  const [viewingProfile, setViewingProfile] = useState<User | null>(null);

  // Show login modal if not authenticated
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setIsLoginModalOpen(true);
    } else if (isAuthenticated) {
      setIsLoginModalOpen(false);
    }
  }, [authLoading, isAuthenticated]);

  const handleEditProfile = (userData: { name: string; email: string }) => {
    // In a real app, this would update the user data via API
    console.log('Updating user profile:', userData);
  };

  const handleViewProfile = (email: string) => {
    if (email === user?.email) {
      setCurrentPage('profile');
      setViewingProfile(null);
    } else {
      // In a real app, fetch user data by email
      const profileUser: User = {
        id: email,
        name: email.split('@')[0],
        email: email,
        bio: 'This is a sample bio for the user.',
        joining: '2023-01-15'
      };
      setViewingProfile(profileUser);
      setCurrentPage('profile');
    }
  };

  const handleBackToFeed = () => {
    setCurrentPage('home');
    setViewingProfile(null);
  };

  const userPosts = posts.filter(post => {
    const targetEmail = viewingProfile?.email || user?.email;
    return post.creatorInfo.email === targetEmail;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => {}} // Empty function since we don't want to close it
          onLogin={login}
          onRegister={register}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          onCreatePost={() => setIsCreatePostModalOpen(true)} 
          onNavigate={setCurrentPage}
          onLogout={logout}
          currentPage={currentPage}
          currentUser={user!}
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
          onLogout={logout}
          currentPage={currentPage}
          currentUser={user!}
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
        onLogout={logout}
        currentPage={currentPage}
        currentUser={user!}
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
                    currentUser={user!}
                    onLike={toggleLike}
                    onComment={addComment}
                    onDeleteComment={deleteComment}
                    onEditComment={editComment}
                    onDeletePost={deletePost}
                    onViewProfile={handleViewProfile}
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
          user={viewingProfile || user!}
          userPosts={userPosts}
          isOwnProfile={!viewingProfile}
          onEditProfile={() => setIsEditProfileModalOpen(true)}
          onBack={handleBackToFeed}
        />
      )}

      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onCreatePost={createPost}
        currentUser={user!}
      />

      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        currentUser={user!}
        onSave={handleEditProfile}
      />
    </div>
  );
}

export default App;