import React, { useState } from "react";
import api from "../../services/api";

const SocialLinks = ({ user, setUser }) => {
  const [activeLink, setActiveLink] = useState(null);
  const [url, setUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const linkLabels = {
    portfolio: "🌐 Portfolio",
    github: "💻 GitHub",
    linkedin: "🔗 LinkedIn",
  };

  const openLink = (link) => {
    if (user?.[link]) {
      window.open(user[link], "_blank", "noopener,noreferrer");
    } else {
      setActiveLink(link);
      setUrl("");
    }
  };

  const handleEdit = (link) => {
    setActiveLink(link);
    setUrl(user?.[link] || "");
  };

  const handleSave = async () => {
    const cleanUrl = url.trim();

    if (!cleanUrl) {
      return;
    }

    if (!/^https?:\/\/.+/i.test(cleanUrl)) {
      alert("Please enter a valid URL starting with http:// or https://");
      return;
    }

    try {
      setIsSaving(true);

      const response = await api.put("/api/user/profile", {
        [activeLink]: cleanUrl,
      });

      setUser(response.data.user);

      setActiveLink(null);
      setUrl("");
    } catch (error) {
      console.log(
        "SAVE SOCIAL LINK ERROR:",
        error.response?.data || error.message
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (link) => {
    try {
      const response = await api.put("/api/user/profile", {
        [link]: "",
      });

      setUser(response.data.user);
    } catch (error) {
      console.log(
        "DELETE SOCIAL LINK ERROR:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <>
      {/* SOCIAL LINKS */}
      <div className="flex flex-wrap gap-3 mt-7">
        {["portfolio", "github", "linkedin"].map((link) => (
          <div
            key={link}
            className="flex items-center gap-1"
          >
            {/* MAIN LINK BUTTON */}
            <button
              onClick={() => openLink(link)}
              className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition ${
                user?.[link]
                  ? "bg-[#0b0f1a] border-white/[0.07] text-slate-300 hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-400"
                  : "bg-[#0b0f1a] border-white/[0.07] text-slate-500 hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-400"
              }`}
            >
              {linkLabels[link]}
              {!user?.[link] && (
                <span className="ml-1 text-xs text-slate-600">
                  Not added
                </span>
              )}
            </button>

            {/* EDIT */}
            {user?.[link] && (
              <button
                onClick={() => handleEdit(link)}
                className="px-2.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                title="Edit link"
              >
                ✏️
              </button>
            )}

            {/* DELETE */}
            {user?.[link] && (
              <button
                onClick={() => handleDelete(link)}
                className="px-2.5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                title="Delete link"
              >
                🗑️
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ADD / EDIT LINK MODAL */}
      {activeLink && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#111827] border border-white/[0.08] p-6 rounded-2xl w-full max-w-md shadow-2xl">

            <h3 className="text-xl font-bold text-white mb-2">
              {user?.[activeLink]
                ? "Edit"
                : "Add"}{" "}
              {activeLink.charAt(0).toUpperCase() +
                activeLink.slice(1)}{" "}
              Link
            </h3>

            <p className="text-sm text-slate-500 mb-4">
              Enter your {activeLink} profile URL.
            </p>

            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave();
                }
              }}
              placeholder="https://..."
              autoFocus
              className="w-full px-4 py-3 rounded-xl bg-[#0b0f1a] border border-white/[0.08] text-white placeholder-slate-600 outline-none focus:border-indigo-500 transition"
            />

            <div className="flex gap-3 mt-4">

              {/* CLOSE */}
              <button
                onClick={() => {
                  setActiveLink(null);
                  setUrl("");
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold transition"
              >
                Cancel
              </button>

              {/* SAVE */}
              <button
                onClick={handleSave}
                disabled={isSaving || !url.trim()}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SocialLinks;