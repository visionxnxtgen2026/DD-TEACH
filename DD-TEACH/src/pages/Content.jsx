import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  PlayCircle,
  ExternalLink,
  Download,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SubjectSidebar from "../features/topics/SubjectSidebar";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { API } from "../utils/api";

export default function Content() {
  const { standard, subject, topic } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 FETCH CONTENT (FIXED)
  useEffect(() => {
    if (!topic) return;

    const fetchContent = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await API.getContent(topic);

        // 🔥 FIX HERE
        const list = res.data || [];

        // 👉 take first content
        setContent(list[0] || null);

      } catch (err) {
        console.error("❌ Fetch Content Error:", err);
        setError("Failed to load content");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [topic]);

  // 🎥 YOUTUBE EMBED FIX
  const getEmbedUrl = (url) => {
    if (!url) return "";
    return url.includes("watch?v=")
      ? url.replace("watch?v=", "embed/")
      : url;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <SubjectSidebar standard={standard} subject={subject} />

        <div className="flex-1 p-6 md:p-10">

          {/* 🔙 BACK */}
          <button
            onClick={() =>
              navigate(`/subject/${standard}/${subject}`)
            }
            className="flex items-center gap-2 text-blue-600 mb-6 hover:underline"
          >
            <ArrowLeft size={18} />
            Back to Topics
          </button>

          {/* LOADING */}
          {loading && (
            <p className="text-center text-gray-500 animate-pulse">
              Loading content...
            </p>
          )}

          {/* ERROR */}
          {!loading && error && (
            <p className="text-center text-red-500">{error}</p>
          )}

          {/* CONTENT */}
          {!loading && !error && content && (
            <>
              {/* HEADER */}
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 capitalize">
                  {content.topic?.title || "Topic"}
                </h1>

                <p className="text-gray-500 mt-2">
                  Learn with PPT & video
                </p>
              </div>

              {/* PPT */}
              <Card className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div className="flex items-center gap-3">
                  <FileText className="text-blue-600" />
                  <span className="font-medium text-gray-800">
                    PPT Material
                  </span>
                </div>

                {content.pptUrl ? (
                  <div className="flex gap-2">

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        window.open(
                          `http://localhost:5000${content.pptUrl}`,
                          "_blank"
                        )
                      }
                    >
                      Open <ExternalLink size={16} />
                    </Button>

                    <Button
                      size="sm"
                      onClick={() =>
                        window.open(
                          `http://localhost:5000${content.pptUrl}`,
                          "_blank"
                        )
                      }
                    >
                      <Download size={16} /> Download
                    </Button>

                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">
                    No PPT available
                  </span>
                )}
              </Card>

              {/* VIDEO */}
              <Card>
                <div className="flex items-center gap-2 mb-4 text-blue-600 font-medium">
                  <PlayCircle />
                  <span>Watch Explanation</span>
                </div>

                {content.youtubeUrl ? (
                  <div className="w-full aspect-video rounded-lg overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src={getEmbedUrl(content.youtubeUrl)}
                      title="YouTube video"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">
                    No video available
                  </div>
                )}
              </Card>
            </>
          )}

          {/* EMPTY */}
          {!loading && !error && !content && (
            <p className="text-center text-gray-400">
              No content found
            </p>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}