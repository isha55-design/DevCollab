import React, { useEffect, useState } from "react";
import api from "../../services/api";
import ProfileHeader from "../profile/ProfileHeader";
import ProfileStats from "../profile/ProfileStats";
import SocialLinks from "../profile/SocialLinks";
import EditProfile from "../profile/EditProfile";
import PostList from "../posts/PostList";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [stats, setStats] = useState({
    posts: 0,
    likes: 0,
    comments: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/user/profile");

        setUser(response.data.user);
      } catch (error) {
        console.log(
          error.response?.data || error.message
        );
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (avatar) => {
    try {
      const response = await api.put(
        "/api/user/profile",
        {
          bio: user.bio,
          avatar,
        }
      );

      setUser(response.data.user);
      setIsEditing(false);
    } catch (error) {
      console.log(
        error.response?.data || error.message
      );
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);

      const response = await api.delete(
        "/api/user/profile"
      );

      console.log(
        "DELETE ACCOUNT:",
        response.data
      );

      localStorage.removeItem("token");

      navigate("/register", { replace: true });
    } catch (error) {
      console.log(
        "DELETE ACCOUNT ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete account. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F7FF] flex items-center justify-center">
        <p className="text-[#7C5CFC] font-semibold">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7FF] text-[#1E1B4B]">

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#E5E1F5]">

        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">

          <h1 className="text-2xl font-black tracking-tight text-[#1E1B4B]">
            Dev
            <span className="text-[#7C5CFC]">
              Collab
            </span>
          </h1>

          <div className="flex items-center gap-6">

            <button
              onClick={() => navigate("/developers")}
              className="text-sm font-medium text-[#6B7280] hover:text-[#7C5CFC] transition"
            >
              Developers
            </button>

            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C5CFC] to-[#A78BFA] flex items-center justify-center font-bold text-white shadow-lg shadow-[#7C5CFC]/20">
              {user.username?.charAt(0).toUpperCase()}
            </div>

          </div>

        </div>

      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-5 py-10">

        {/* Profile Header */}
        <ProfileHeader
          user={user}
          onEdit={() => setIsEditing(true)}
        />

        {/* Social Links */}
        <SocialLinks
          user={user}
          setUser={setUser}
        />

        {/* Stats */}
        <ProfileStats
          postsCount={stats.posts}
          likesCount={stats.likes}
          commentsCount={stats.comments}
        />

        {/* Edit Profile */}
        {isEditing && (
          <EditProfile
            user={user}
            setUser={setUser}
            onSave={handleUpdateProfile}
            onClose={() => setIsEditing(false)}
          />
        )}

        {/* Posts */}
        <PostList
          currentUserId={user._id}
          onStatsChange={setStats}
        />

        {/* DELETE ACCOUNT */}
        <section className="mt-12 pt-8 border-t border-red-200">

          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">

            <h2 className="text-lg font-bold text-red-600">
              Danger Zone
            </h2>

            <p className="text-sm text-slate-500 mt-2 max-w-xl">
              Deleting your account will permanently remove your
              profile, posts, comments, and other account data.
              This action cannot be undone.
            </p>

            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="mt-5 px-5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 hover:text-red-700 text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting
                ? "Deleting Account..."
                : "Delete Account"}
            </button>

          </div>

        </section>

      </main>

    </div>
  );
};

export default Profile;