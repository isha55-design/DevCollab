import React, { useState } from "react";
import Comments from "./Comments";

const PostCard = ({
  post,
  onLike,
  onEdit,
  onDelete,
}) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <article className="bg-[#111827] border border-white/[0.07] rounded-2xl overflow-hidden hover:-translate-y-1 hover:border-indigo-500/30 transition duration-300">

      {/* IMAGE */}
      {post.image ? (
        <div className="bg-[#0b0f1a] p-3">
          <img
            src={post.image}
            alt="Post"
            className="w-full h-64 object-contain rounded-xl"
          />
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center bg-gradient-to-br from-indigo-700 via-violet-700 to-cyan-600 text-5xl">
          📝
        </div>
      )}

      {/* CONTENT */}
      <div className="p-5">

        <span className="text-xs font-black text-indigo-400">
          POST
        </span>

        <p className="text-slate-200 mt-2 leading-relaxed break-words">
          {post.caption}
        </p>

        {/* ACTIONS */}
        <div className="flex items-center gap-4 mt-5">

          {/* LIKE */}
          <button
            onClick={() => onLike(post._id)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-pink-400 transition"
          >
            <span className="text-lg">♡</span>
            <span>{post.likes?.length || 0}</span>
          </button>

          {/* COMMENTS */}
          <button
            onClick={() =>
              setShowComments((value) => !value)
            }
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition"
          >
            <span>💬</span>
            <span>
              {showComments
                ? "Hide Comments"
                : "Comments"}
            </span>
          </button>

          {/* EDIT */}
          {onEdit && (
          <button
          onClick={() => onEdit(post)}
          className="ml-auto px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
          Edit
         </button>
         )}

         {/* DELETE */}
         {onDelete && (
         <button
         onClick={() => onDelete(post._id)}
         className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold"
         >
         Delete
         </button>
         )}

        </div>

        {/* COMMENTS */}
        <Comments
          postId={post._id}
          isOpen={showComments}
        />

      </div>
    </article>
  );
};

export default PostCard;