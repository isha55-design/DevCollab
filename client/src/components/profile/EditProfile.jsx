import React, { useState } from "react";
import { upload } from "@imagekit/javascript";
import api from "../../services/api";

const EditProfile = ({
  user,
  setUser,
  onSave,
  onClose,
}) => {
  const [avatar, setAvatar] = useState(null);

  const uploadAvatar = async () => {
    if (!avatar) return;

    const auth = await api.get("/api/imagekit/auth");

    const result = await upload({
      file: avatar,
      fileName: avatar.name,
      publicKey: auth.data.publicKey,
      token: auth.data.token,
      expire: auth.data.expire,
      signature: auth.data.signature,
    });

    return result.url;
  };

  const handleSave = async () => {
    const avatarUrl = await uploadAvatar();
    onSave(avatarUrl);
  };

  return (
    <section className="mt-7 bg-[#111827] rounded-2xl border border-white/[0.07] p-7 shadow-2xl shadow-black/30">

      <div className="flex items-center justify-between mb-6">

        <div>
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em]">
            Settings
          </p>

          <h3 className="text-2xl font-black text-white mt-1">
            Edit Profile
          </h3>
        </div>

        <button
          onClick={onClose}
          className="text-slate-500 hover:text-white text-xl transition"
        >
          ✕
        </button>

      </div>

      <div className="max-w-xl">

        <label className="block text-sm font-bold text-slate-300 mb-2">
          Username
        </label>

        <input
          type="text"
          value={user.username}
          onChange={(e) =>
            setUser({
              ...user,
              username: e.target.value,
            })
          }
          className="w-full px-4 py-3 rounded-xl bg-[#0b0f1a] border border-white/[0.08] text-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
        />

        <label className="block text-sm font-bold text-slate-300 mb-2 mt-6">
        Bio
        </label>

        <textarea
        value={user.bio || ""}
        onChange={(e) =>
        setUser({
        ...user,
        bio: e.target.value,
        })
       }
        maxLength={150}
        rows={4}
        placeholder="Tell something about yourself..."
        className="w-full px-4 py-3 rounded-xl bg-[#0b0f1a] border border-white/[0.08] text-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition resize-none"
        />

        <label className="block text-sm font-bold text-slate-300 mb-2 mt-6">
          Profile Picture
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files[0])}
          className="w-full px-4 py-3 rounded-xl bg-[#0b0f1a] border border-white/[0.08] text-slate-300"
        />

        <div className="flex gap-3 mt-5">

          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-lg shadow-indigo-600/20"
          >
            Save Changes
          </button>

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-[#1f2937] hover:bg-[#263244] text-slate-300 font-bold transition"
          >
            Cancel
          </button>

        </div>

      </div>
    </section>
  );
};

export default EditProfile;