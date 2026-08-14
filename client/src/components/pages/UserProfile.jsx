import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import PostCard from "../posts/PostCard";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [developer, setDeveloper] = useState(null);
  const [posts, setPosts] = useState([]);

  // FETCH DEVELOPER PROFILE
  const fetchDeveloper = async () => {
    try {
      const response = await api.get(`/api/user/${userId}`);

      console.log("USER PROFILE RESPONSE:", response.data);

      setDeveloper(response.data.developer);
      setPosts(response.data.posts || []);
    } catch (error) {
      console.log(
        "USER PROFILE ERROR:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchDeveloper();
  }, [userId]);

  // LIKE POST
  const handleLike = async (postId) => {
    try {
      const response = await api.post(
        `/api/posts/${postId}/like`
      );

      console.log("LIKE RESPONSE:", response.data);

      // If backend returns updated post
      const updatedPost =
        response.data?.post || response.data?.updatedPost;

      if (updatedPost) {
        setPosts((currentPosts) =>
          currentPosts.map((post) =>
            post._id === postId
              ? updatedPost
              : post
          )
        );
      } else {
        // Otherwise fetch latest posts again
        await fetchDeveloper();
      }
    } catch (error) {
      console.log(
        "LIKE ERROR:",
        error.response?.data || error.message
      );
    }
  };

  if (!developer) {
    return (
      <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center">
        <p className="text-indigo-400 font-semibold">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-100">

      {/* NAVBAR */}
      <header className="border-b border-white/[0.06] bg-[#0b0f1a]">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">

          <h1 className="text-2xl font-black tracking-tight">
            Dev
            <span className="text-indigo-400">
              Collab
            </span>
          </h1>

          <button
            onClick={() => navigate("/developers")}
            className="text-sm font-semibold text-slate-400 hover:text-indigo-400 transition"
          >
            ← Developers
          </button>

        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-10">

        {/* PROFILE */}
        <section className="bg-[#111827] border border-white/[0.07] rounded-2xl overflow-hidden">

          {/* PROFILE BANNER */}
          <div className="h-28 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500" />

          <div className="px-6 pb-7">

            {/* AVATAR + NAME */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-10">

              {developer.avatar ? (
                <img
                  src={developer.avatar}
                  alt={developer.username}
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#111827]"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-indigo-600 border-4 border-[#111827] flex items-center justify-center text-3xl font-bold">
                  {developer.username
                    ?.charAt(0)
                    .toUpperCase()}
                </div>
              )}

              <div className="pb-1">

                <h1 className="text-3xl font-black text-white">
                  {developer.username}
                </h1>

                <p className="text-slate-400 mt-1">
                  Developer at DevCollab
                </p>

              </div>

            </div>

            {/* BIO */}
            <p className="text-slate-300 mt-6 leading-relaxed">
              {developer.bio || "No bio added yet."}
            </p>

            {/* SOCIAL LINKS */}
            <div className="flex flex-wrap gap-3 mt-6">

              {/* PORTFOLIO */}
              {developer.portfolio ? (
                <a
                  href={developer.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#0b0f1a] border border-white/[0.08] text-sm font-semibold text-slate-200 hover:border-indigo-500/50 hover:text-indigo-400 transition"
                >
                  🌐 Portfolio
                </a>
              ) : (
                <button
                  disabled
                  className="px-4 py-2.5 rounded-xl bg-[#0b0f1a] border border-white/[0.08] text-sm font-semibold text-slate-600 cursor-not-allowed"
                >
                  🌐 Portfolio
                </button>
              )}

              {/* GITHUB */}
              {developer.github ? (
                <a
                  href={developer.github}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#0b0f1a] border border-white/[0.08] text-sm font-semibold text-slate-200 hover:border-indigo-500/50 hover:text-indigo-400 transition"
                >
                  💻 GitHub
                </a>
              ) : (
                <button
                  disabled
                  className="px-4 py-2.5 rounded-xl bg-[#0b0f1a] border border-white/[0.08] text-sm font-semibold text-slate-600 cursor-not-allowed"
                >
                  💻 GitHub
                </button>
              )}

              {/* LINKEDIN */}
              {developer.linkedin ? (
                <a
                  href={developer.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#0b0f1a] border border-white/[0.08] text-sm font-semibold text-slate-200 hover:border-indigo-500/50 hover:text-indigo-400 transition"
                >
                  🔗 LinkedIn
                </a>
              ) : (
                <button
                  disabled
                  className="px-4 py-2.5 rounded-xl bg-[#0b0f1a] border border-white/[0.08] text-sm font-semibold text-slate-600 cursor-not-allowed"
                >
                  🔗 LinkedIn
                </button>
              )}

            </div>

          </div>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

          <div className="bg-[#111827] border border-white/[0.07] rounded-2xl p-5">
            <p className="text-2xl font-black text-white">
              {posts.length}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Total Posts
            </p>
          </div>

          <div className="bg-[#111827] border border-white/[0.07] rounded-2xl p-5">
            <p className="text-2xl font-black text-white">
              {posts.reduce(
                (total, post) =>
                  total + (post.likes?.length || 0),
                0
              )}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Total Likes
            </p>
          </div>

        </section>

        {/* POSTS */}
        <section className="mt-10">

          <div className="mb-6">

            <p className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em]">
              Developer Activity
            </p>

            <h2 className="text-3xl font-black text-white mt-1">
              Posts
            </h2>

          </div>

          {posts.length === 0 ? (

            <div className="bg-[#111827] border border-white/[0.07] rounded-2xl min-h-[220px] flex items-center justify-center">
              <p className="text-slate-500">
                No posts yet.
              </p>
            </div>

          ) : (

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {posts.map((post) => (

                <PostCard
                  key={post._id}
                  post={post}
                  onLike={handleLike}
                />

              ))}

            </div>

          )}

        </section>

      </main>
    </div>
  );
};

export default UserProfile;