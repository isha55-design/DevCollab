import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { upload } from "@imagekit/react";

const CreatePost = ({ isOpen, onClose, onPostCreated }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image preview
  useEffect(() => {
    if (!image) {
      setImagePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(image);
    setImagePreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [image]);

  const resetForm = () => {
    setCaption("");
    setImage(null);
    setImagePreview("");
  };

  const handleClose = () => {
    if (isSubmitting) return;

    resetForm();
    onClose();
  };

  const handleCreatePost = async () => {
    if (!caption.trim()) {
      alert("Please write a caption.");
      return;
    }

    if (!image) {
      alert("Please select an image.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Get ImageKit authentication
      const authResponse = await api.get("/api/imagekit/auth");

      const {
        token,
        expire,
        signature,
        publicKey,
      } = authResponse.data;

      // 2. Upload image to ImageKit
      const uploadResponse = await upload({
        file: image,
        fileName: `${Date.now()}-${image.name}`,
        token,
        expire,
        signature,
        publicKey,
      });

      if (!uploadResponse?.url) {
        throw new Error("Image upload failed.");
      }

      // 3. Save post in our backend
      const response = await api.post("/api/posts/create", {
        caption: caption.trim(),
        image: uploadResponse.url,
      });

      console.log("POST CREATED:", response.data);

      // 4. Tell parent component that post was created
      if (onPostCreated) {
        onPostCreated(response.data.post);
      }

      resetForm();
      onClose();
    } catch (error) {
      console.log(
        "CREATE POST ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Post could not be created."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm px-4 py-6 overflow-y-auto">

      <div className="w-full max-w-lg bg-[#111827] border border-slate-700 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700 sticky top-0 bg-[#111827] z-10">

          <div>
            <h2 className="text-xl font-bold text-white">
              Create a Post
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Share something with the developer community
            </p>
          </div>

          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-9 h-9 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-50 transition"
          >
            ✕
          </button>

        </div>

        {/* Body */}
        <div className="p-6">

          {/* Caption */}
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Caption
          </label>

          <textarea
            placeholder="What are you building?"
            rows="5"
            maxLength={500}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full resize-none rounded-xl bg-[#0f172a] border border-slate-700 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
          />

          <div className="text-right text-xs text-slate-600 mt-1">
            {caption.length}/500
          </div>

          {/* Image */}
          <div className="mt-5">

            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Add an image
            </label>

            <label className="flex flex-col items-center justify-center min-h-32 rounded-xl border-2 border-dashed border-slate-700 hover:border-indigo-500 hover:bg-indigo-500/5 cursor-pointer transition p-4">

              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-60 object-contain rounded-xl"
                />
              ) : (
                <>
                  <span className="text-3xl mb-2">
                    🖼️
                  </span>

                  <span className="text-sm text-slate-400 text-center">
                    Click to select an image
                  </span>
                </>
              )}

              <span className="text-xs text-slate-500 mt-2 text-center">
                {image ? image.name : "PNG, JPG, JPEG, WEBP"}
              </span>

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={(e) =>
                  setImage(e.target.files?.[0] || null)
                }
                className="hidden"
              />

            </label>

          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">

            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 font-semibold transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleCreatePost}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold transition shadow-lg shadow-indigo-600/20"
            >
              {isSubmitting ? "Publishing..." : "Create Post"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CreatePost;