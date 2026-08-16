import React from "react";

const ProfileHeader = ({ user, onEdit }) => {
  return (
    <section className="bg-[#001F35] rounded-[28px] overflow-hidden border border-white/[0.07] shadow-2xl shadow-black/30">

      {/* Cover */}
      <div className="relative h-56 overflow-hidden bg-[#021D30]">

        {/* Glow */}
        <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="absolute -bottom-40 right-0 w-[450px] h-[450px] rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="absolute top-5 right-32 w-32 h-32 rounded-full bg-white/10 blur-2xl" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        <div className="absolute bottom-7 left-7 md:left-10">
          <p className="text-white/70 text-xs font-bold tracking-[0.2em] uppercase">
            Developer Profile
          </p>

          <p className="text-white text-2xl font-black mt-2">
            Build. Learn. Collaborate.
          </p>
        </div>
      </div>

      {/* Profile body */}
      <div className="px-6 md:px-10 pb-9">

        <div className="flex flex-col md:flex-row md:items-end gap-6">

          {/* Avatar */}
          <div className="-mt-16 relative">

            <div className="w-32 h-32 rounded-full bg-[#111827] p-2 shadow-2xl shadow-black/50">

              <div className="w-full h-full rounded-full overflow-hidden">
            {user.avatar ? (
            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover"/>
             ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-violet-600 to-cyan-400 flex items-center justify-center text-white text-5xl font-black">
            {user.username?.charAt(0).toUpperCase()}
          </div>
           )}
           </div>

            </div>

            {/* Online indicator */}
            <span className="absolute bottom-3 right-3 w-5 h-5 rounded-full bg-emerald-400 border-4 border-[#111827] shadow-lg shadow-emerald-400/30" />

          </div>

          {/* User information */}
          <div className="flex-1 pb-1">

            <div className="flex flex-wrap items-center gap-3">

              <h2 className="text-3xl font-black text-white">
                {user.username}
              </h2>

              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 text-xs font-bold">
                DEVELOPER
              </span>

            </div>

            <p className="text-slate-400 mt-1">
              {user.email}
            </p>

            <p className="text-white mt-3 max-w-xl leading-relaxed">
            {user.bio || "No bio added yet."}
            </p>

          </div>

          {/* Edit */}
          <button
            onClick={onEdit}
            className="px-6 py-3 rounded-xl bg-white text-slate-900 font-bold hover:bg-indigo-400 hover:text-white transition duration-300 shadow-lg"
          >
            Edit Profile
          </button>

        </div>

      </div>
    </section>
  );
};

export default ProfileHeader;