import React from "react";

const ProfileStats = ({
  postsCount = 0,
  likesCount = 0,
  commentsCount = 0,
}) => {
  return (
    <div className="mt-8 p-6 border-t border-white/[0.06] grid grid-cols-3 md:grid-cols-4 max-w-2xl">

      {/* Posts */}
      <div>
        <p className="text-2xl font-black text-indigo-400">
          {postsCount}
        </p>

        <p className="text-sm text-slate-500 mt-1">
         Total Posts
        </p>
      </div>

      {/* Joined */}
      <div className="hidden md:block">
        <p className="text-2xl font-black text-white">
          2026
        </p>

        <p className="text-sm text-slate-500 mt-1">
          Joined
        </p>
      </div>

    </div>
  );
};

export default ProfileStats;