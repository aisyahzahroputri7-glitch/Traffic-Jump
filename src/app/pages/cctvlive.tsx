import { useState } from "react";
import { Maximize2, MapPin } from "lucide-react";
import { ImageWithFallback } from "@/app/components/Figma/ImageWithFallback";

interface CCTVCamera {
  id: string;
  name: string;
  location: string;
  status: "active" | "offline";
  stream: string;
}

const mockCCTVs: CCTVCamera[] = [
  {
    id: "CCTV-01",
    name: "Sudirman Utara",
    location: "Jl. Sudirman",
    status: "active",
    stream:
      "https://images.unsplash.com/photo-1591768575818-ded9c84eb9ba?w=400&h=300&fit=crop",
  },
  {
    id: "CCTV-02",
    name: "Thamrin Pusat",
    location: "Jl. Thamrin",
    status: "active",
    stream:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop",
  },
  {
    id: "CCTV-03",
    name: "Gatsu Barat",
    location: "Jl. Gatot Subroto",
    status: "active",
    stream:
      "https://images.unsplash.com/photo-1486326658981-ed68abe5868e?w=400&h=300&fit=crop",
  },
  {
    id: "CCTV-04",
    name: "Rasuna Timur",
    location: "Jl. Rasuna Said",
    status: "offline",
    stream: "",
  },
  {
    id: "CCTV-05",
    name: "Kuningan Selatan",
    location: "Jl. Kuningan",
    status: "active",
    stream:
      "https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=400&h=300&fit=crop",
  },
  {
    id: "CCTV-06",
    name: "Semanggi Junction",
    location: "Jl. Semanggi",
    status: "active",
    stream:
      "https://images.unsplash.com/photo-1502389614-e0b02a8e6886?w=400&h=300&fit=crop",
  },
  {
    id: "CCTV-07",
    name: "Sudirman Selatan",
    location: "Jl. Sudirman",
    status: "offline",
    stream: "",
  },
  {
    id: "CCTV-08",
    name: "Thamrin Utara",
    location: "Jl. Thamrin",
    status: "active",
    stream:
      "https://images.unsplash.com/photo-1527870672648-0127800ce45b?w=400&h=300&fit=crop",
  },
  {
    id: "CCTV-09",
    name: "Gatsu Tengah",
    location: "Jl. Gatot Subroto",
    status: "active",
    stream:
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=400&h=300&fit=crop",
  },
];

export default function CCTVLive() {
  const [selectedLocation, setSelectedLocation] = useState("Semua");
  const [fullscreenCCTV, setFullscreenCCTV] = useState<CCTVCamera | null>(null);

  const filteredCCTVs =
    selectedLocation === "Semua"
      ? mockCCTVs
      : mockCCTVs.filter((cctv) => cctv.location === selectedLocation);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CCTV Live</h1>
          <p className="text-gray-600 mt-1">
            Pemantauan langsung kondisi jalan
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter Lokasi
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>Semua</option>
            <option>Jl. Sudirman</option>
            <option>Jl. Thamrin</option>
            <option>Jl. Gatot Subroto</option>
            <option>Jl. Rasuna Said</option>
            <option>Jl. Kuningan</option>
          </select>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 w-4 h-4 rounded-full animate-pulse"></div>
            <div>
              <p className="text-sm text-gray-600">CCTV Aktif</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockCCTVs.filter((c) => c.status === "active").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 w-4 h-4 rounded-full"></div>
            <div>
              <p className="text-sm text-gray-600">CCTV Offline</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockCCTVs.filter((c) => c.status === "offline").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CCTV Grid */}
      <div className="grid grid-cols-3 gap-6">
        {filteredCCTVs.map((cctv) => (
          <div
            key={cctv.id}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="relative aspect-video bg-gray-900">
              {cctv.status === "active" ? (
                <>
                  <ImageWithFallback
                    src={cctv.stream}
                    alt={cctv.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2 bg-black bg-opacity-60 px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-white text-xs font-semibold">
                      LIVE
                    </span>
                  </div>
                  <button
                    onClick={() => setFullscreenCCTV(cctv)}
                    className="absolute top-3 right-3 bg-black bg-opacity-60 p-2 rounded-full hover:bg-opacity-80 transition-all"
                  >
                    <Maximize2 className="w-4 h-4 text-white" />
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white text-2xl">✕</span>
                    </div>
                    <p className="text-red-400 font-semibold">OFFLINE</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900">{cctv.id}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    cctv.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {cctv.status === "active" ? "Aktif" : "Offline"}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-700">{cctv.name}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                <span>{cctv.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Modal */}
      {fullscreenCCTV && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50"
          onClick={() => setFullscreenCCTV(null)}
        >
          <div
            className="w-full max-w-6xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <ImageWithFallback
                src={fullscreenCCTV.stream}
                alt={fullscreenCCTV.name}
                className="w-full rounded-lg"
              />
              <div className="absolute top-4 left-4 bg-black bg-opacity-70 px-4 py-2 rounded-lg">
                <h3 className="text-white font-bold text-lg">
                  {fullscreenCCTV.id} - {fullscreenCCTV.name}
                </h3>
                <p className="text-gray-300 text-sm">
                  {fullscreenCCTV.location}
                </p>
              </div>
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-black bg-opacity-70 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-semibold">LIVE</span>
              </div>
            </div>

            <button
              onClick={() => setFullscreenCCTV(null)}
              className="w-full mt-4 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
