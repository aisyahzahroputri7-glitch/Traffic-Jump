import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  AlertTriangle,
  Camera,
  CameraOff,
  CheckCircle,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

type DashboardPetugas = {
  pelanggaran_hari_ini: number;
  kendaraan_unik: number;
  cctv_aktif: number;
  cctv_nonaktif: number;
  per_jam: { jam: number; total: number }[];
};

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
      <CheckCircle className="w-5 h-5" />
      <span>{message}</span>
      <button onClick={onClose}>
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const isPetugas = user?.userType === "petugas";
  const navigate = useNavigate();
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<DashboardPetugas>({
    pelanggaran_hari_ini: 0,
    kendaraan_unik: 0,
    cctv_aktif: 0,
    cctv_nonaktif: 0,
    per_jam: [],
  });

  const [notifications, setNotifications] = useState<string[]>(
    isPetugas
      ? [
          "⚠ Pelanggaran terdeteksi di Jl. Gatot Subroto",
          "Pelanggaran terdeteksi di Jl. Sudirman",
          "CCTV-05 offline - segera periksa",
        ]
      : [
          "Selamat datang di Sistem Monitoring",
          "Anda memiliki 1 denda yang belum dibayar",
        ],
  );

  useEffect(() => {
    if (isPetugas) {
      fetch("http://localhost:3001/api/dashboard-petugas")
        .then((res) => res.json())
        .then((d) => {
          setData(d);
          setLoading(false);
        })
        .catch(() => setLoading(false));

      const interval = setInterval(() => {
        const locations = [
          "Jl. Sudirman",
          "Jl. Thamrin",
          "Jl. Gatot Subroto",
          "Jl. Rasuna Said",
        ];
        const randomLocation =
          locations[Math.floor(Math.random() * locations.length)];
        setNotifications((prev) => [
          `⚠ Pelanggaran terdeteksi di ${randomLocation}`,
          ...prev.slice(0, 4),
        ]);
      }, 10000);
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [isPetugas]);

  // Format chart data — isi jam yang kosong dengan 0
  const chartData = Array.from({ length: 24 }, (_, i) => {
    const found = data.per_jam.find((p) => p.jam === i);
    const jamStr = `${String(i).padStart(2, "0")}:00`;
    return { jam: jamStr, pelanggaran: found ? found.total : 0 };
  }).filter((_, i) => i % 2 === 0); // tampilkan per 2 jam

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // Dashboard Warga
  if (!isPetugas) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Selamat datang, {user?.username}!
            </p>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-sm text-gray-500">Terakhir diperbarui</div>
            <div className="text-lg font-semibold text-gray-900">
              {new Date().toLocaleTimeString("id-ID")}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 sm:p-8 rounded-xl shadow-md text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="bg-white bg-opacity-20 p-3 sm:p-4 rounded-full">
              <User className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-1">
                Selamat Datang, {user?.username}!
              </h2>
              <p className="text-sm sm:text-base text-blue-100">
                Anda login sebagai Warga. Akses menu untuk melihat riwayat
                pelanggaran Anda.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  Total Pelanggaran Anda
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  3
                </p>
                <p className="text-xs text-gray-500 mt-1">Sepanjang waktu</p>
              </div>
              <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  Denda Belum Dibayar
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  1
                </p>
                <p className="text-xs text-gray-500 mt-1">Rp 500.000</p>
              </div>
              <div className="bg-red-100 p-2 sm:p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  Sudah Dibayar
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  2
                </p>
                <p className="text-xs text-gray-500 mt-1">Terima kasih</p>
              </div>
              <div className="bg-green-100 p-2 sm:p-3 rounded-full">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 p-4 sm:p-6 rounded-lg">
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-red-900 mb-1 text-sm sm:text-base">
                Perhatian: Ada Denda yang Belum Dibayar
              </h3>
              <p className="text-xs sm:text-sm text-red-700 mb-3">
                Anda memiliki 1 pelanggaran yang belum dilunasi.
              </p>
              <button
                onClick={() => navigate("/laporan")}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                Lihat Detail & Bayar
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
            Aktivitas Terbaru
          </h3>
          <div className="space-y-3">
            {notifications.map((notif, index) => (
              <div
                key={index}
                className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs sm:text-sm text-blue-800"
              >
                {notif}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 sm:p-6 rounded-xl shadow-md text-white">
          <h3 className="text-base sm:text-lg font-bold mb-2">
            Informasi Penting
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li>✓ Periksa riwayat pelanggaran Anda secara berkala</li>
            <li>✓ Bayar denda tepat waktu untuk menghindari sanksi tambahan</li>
            <li>
              ✓ Gunakan menu Peta CCTV untuk melihat lokasi kamera pengawas
            </li>
            <li>✓ Hubungi customer service jika ada pertanyaan</li>
          </ul>
        </div>

        {toast && <Toast message={toast} onClose={() => setToast("")} />}
      </div>
    );
  }

  // Dashboard Petugas
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Ringkasan kondisi lalu lintas dan pelanggaran
          </p>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-sm text-gray-500">Terakhir diperbarui</div>
          <div className="text-lg font-semibold text-gray-900">
            {new Date().toLocaleTimeString("id-ID")}
          </div>
        </div>
      </div>

      {/* Stats dari Database */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 animate-pulse h-32 rounded-xl"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  Total Pelanggaran
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {data.pelanggaran_hari_ini}
                </p>
                <p className="text-xs text-gray-500 mt-1">Hari ini</p>
              </div>
              <div className="bg-red-100 p-2 sm:p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  Kendaraan Melanggar
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {data.kendaraan_unik}
                </p>
                <p className="text-xs text-gray-500 mt-1">Unik hari ini</p>
              </div>
              <div className="bg-orange-100 p-2 sm:p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  CCTV Aktif
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {data.cctv_aktif}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Dari {data.cctv_aktif + data.cctv_nonaktif} total
                </p>
              </div>
              <div className="bg-green-100 p-2 sm:p-3 rounded-full">
                <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4 border-gray-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  CCTV Tidak Aktif
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {data.cctv_nonaktif}
                </p>
                <p className="text-xs text-gray-500 mt-1">Perlu perbaikan</p>
              </div>
              <div className="bg-gray-100 p-2 sm:p-3 rounded-full">
                <CameraOff className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart & Notifikasi */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-xl shadow-md">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
            Grafik Pelanggaran per Jam
          </h3>
          {loading ? (
            <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="jam" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} pelanggaran`, ""]} />
                <Line
                  type="monotone"
                  dataKey="pelanggaran"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
            Notifikasi Real-time
          </h3>
          <div className="space-y-3">
            {notifications.map((notif, index) => (
              <div
                key={index}
                className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs sm:text-sm text-red-800"
              >
                {notif}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6 rounded-xl shadow-md text-white">
        <h3 className="text-base sm:text-lg font-bold mb-4">Aksi Cepat</h3>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={() => navigate("/pelanggaran")}
            className="bg-white text-blue-700 px-4 sm:px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
          >
            Lihat Semua Pelanggaran
          </button>
          <button
            onClick={() => navigate("/peta-cctv")}
            className="bg-white text-blue-700 px-4 sm:px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
          >
            Cek Status CCTV
          </button>
          <button
            onClick={() => {
              showToast("Mengekspor laporan...");
              setTimeout(() => navigate("/laporan"), 1000);
            }}
            className="bg-white text-blue-700 px-4 sm:px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
          >
            Export Laporan
          </button>
        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}
