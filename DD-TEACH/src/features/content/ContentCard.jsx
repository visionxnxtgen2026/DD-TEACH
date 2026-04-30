import React from "react";
import {
  FileText,
  PlayCircle,
  ExternalLink,
  Download,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function ContentCard({
  title,
  description,
  pptUrl,
  youtubeUrl,
  loading = false,
}) {
  // 🎥 Convert YouTube URL safely
  const getEmbedUrl = (url) => {
    if (!url) return "";
    try {
      return url.includes("watch?v=")
        ? url.replace("watch?v=", "embed/")
        : url;
    } catch {
      return url;
    }
  };

  return (
    <Card className="space-y-6" loading={loading}>
      
      {/* 📘 HEADER */}
      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
          {title}
        </h2>

        {description && (
          <p className="text-gray-500 text-sm mt-1">
            {description}
          </p>
        )}
      </div>

      {/* 📂 PPT SECTION */}
      {pptUrl ? (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-blue-50 p-4 rounded-xl">
          
          <div className="flex items-center gap-3">
            <FileText className="text-blue-600" />
            <span className="text-gray-700 font-medium">
              PPT Material
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(pptUrl, "_blank")}
              rightIcon={<ExternalLink size={16} />}
            >
              Open
            </Button>

            <Button
              size="sm"
              variant="primary"
              onClick={() => window.open(pptUrl, "_blank")}
              leftIcon={<Download size={16} />}
            >
              Download
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-400">
          No PPT available
        </div>
      )}

      {/* ▶️ YOUTUBE SECTION */}
      {youtubeUrl ? (
        <div className="space-y-3">
          
          <div className="flex items-center gap-2 text-blue-600 font-medium">
            <PlayCircle />
            <span>Watch Explanation</span>
          </div>

          <div className="w-full aspect-video rounded-xl overflow-hidden shadow-sm">
            <iframe
              className="w-full h-full"
              src={getEmbedUrl(youtubeUrl)}
              title="YouTube video"
              allowFullScreen
            />
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-400">
          No video available
        </div>
      )}
    </Card>
  );
}