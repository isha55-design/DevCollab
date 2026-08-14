import React, { useEffect, useState } from "react";
import api from "../../services/api";
import PostCard from "./PostCard";
import CreatePost from "./CreatePost";

const PostList = ({ currentUserId, onStatsChange }) => {
  const [posts, setPosts] = useState([]);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const response = await api.get("/api/posts");

      const fetchedPosts = response.data?.posts || [];

      setPosts(fetchedPosts);
    } catch (error) {
      console.log(
        "FETCH POSTS ERROR:",
        error.response?.data || error.message
      );
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPosts();
  }, []);

  // Only current user's posts
  const userPosts = posts.filter((post) => {
    const ownerId = post.owner?._id || post.owner;

    return (
      ownerId?.toString() ===
      currentUserId?.toString()
    );
  });

  // Stats
  const totalLikes = userPosts.reduce(
    (total, post) => total + (post.likes?.length || 0),
    0
  );

  const totalComments = userPosts.reduce(
    (total, post) => total + (post.comments?.length || 0),
    0
  );

  // Send stats to Profile.jsx
  useEffect(() => {
    if (onStatsChange) {
      onStatsChange({
        posts: userPosts.length,
        likes: totalLikes,
        comments: totalComments,
      });
    }
  }, [
    userPosts.length,
    totalLikes,
    totalComments,
    onStatsChange,
  ]);

  // New post created
  const handlePostCreated = async () => {
    await fetchPosts();
  };

  // Like
  const handleLike = async (postId) => {
    try {
      const response = await api.post(
        `/api/posts/${postId}/like`
      );

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: response.data.likes,
              }
            : post
        )
      );
    } catch (error) {
      console.log(
        "LIKE ERROR:",
        error.response?.data || error.message
      );
    }
  };

  // Delete
  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/api/posts/${postId}`);

      setPosts((currentPosts) =>
        currentPosts.filter(
          (post) => post._id !== postId
        )
      );
    } catch (error) {
      console.log(
        "DELETE ERROR:",
        error.response?.data || error.message
      );
    }
  };

  // Edit caption
  const handleEdit = async (post) => {
    const newCaption = window.prompt(
      "Edit your caption:",
      post.caption
    );

    if (newCaption === null) {
      return;
    }

    if (!newCaption.trim()) {
      alert("Caption cannot be empty");
      return;
    }

    try {
      const response = await api.put(
        `/api/posts/${post._id}`,
        {
          caption: newCaption.trim(),
        }
      );

      setPosts((currentPosts) =>
        currentPosts.map((item) =>
          item._id === post._id
            ? {
                ...item,
                ...response.data.post,
              }
            : item
        )
      );
    } catch (error) {
      console.log(
        "UPDATE ERROR:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <section className="mt-12">

      {/* HEADER */}
      <div className="flex items-end justify-between mb-6 gap-4">

        <div>
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em]">
            Community
          </p>

          <h2 className="text-3xl font-black text-white mt-1">
            Your Posts
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Share projects, ideas and your developer journey.
          </p>
        </div>

        {/* Create Post Button */}
        <button
          onClick={() => setIsCreatingPost(true)}
          className="hidden sm:block px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/20 transition"
        >
          + Create Post
        </button>

      </div>

      {/* POSTS */}
      {userPosts.length === 0 ? (
        <div className="min-h-[260px] bg-[#0b0f1a] border-2 border-dashed border-white/[0.10] rounded-2xl flex flex-col items-center justify-center">

          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-4xl">
            +
          </div>

          <p className="font-black text-lg text-white mt-4">
            No posts yet
          </p>

          <p className="text-sm text-slate-500 mt-1">
            Create your first post.
          </p>

          <button
            onClick={() => setIsCreatingPost(true)}
            className="mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
          >
            Create Post
          </button>

        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">

          {userPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}

          {/* Create Post Card */}
          <button
            onClick={() => setIsCreatingPost(true)}
            className="min-h-[300px] bg-[#0b0f1a] border-2 border-dashed border-white/[0.10] rounded-2xl hover:border-indigo-500/50 hover:bg-indigo-500/[0.04] transition flex flex-col items-center justify-center"
          >

            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-4xl">
              +
            </div>

            <p className="font-black text-lg text-white mt-4">
              Create a post
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Share something with developers
            </p>

          </button>

        </div>
      )}

      {/* Create Post Modal */}
      <CreatePost
        isOpen={isCreatingPost}
        onClose={() => setIsCreatingPost(false)}
        onPostCreated={handlePostCreated}
      />

    </section>
  );
};

export default PostList;