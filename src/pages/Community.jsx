// src/pages/Community.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc, collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

function Community() {
  const { t } = useTranslation();
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [newComment, setNewComment] = useState({});
  const [newReply, setNewReply] = useState({});
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [activeSection, setActiveSection] = useState('create');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Check user role and fetch user name
  useEffect(() => {
    const checkUserRole = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const role = userDoc.data().role;
          setUserRole(role);
          setUserName(userDoc.data().name || 'Anonymous');
          setUserId(user.uid);
          if (role !== 'Farmer') {
            navigate('/marketplace');
          }
        } else {
          console.log('No user document found in Firestore');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, [navigate]);

  // Fetch posts from Firestore
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsSnapshot = await getDocs(collection(db, 'posts'));
        const postsData = await Promise.all(
          postsSnapshot.docs.map(async (doc) => {
            const postData = { id: doc.id, ...doc.data() };
            const commentsSnapshot = await getDocs(collection(db, `posts/${doc.id}/comments`));
            const commentsData = await Promise.all(
              commentsSnapshot.docs.map(async (commentDoc) => {
                const commentData = { id: commentDoc.id, ...commentDoc.data() };
                const repliesSnapshot = await getDocs(collection(db, `posts/${doc.id}/comments/${commentDoc.id}/replies`));
                const repliesData = repliesSnapshot.docs.map(replyDoc => ({
                  id: replyDoc.id,
                  ...replyDoc.data(),
                }));
                return { ...commentData, replies: repliesData };
              })
            );
            return { ...postData, comments: commentsData };
          })
        );
        setPosts(postsData.sort((a, b) => b.timestamp?.toMillis() - a.timestamp?.toMillis()));
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  // Handle post submission
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const user = auth.currentUser;
      await addDoc(collection(db, 'posts'), {
        content: newPost,
        authorId: user.uid,
        authorName: userName,
        timestamp: serverTimestamp(),
      });
      setNewPost('');
      const postsSnapshot = await getDocs(collection(db, 'posts'));
      const postsData = await Promise.all(
        postsSnapshot.docs.map(async (doc) => {
          const postData = { id: doc.id, ...doc.data() };
          const commentsSnapshot = await getDocs(collection(db, `posts/${doc.id}/comments`));
          const commentsData = await Promise.all(
            commentsSnapshot.docs.map(async (commentDoc) => {
              const commentData = { id: commentDoc.id, ...commentDoc.data() };
              const repliesSnapshot = await getDocs(collection(db, `posts/${doc.id}/comments/${commentDoc.id}/replies`));
              const repliesData = repliesSnapshot.docs.map(replyDoc => ({
                id: replyDoc.id,
                ...replyDoc.data(),
              }));
              return { ...commentData, replies: repliesData };
            })
          );
          return { ...postData, comments: commentsData };
        })
      );
      setPosts(postsData.sort((a, b) => b.timestamp?.toMillis() - a.timestamp?.toMillis()));
    } catch (error) {
      console.error('Error posting:', error);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (postId, e) => {
    e.preventDefault();
    if (!newComment[postId]?.trim()) return;

    try {
      const post = posts.find(p => p.id === postId);
      if (post.authorId === userId) return;

      await addDoc(collection(db, `posts/${postId}/comments`), {
        content: newComment[postId],
        authorId: userId,
        authorName: userName,
        timestamp: serverTimestamp(),
      });
      setNewComment({ ...newComment, [postId]: '' });
      const postsSnapshot = await getDocs(collection(db, 'posts'));
      const postsData = await Promise.all(
        postsSnapshot.docs.map(async (doc) => {
          const postData = { id: doc.id, ...doc.data() };
          const commentsSnapshot = await getDocs(collection(db, `posts/${doc.id}/comments`));
          const commentsData = await Promise.all(
            commentsSnapshot.docs.map(async (commentDoc) => {
              const commentData = { id: commentDoc.id, ...commentDoc.data() };
              const repliesSnapshot = await getDocs(collection(db, `posts/${doc.id}/comments/${commentDoc.id}/replies`));
              const repliesData = repliesSnapshot.docs.map(replyDoc => ({
                id: replyDoc.id,
                ...replyDoc.data(),
              }));
              return { ...commentData, replies: repliesData };
            })
          );
          return { ...postData, comments: commentsData };
        })
      );
      setPosts(postsData.sort((a, b) => b.timestamp?.toMillis() - a.timestamp?.toMillis()));
    } catch (error) {
      console.error('Error commenting:', error);
    }
  };

  // Handle reply submission
  const handleReplySubmit = async (postId, commentId, e) => {
    e.preventDefault();
    if (!newReply[`${postId}-${commentId}`]?.trim()) return;

    try {
      await addDoc(collection(db, `posts/${postId}/comments/${commentId}/replies`), {
        content: newReply[`${postId}-${commentId}`],
        authorId: userId,
        authorName: userName,
        timestamp: serverTimestamp(),
      });
      setNewReply({ ...newReply, [`${postId}-${commentId}`]: '' });
      const postsSnapshot = await getDocs(collection(db, 'posts'));
      const postsData = await Promise.all(
        postsSnapshot.docs.map(async (doc) => {
          const postData = { id: doc.id, ...doc.data() };
          const commentsSnapshot = await getDocs(collection(db, `posts/${doc.id}/comments`));
          const commentsData = await Promise.all(
            commentsSnapshot.docs.map(async (commentDoc) => {
              const commentData = { id: commentDoc.id, ...commentDoc.data() };
              const repliesSnapshot = await getDocs(collection(db, `posts/${doc.id}/comments/${commentDoc.id}/replies`));
              const repliesData = repliesSnapshot.docs.map(replyDoc => ({
                id: replyDoc.id,
                ...replyDoc.data(),
              }));
              return { ...commentData, replies: repliesData };
            })
          );
          return { ...postData, comments: commentsData };
        })
      );
      setPosts(postsData.sort((a, b) => b.timestamp?.toMillis() - a.timestamp?.toMillis()));
    } catch (error) {
      console.error('Error replying:', error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return t('community.justNow');
    
    const date = timestamp.toDate();
    const now = new Date();
    const diff = (now - date) / 1000; // seconds
    
    if (diff < 60) return t('Just now');
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 172800) return 'Yesterday';
    
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-green-50 to-green-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-green-600 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-green-800 font-semibold text-lg">{t('community.loading')}</p>
        </div>
      </div>
    );
  }

  if (!userRole || userRole !== 'Farmer') {
    return null; // Redirect handled in useEffect
  }

  // Post Component
  const PostCard = ({ post, isOwnPost }) => (
    <div className="mb-6 bg-white rounded-xl shadow-sm p-5 border border-gray-100 transition-shadow hover:shadow-md">
      <div className="flex items-center mb-3">
        <div className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-sm">
          {post.authorName.charAt(0).toUpperCase()}
        </div>
        <div className="ml-3">
          <div className="text-gray-800 font-medium">{post.authorName}</div>
          <div className="text-xs text-gray-500">
            {formatDate(post.timestamp)}
          </div>
        </div>
        {isOwnPost && (
          <span className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
            {t('Your Post')}
          </span>
        )}
      </div>
      <div className="bg-gray-50 p-4 rounded-lg mb-3 border-l-4 border-green-400">
        <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
      </div>
      
      <CommentsSection 
        post={post} 
        isOwnPost={isOwnPost} 
        newComment={newComment} 
        setNewComment={setNewComment}
        newReply={newReply}
        setNewReply={setNewReply}
        handleCommentSubmit={handleCommentSubmit}
        handleReplySubmit={handleReplySubmit}
      />
    </div>
  );

  // Comments Component
  const CommentsSection = ({ 
    post, 
    isOwnPost, 
    newComment, 
    setNewComment, 
    newReply, 
    setNewReply, 
    handleCommentSubmit, 
    handleReplySubmit 
  }) => {
    const [showComments, setShowComments] = useState(false);
    
    return (
      <div>
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center text-sm font-medium text-green-700 hover:text-green-900 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 mr-1 transition-transform ${showComments ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {t('community.comments')} ({post.comments?.length || 0})
          </button>
          
          {!isOwnPost && (
            <button 
              onClick={() => setShowComments(true)}
              className="text-sm text-green-600 hover:text-green-800 transition-colors"
            >
              {t('Add Comment')}
            </button>
          )}
        </div>
        
        {showComments && (
          <div className="mt-3 space-y-3">
            {/* Comment Form */}
            {!isOwnPost && (
              <form onSubmit={(e) => handleCommentSubmit(post.id, e)} className="mb-4">
                <div className="flex space-x-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-grow relative">
                    <textarea
                      value={newComment[post.id] || ''}
                      onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                      placeholder={t('community.commentPlaceholder', 'Share your insights...')}
                      className="w-full p-2 pr-20 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none bg-gray-50"
                      rows="2"
                      required
                    />
                    <button
                      type="submit"
                      className="absolute right-2 bottom-2 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded-full transition-colors"
                    >
                      {t('Send')}
                    </button>
                  </div>
                </div>
              </form>
            )}
            
            {/* Comments List */}
            {post.comments?.length > 0 ? (
              <div className="pl-4 border-l-2 border-gray-100 space-y-3">
                {post.comments.map(comment => (
                  <div key={comment.id} className="animate-fadeIn">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center mb-1">
                        <div className="font-medium text-sm text-gray-800">{comment.authorName}</div>
                        <div className="text-xs text-gray-500 ml-2">
                          {formatDate(comment.timestamp)}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm">{comment.content}</p>
                    </div>
                    
                    {/* Replies */}
                    {comment.replies?.length > 0 && (
                      <div className="pl-4 mt-2 space-y-2">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="bg-gray-100 p-2 rounded-lg">
                            <div className="flex items-center mb-1">
                              <div className="font-medium text-xs text-gray-800">{reply.authorName}</div>
                              <div className="text-xs text-gray-500 ml-2">
                                {formatDate(reply.timestamp)}
                              </div>
                            </div>
                            <p className="text-gray-700 text-xs">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Reply Form */}
                    <form onSubmit={(e) => handleReplySubmit(post.id, comment.id, e)} className="mt-2">
                      <div className="flex space-x-1">
                        <input
                          value={newReply[`${post.id}-${comment.id}`] || ''}
                          onChange={(e) =>
                            setNewReply({ ...newReply, [`${post.id}-${comment.id}`]: e.target.value })
                          }
                          placeholder={t('community.replyPlaceholder', 'Reply...')}
                          className="flex-grow p-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-transparent bg-white"
                          required
                        />
                        <button
                          type="submit"
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs transition-colors"
                        >
                          {t('Reply')}
                        </button>
                      </div>
                    </form>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-sm">{t('community.noComments', 'No comments yet. Be the first to share your thoughts!')}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 font-sans">
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes scaleIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease forwards;
          }
          .animate-scaleIn {
            animation: scaleIn 0.3s ease forwards;
          }
        `}
      </style>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row">
        {/* Mobile Header */}
        <div className="md:hidden p-4 bg-gradient-to-r from-green-700 to-green-600 text-white flex justify-between items-center shadow-md">
          <h2 className="text-xl font-semibold flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {t('community.title')}
          </h2>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded-md hover:bg-green-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isSidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        {/* Sidebar */}
        <div
          className={`w-full md:w-72 bg-white text-gray-800 flex flex-col shadow-lg md:sticky md:top-0 md:h-screen md:overflow-auto transition-all duration-300 ${
            isSidebarOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="p-6 bg-gradient-to-r from-green-700 to-green-600 text-white">
            <h2 className="text-2xl font-bold flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {t('community.title')}
            </h2>
            <p className="text-green-100 text-sm mt-2">{t('Connect with fellow farmers')}</p>
          </div>
          <div className="p-6 flex-1">
            <div className="mb-6">
              <div className="text-gray-400 uppercase text-xs tracking-wider mb-4 font-semibold pl-2">
                {t('Menu')}
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => {
                    setActiveSection('create');
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center p-3 rounded-lg transition-all ${
                    activeSection === 'create' 
                      ? 'bg-green-100 text-green-800 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 mr-3 ${activeSection === 'create' ? 'text-green-600' : 'text-gray-500'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  {t('community.createPost')}
                </button>
                <button
                  onClick={() => {
                    setActiveSection('yourPosts');
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center p-3 rounded-lg transition-all ${
                    activeSection === 'yourPosts' 
                      ? 'bg-green-100 text-green-800 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 mr-3 ${activeSection === 'yourPosts' ? 'text-green-600' : 'text-gray-500'}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t('Your Posts')}
                </button>
                <button
                  onClick={() => {
                    setActiveSection('others');
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center p-3 rounded-lg transition-all ${
                    activeSection === 'others' 
                      ? 'bg-green-100 text-green-800 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 mr-3 ${activeSection === 'others' ? 'text-green-600' : 'text-gray-500'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {t('Others')}
                </button>
              </nav>
            </div>
            
            <div className="mt-8">
              <div className="text-gray-400 uppercase text-xs tracking-wider mb-4 font-semibold pl-2">
                {t('Stats')}
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">{t('My Posts')}</span>
                  <span className="bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium">
                    {posts.filter(post => post.authorId === userId).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">{t('Community Posts')}</span>
                  <span className="bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs font-medium">
                    {posts.filter(post => post.authorId !== userId).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 flex items-center">
              <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-3 shadow-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-medium text-gray-800">{userName}</div>
                <div className="text-xs text-gray-500 mt-1">{t('Farmer')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 md:p-8 z-10">
          <div className="max-w-3xl mx-auto">
            {/* Create Post Section */}
            {activeSection === 'create' && (
              <div className="mb-8 animate-fadeIn">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  {t('community.createPost')}
                </h2>
                
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">{t('Share with the community')}</h3>
                  <p className="text-gray-600 mb-6 text-sm">{t('Create a post to share your farming experiences and tips with fellow farmers around the world.')}</p>
                  
                  <form onSubmit={handlePostSubmit} className="space-y-4">
                    <div className="relative">
                      <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder={t('community.postPlaceholder', 'Share your farming tips, challenges, or questions...')}
                        className="w-full p-4 pr-16 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none bg-gray-50"
                        rows="5"
                        required
                      />
                      <button
                        type="submit"
                        className="absolute right-2 bottom-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        {t('community.postButton')}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Your Posts Section */}
            {activeSection === 'yourPosts' && (
              <div className="mb-8 animate-fadeIn">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-green-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t('Your Posts')}
                </h2>
                <p className="text-gray-600 mb-6 text-sm">{t('View and manage all your previous contributions')}</p>
                {posts.filter(post => post.authorId === userId).length > 0 ? (
                  posts
                    .filter(post => post.authorId === userId)
                    .map(post => (
                      <PostCard key={post.id} post={post} isOwnPost={true} />
                    ))
                ) : (
                  <div className="text-center py-8 bg-white rounded-xl shadow-sm border border-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto text-green-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-800">
                      {t('community.noPostsByYou', "You haven't created any posts yet")}
                    </h3>
                    <button
                      onClick={() => setActiveSection('create')}
                      className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      {t('Create Your First Post')}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Others' Posts Section */}
            {activeSection === 'others' && (
              <div className="mb-8 animate-fadeIn">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {t('Others')}
                </h2>
                <p className="text-gray-600 mb-6 text-sm">{t('Discover knowledge from other farmers in the community')}</p>
                {posts.filter(post => post.authorId !== userId).length > 0 ? (
                  posts
                    .filter(post => post.authorId !== userId)
                    .map(post => (
                      <PostCard key={post.id} post={post} isOwnPost={false} />
                    ))
                ) : (
                  <div className="text-center py-8 bg-white rounded-xl shadow-sm border border-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto text-green-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-800">
                      {t('community.noOtherPosts', 'No community posts yet')}
                    </h3>
                    <button
                      onClick={() => setActiveSection('create')}
                      className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      {t('Create a Post')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Community;