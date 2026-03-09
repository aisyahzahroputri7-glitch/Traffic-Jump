import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Download,
  FileText,
  Calendar,
  AlertTriangle,
  X,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

const COLORS = ["#2563eb", "#7c3aed", "#dc2626", "#ea580c", "#64748b"];

const BULAN_MAP: Record<string, string> = {
  January: "Jan",
  February: "Feb",
  March: "Mar",
  April: "Apr",
  May: "Mei",
  June: "Jun",
  July: "Jul",
  August: "Agu",
  September: "Sep",
  October: "Okt",
  November: "Nov",
  December: "Des",
};

type Violation = {
  id: string;
  date: string;
  time: string;
  location: string;
  violation: string;
  fine: string;
  status: string;
  evidence: string;
};

type Report = {
  title: string;
  date: string;
  records: number;
};

type DashboardData = {
  total_pelanggaran: number;
  total_sanksi: number;
  pelanggaran_hari_ini: number;
  distribusi_lokasi: { nama_jalan: string; jumlah: number }[];
  tren_bulanan: { bulan: string; total: number }[];
};

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

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

export default function Laporan() {
  const { user } = useAuth();
  const isPetugas = user?.userType === "petugas";
  const [toast, setToast] = useState("");
  const [detailModal, setDetailModal] = useState<Violation | Report | null>(
    null,
  );
  const [detailType, setDetailType] = useState<"violation" | "report" | null>(
    null,
  );
  const [payModal, setPayModal] = useState<Violation | null>(null);
  const [loading, setLoading] = useState(true);

  // Data dari database
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    total_pelanggaran: 0,
    total_sanksi: 0,
    pelanggaran_hari_ini: 0,
    distribusi_lokasi: [],
    tren_bulanan: [],
  });

  useEffect(() => {
    fetch("http://localhost:3001/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal fetch dashboard:", err);
        setLoading(false);
      });
  }, []);

  // Format data chart dari database
  const monthlyData = dashboardData.tren_bulanan.map((item) => ({
    bulan: BULAN_MAP[item.bulan] || item.bulan,
    pelanggaran: item.total,
  }));

  const locationData = dashboardData.distribusi_lokasi.map((item) => ({
    name: item.nama_jalan,
    value: item.jumlah,
  }));

  const rataPerBulan =
    monthlyData.length > 0
      ? Math.round(
          monthlyData.reduce((s, i) => s + i.pelanggaran, 0) /
            monthlyData.length,
        )
      : 0;

  const persenSanksi =
    dashboardData.total_pelanggaran > 0
      ? (
          (dashboardData.total_sanksi / dashboardData.total_pelanggaran) *
          100
        ).toFixed(1)
      : "0";

  const [violations, setViolations] = useState<Violation[]>([
    {
      id: "TRF-2026-0012",
      date: "15 Jan 2026",
      time: "14:30",
      location: "Jl. Sudirman No. 45",
      violation: "Melanggar Lampu Merah",
      fine: "Rp 500.000",
      status: "Belum Dibayar",
      evidence: "Foto CCTV",
    },
    {
      id: "TRF-2025-1287",
      date: "28 Des 2025",
      time: "09:15",
      location: "Jl. Gatot Subroto",
      violation: "Parkir Sembarangan",
      fine: "Rp 250.000",
      status: "Sudah Dibayar",
      evidence: "Foto CCTV",
    },
    {
      id: "TRF-2025-0945",
      date: "10 Nov 2025",
      time: "16:45",
      location: "Jl. Thamrin",
      violation: "Tidak Pakai Helm",
      fine: "Rp 250.000",
      status: "Sudah Dibayar",
      evidence: "Foto CCTV",
    },
  ]);

  const reports: Report[] = [
    {
      title: "Laporan Mingguan - Minggu 4 Januari 2026",
      date: "27 Jan 2026",
      records: 127,
    },
    {
      title: "Laporan Mingguan - Minggu 3 Januari 2026",
      date: "20 Jan 2026",
      records: 98,
    },
    {
      title: "Laporan Mingguan - Minggu 2 Januari 2026",
      date: "13 Jan 2026",
      records: 112,
    },
    {
      title: "Laporan Mingguan - Minggu 1 Januari 2026",
      date: "6 Jan 2026",
      records: 89,
    },
    {
      title: "Laporan Bulanan - Desember 2025",
      date: "31 Des 2025",
      records: 465,
    },
  ];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handlePay = () => {
    if (!payModal) return;
    setViolations(
      violations.map((v) =>
        v.id === payModal.id ? { ...v, status: "Sudah Dibayar" } : v,
      ),
    );
    setPayModal(null);
    showToast("Pembayaran berhasil dikonfirmasi!");
  };

  const handleDownload = (title: string) => showToast(`Mengunduh ${title}...`);
  const handleExportPDF = () => showToast("Mengekspor laporan ke PDF...");
  const handleExportExcel = () => showToast("Mengekspor laporan ke Excel...");

  // Warga View
  if (!isPetugas) {
    const totalFine = violations.reduce(
      (sum, item) => sum + parseInt(item.fine.replace(/[^0-9]/g, "")),
      0,
    );
    const unpaidCount = violations.filter(
      (v) => v.status === "Belum Dibayar",
    ).length;
    const paidCount = violations.filter(
      (v) => v.status === "Sudah Dibayar",
    ).length;

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Riwayat Pelanggaran Saya
          </h1>
          <p className="text-gray-600 mt-1">
            Data pelanggaran dan sanksi atas nama Anda
          </p>
        </div>
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-md text-white">
            <p className="text-sm text-blue-100 mb-1">Total Pelanggaran</p>
            <p className="text-4xl font-bold">{violations.length}</p>
            <p className="text-xs text-blue-100 mt-2">Sepanjang waktu</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl shadow-md text-white">
            <p className="text-sm text-red-100 mb-1">Belum Dibayar</p>
            <p className="text-4xl font-bold">{unpaidCount}</p>
            <p className="text-xs text-red-100 mt-2">Harap segera dilunasi</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-md text-white">
            <p className="text-sm text-green-100 mb-1">Sudah Dibayar</p>
            <p className="text-4xl font-bold">{paidCount}</p>
            <p className="text-xs text-green-100 mt-2">Terima kasih</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-md text-white">
            <p className="text-sm text-purple-100 mb-1">Total Denda</p>
            <p className="text-2xl font-bold">
              Rp {(totalFine / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-purple-100 mt-2">Akumulasi denda</p>
          </div>
        </div>
        {unpaidCount > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-red-900 mb-1">
                  Perhatian: Ada Denda yang Belum Dibayar
                </h3>
                <p className="text-sm text-red-700">
                  Anda memiliki {unpaidCount} pelanggaran yang belum dilunasi.
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-blue-900 px-6 py-4">
            <h3 className="text-lg font-bold text-white">
              Detail Pelanggaran Anda
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {violations.map((violation, index) => (
              <div
                key={index}
                className="px-6 py-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div
                      className={`p-3 rounded-lg ${violation.status === "Belum Dibayar" ? "bg-red-100" : "bg-green-100"}`}
                    >
                      <FileText
                        className={`w-6 h-6 ${violation.status === "Belum Dibayar" ? "text-red-600" : "text-green-600"}`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold text-gray-900">
                          {violation.violation}
                        </h4>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${violation.status === "Belum Dibayar" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                        >
                          {violation.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                        <p className="text-gray-600">
                          <span className="font-semibold">No. Tilang:</span>{" "}
                          {violation.id}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Denda:</span>{" "}
                          <span className="text-red-600 font-bold">
                            {violation.fine}
                          </span>
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Tanggal:</span>{" "}
                          {violation.date} • {violation.time}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Bukti:</span>{" "}
                          {violation.evidence}
                        </p>
                        <p className="text-gray-600 col-span-2">
                          <span className="font-semibold">Lokasi:</span>{" "}
                          {violation.location}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    {violation.status === "Belum Dibayar" && (
                      <button
                        onClick={() => setPayModal(violation)}
                        className="px-5 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors whitespace-nowrap"
                      >
                        Bayar Denda
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setDetailModal(violation);
                        setDetailType("violation");
                      }}
                      className="px-5 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors whitespace-nowrap"
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {payModal && (
          <Modal
            title="Konfirmasi Pembayaran"
            onClose={() => setPayModal(null)}
          >
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-900">
                  {payModal.violation}
                </p>
                <p className="text-sm text-gray-600">{payModal.id}</p>
                <p className="text-2xl font-bold text-red-600 mt-2">
                  {payModal.fine}
                </p>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Lokasi:</strong> {payModal.location}
                </p>
                <p>
                  <strong>Tanggal:</strong> {payModal.date} • {payModal.time}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Metode Pembayaran
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option>Transfer Bank</option>
                  <option>Virtual Account</option>
                  <option>QRIS</option>
                  <option>Minimarket</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setPayModal(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={handlePay}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
                >
                  Konfirmasi Bayar
                </button>
              </div>
            </div>
          </Modal>
        )}
        {detailModal && detailType === "violation" && (
          <Modal
            title="Detail Pelanggaran"
            onClose={() => setDetailModal(null)}
          >
            <div className="space-y-3 text-sm">
              {Object.entries(detailModal as Violation).map(([key, val]) => (
                <div
                  key={key}
                  className="flex justify-between py-2 border-b border-gray-100"
                >
                  <span className="font-semibold text-gray-700 capitalize">
                    {key}
                  </span>
                  <span
                    className={`text-gray-900 ${key === "status" && val === "Belum Dibayar" ? "text-red-600 font-bold" : ""}`}
                  >
                    {val}
                  </span>
                </div>
              ))}
              <button
                onClick={() => setDetailModal(null)}
                className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                Tutup
              </button>
            </div>
          </Modal>
        )}
        {toast && <Toast message={toast} onClose={() => setToast("")} />}
      </div>
    );
  }

  // Petugas View
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Laporan & Riwayat
          </h1>
          <p className="text-gray-600 mt-1">
            Evaluasi dan arsip data pelanggaran
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-md"
          >
            <Download className="w-5 h-5" /> Export PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
          >
            <Download className="w-5 h-5" /> Export Excel
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-5 h-5" />
            <span className="font-semibold">Periode:</span>
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option>Harian</option>
            <option>Mingguan</option>
            <option>Bulanan</option>
            <option>Custom Range</option>
          </select>
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            defaultValue="2026-01-01"
          />
          <span className="text-gray-500">sampai</span>
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            defaultValue="2026-01-27"
          />
        </div>
      </div>

      {/* Stats dari Database */}
      {loading ? (
        <div className="grid grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 animate-pulse p-6 rounded-xl h-32"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-md text-white">
            <p className="text-sm text-blue-100 mb-1">Total Pelanggaran</p>
            <p className="text-4xl font-bold">
              {dashboardData.total_pelanggaran.toLocaleString()}
            </p>
            <p className="text-xs text-blue-100 mt-2">6 bulan terakhir</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-md text-white">
            <p className="text-sm text-purple-100 mb-1">Rata-rata per Bulan</p>
            <p className="text-4xl font-bold">
              {rataPerBulan.toLocaleString()}
            </p>
            <p className="text-xs text-purple-100 mt-2">Dari data bulanan</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl shadow-md text-white">
            <p className="text-sm text-red-100 mb-1">Total Sanksi Diberikan</p>
            <p className="text-4xl font-bold">
              {dashboardData.total_sanksi.toLocaleString()}
            </p>
            <p className="text-xs text-red-100 mt-2">
              {persenSanksi}% dari total
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-md text-white">
            <p className="text-sm text-green-100 mb-1">Pelanggaran Hari Ini</p>
            <p className="text-4xl font-bold">
              {dashboardData.pelanggaran_hari_ini}
            </p>
            <p className="text-xs text-green-100 mt-2">Update real-time</p>
          </div>
        </div>
      )}

      {/* Charts dari Database */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Tren Pelanggaran Bulanan
          </h3>
          {loading ? (
            <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bulan" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} pelanggaran`, ""]} />
                <Bar
                  dataKey="pelanggaran"
                  fill="#2563eb"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Distribusi per Lokasi
          </h3>
          {loading ? (
            <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={locationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {locationData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-blue-900 px-6 py-4">
          <h3 className="text-lg font-bold text-white">Laporan Terbaru</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {reports.map((report, index) => (
            <div
              key={index}
              className="px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {report.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {report.date} • {report.records} pelanggaran
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setDetailModal(report);
                      setDetailType("report");
                    }}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
                  >
                    Lihat
                  </button>
                  <button
                    onClick={() => handleDownload(report.title)}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition-colors"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {detailModal && detailType === "report" && (
        <Modal title="Detail Laporan" onClose={() => setDetailModal(null)}>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-bold text-gray-900">
                {(detailModal as Report).title}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {(detailModal as Report).date}
              </p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {(detailModal as Report).records} pelanggaran
              </p>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <strong>Status:</strong> Selesai
              </p>
              <p>
                <strong>Dibuat oleh:</strong> Sistem Otomatis
              </p>
              <p>
                <strong>Format:</strong> PDF, Excel
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDetailModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  handleDownload((detailModal as Report).title);
                  setDetailModal(null);
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
              >
                Download
              </button>
            </div>
          </div>
        </Modal>
      )}

      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}
