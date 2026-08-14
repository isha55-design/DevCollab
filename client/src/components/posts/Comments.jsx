import React, { useEffect, useState } from "react";
import api from "../../services/api";

const Comments = ({ postId, isOpen }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      const response = await api.get(
        `/api/posts/${postId}/comments`
      );

      console.log("COMMENTS:", response.data);

      setComments(response.data?.comments || []);
    } catch (error) {
      console.log(
        "COMMENTS ERROR:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    if (isOpen && postId) {
      fetchComments();
    }
  }, [isOpen, postId]);

  const handleAddComment = async () => {
    const cleanText = text.trim();

    if (!cleanText) {
      return;
    }

    try {
      setIsSubmitting(true);

      await api.post(
        `/api/posts/${postId}/comments`,
        {
          text: cleanText,
        }
      );

      setText("");

      await fetchComments();
    } catch (error) {
      console.log(
        "ADD COMMENT ERROR:",
        error.response?.data || error.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
  try {
    await api.delete(
      `/api/posts/${postId}/comments/${commentId}`
    );

    setComments((currentComments) =>
      currentComments.filter(
        (comment) => comment._id !== commentId
      )
    );
  } catch (error) {
    console.log(
      "DELETE COMMENT ERROR:",
      error.response?.data || error.message
    );
   }
};

  if (!isOpen) {
    return null;
  }

  return (
    <div className="mt-4 pt-4 border-t border-white/[0.06]">

      {/* COMMENTS */}
      <div className="max-h-60 overflow-y-auto space-y-3">

        {comments.length === 0 ? (
          <div className="text-center py-5">
            <div className="text-2xl">
              💬
            </div>

            <p className="text-sm text-slate-400 mt-2">
              No comments yet
            </p>

            <p className="text-xs text-slate-600 mt-1">
              Be the first to comment.
            </p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <div
              key={comment?._id || index}
              className="bg-[#0b0f1a] border border-white/[0.06] rounded-xl p-4"
            >

              {/* USER */}
              <div className="flex items-center gap-3">

                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white text-sm font-bold">
                  {comment.user?.username
                    ?.charAt(0)
                    .toUpperCase() || "U"}
                </div>

                <p className="text-sm font-semibold text-white">
                  {comment.user?.username || "User"}
                </p>

              </div>

              {/* COMMENT TEXT */}
              <p className="text-sm text-slate-300 mt-3 break-words">
                {comment.text}
              </p>

              <button
              onClick={() => handleDeleteComment(comment._id)}
              className="text-xs text-red-400 hover:text-red-300 mt-2"
              >
             Delete
             </button>

            </div>
          ))
        )}

      </div>

      {/* ADD COMMENT */}
      <div className="mt-4">

        <textarea
          rows="2"
          maxLength={300}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="w-full resize-none rounded-xl bg-[#0b0f1a] border border-white/[0.08] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition"
        />

        <div className="text-right text-xs text-slate-600 mt-1">
          {text.length}/300
        </div>

        <button
          onClick={handleAddComment}
          disabled={isSubmitting || !text.trim()}
          className="w-full mt-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold transition"
        >
          {isSubmitting ? "Posting..." : "Add Comment"}
        </button>

      </div>

    </div>
  );
};

export default Comments;