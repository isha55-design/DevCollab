import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Developers = () => {
  const [developers, setDevelopers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await api.get("/api/user/developers");
        setDevelopers(response.data.developers);
      } catch (error) {
        console.log(
          error.response?.data || error.message
        );
      }
    };

    fetchDevelopers();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-100">

      <main className="max-w-6xl mx-auto px-5 py-10">

        <h1 className="text-3xl font-black text-white">
          Developers
        </h1>

        <p className="text-slate-400 mt-1">
          Discover developers and their profiles.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

          {developers.map((developer) => (
            <div
            key={developer._id}
            onClick={() => navigate(`/user/${developer._id}`)}
            className="bg-[#111827] border border-white/[0.07] rounded-2xl p-6 cursor-pointer hover:border-indigo-500/40 hover:-translate-y-1 transition duration-300"
            >

              <div className="flex items-center gap-4">

                {developer.avatar ? (
                  <img
                    src={developer.avatar}
                    alt={developer.username}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold">
                    {developer.username
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                <div>
                  <h2 className="text-lg font-bold text-white">
                    {developer.username}
                  </h2>

                  <p className="text-sm text-slate-400">
                    {developer.email}
                  </p>
                </div>

              </div>

              <p className="text-sm text-slate-400 mt-5">
                {developer.bio || "Developer at DevCollab"}
              </p>

            </div>
          ))}

        </div>

      </main>

    </div>
  );
};

export default Developers;