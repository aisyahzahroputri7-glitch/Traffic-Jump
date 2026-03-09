import { useState } from "react";
import { MapPin, Camera, AlertTriangle, Navigation } from "lucide-react";

interface CCTVMarker {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  status: "active" | "offline" | "violation";
}

const mockMarkers: CCTVMarker[] = [
  {
    id: "CCTV-01",
    name: "Sudirman Utara",
    location: "Jl. Sudirman",
    lat: -6.2088,
    lng: 106.8256,
    status: "active",
  },
  {
    id: "CCTV-02",
    name: "Thamrin Pusat",
    location: "Jl. Thamrin",
    lat: -6.1944,
    lng: 106.8229,
    status: "violation",
  },
  {
    id: "CCTV-03",
    name: "Gatsu Barat",
    location: "Jl. Gatot Subroto",
    lat: -6.2215,
    lng: 106.8164,
    status: "active",
  },
  {
    id: "CCTV-04",
    name: "Rasuna Timur",
    location: "Jl. Rasuna Said",
    lat: -6.2253,
    lng: 106.8331,
    status: "offline",
  },
  {
    id: "CCTV-05",
    name: "Kuningan Selatan",
    location: "Jl. Kuningan",
    lat: -6.2382,
    lng: 106.8306,
    status: "violation",
  },
  {
    id: "CCTV-06",
    name: "Semanggi Junction",
    location: "Jl. Semanggi",
    lat: -6.2263,
    lng: 106.8097,
    status: "active",
  },
  {
    id: "CCTV-07",
    name: "Sudirman Selatan",
    location: "Jl. Sudirman",
    lat: -6.2296,
    lng: 106.8179,
    status: "offline",
  },
  {
    id: "CCTV-08",
    name: "Thamrin Utara",
    location: "Jl. Thamrin",
    lat: -6.1862,
    lng: 106.8237,
    status: "active",
  },
];

export default function PetaCCTV() {
  const [selectedMarker, setSelectedMarker] = useState<CCTVMarker | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("Semua");

  const filteredMarkers =
    filterStatus === "Semua"
      ? mockMarkers
      : mockMarkers.filter((m) => m.status === filterStatus.toLowerCase());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Peta CCTV</h1>
          <p className="text-gray-600 mt-1">
            Visualisasi lokasi CCTV & pelanggaran
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setFilterStatus("Semua")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterStatus === "Semua"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterStatus("Active")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterStatus === "Active"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Aktif
          </button>
          <button
            onClick={() => setFilterStatus("Violation")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterStatus === "Violation"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Pelanggaran
          </button>
          <button
            onClick={() => setFilterStatus("Offline")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterStatus === "Offline"
                ? "bg-gray-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Offline
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-700">Aktif</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-700">Ada Pelanggaran</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
          <span className="text-sm text-gray-700">Offline</span>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="relative aspect-[16/10] bg-gradient-to-br from-blue-100 via-blue-50 to-green-50">
          {/* Mock Map Background */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 800 500">
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="gray"
                  strokeWidth="0.5"
                />
              </pattern>
              <rect width="800" height="500" fill="url(#grid)" />
            </svg>
          </div>

          {/* Navigation Button */}
          <button className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <Navigation className="w-5 h-5 text-blue-600" />
          </button>

          {/* CCTV Markers */}
          {filteredMarkers.map((marker) => {
            const x = (((marker.lng + 106.8) * 1000) % 700) + 50;
            const y = (((marker.lat + 6.2) * 1000) % 400) + 50;

            return (
              <button
                key={marker.id}
                onClick={() => setSelectedMarker(marker)}
                className="absolute group"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all group-hover:scale-125 ${
                    marker.status === "active"
                      ? "bg-green-500"
                      : marker.status === "violation"
                        ? "bg-red-500 animate-pulse"
                        : "bg-gray-400"
                  }`}
                >
                  {marker.status === "violation" ? (
                    <AlertTriangle className="w-5 h-5 text-white" />
                  ) : (
                    <Camera className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {marker.name}
                </div>
              </button>
            );
          })}

          {/* Selected Marker Popup */}
          {selectedMarker && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-2xl p-6 w-96 animate-fade-in">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      selectedMarker.status === "active"
                        ? "bg-green-100"
                        : selectedMarker.status === "violation"
                          ? "bg-red-100"
                          : "bg-gray-100"
                    }`}
                  >
                    <Camera
                      className={`w-6 h-6 ${
                        selectedMarker.status === "active"
                          ? "text-green-600"
                          : selectedMarker.status === "violation"
                            ? "text-red-600"
                            : "text-gray-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {selectedMarker.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedMarker.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMarker(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedMarker.location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedMarker.status === "active"
                        ? "bg-green-100 text-green-800"
                        : selectedMarker.status === "violation"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {selectedMarker.status === "active"
                      ? "Aktif"
                      : selectedMarker.status === "violation"
                        ? "Ada Pelanggaran"
                        : "Offline"}
                  </span>
                </div>

                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-4">
                  Lihat Live Feed
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Heatmap Info */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 rounded-xl shadow-md text-white">
        <h3 className="text-lg font-bold mb-2">Area Rawan Pelanggaran</h3>
        <p className="text-sm text-red-100 mb-4">
          Berdasarkan data, berikut area dengan tingkat pelanggaran tertinggi:
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-20 p-4 rounded-lg">
            <p className="text-2xl font-bold">Jl. Sudirman</p>
            <p className="text-sm text-red-100">45 pelanggaran/minggu</p>
          </div>
          <div className="bg-white bg-opacity-20 p-4 rounded-lg">
            <p className="text-2xl font-bold">Jl. Thamrin</p>
            <p className="text-sm text-red-100">38 pelanggaran/minggu</p>
          </div>
          <div className="bg-white bg-opacity-20 p-4 rounded-lg">
            <p className="text-2xl font-bold">Jl. Kuningan</p>
            <p className="text-sm text-red-100">32 pelanggaran/minggu</p>
          </div>
        </div>
      </div>
    </div>
  );
}
