import { useState, useEffect } from "react";
import { Search, Eye, FileCheck, X, CheckCircle } from "lucide-react";
import { ImageWithFallback } from "@/app/components/Figma/ImageWithFallback";

interface Violation {
  id: number;
  kode_pelanggaran: string;
  no_polisi: string;
  jenis_kendaraan: string;
  waktu_pelanggaran: string;
  status: string;
  foto_url: string | null;
  lokasi: string;
  jenis_pelanggaran: string;
  denda_amount: number;
  petugas: string;
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

function formatWaktu(waktu: string) {
  const d = new Date(waktu);
  return d.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRupiah(amount: number) {
  return "Rp " + amount.toLocaleString("id-ID");
}

export default function Pelanggaran() {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [lokasiFilter, setLokasiFilter] = useState("Semua");
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(
    null,
  );
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/api/pelanggaran-detail")
      .then((res) => res.json())
      .then((data) => {
        setViolations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal fetch pelanggaran:", err);
        setLoading(false);
      });
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleUpdateStatus = async (
    id: number,
    status: string,
    label: string,
  ) => {
    try {
      await fetch(`http://localhost:3001/api/pelanggaran/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setViolations(
        violations.map((v) => (v.id === id ? { ...v, status } : v)),
      );
      setSelectedViolation(null);
      showToast(`Pelanggaran ${label} berhasil diupdate!`);
    } catch (err) {
      showToast("Gagal update status!");
    }
  };

  const lokasis = [
    "Semua",
    ...Array.from(new Set(violations.map((v) => v.lokasi).filter(Boolean))),
  ];

  const filteredViolations = violations.filter((v) => {
    const matchesSearch =
      v.no_polisi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.lokasi?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "Semua" || v.status === statusFilter;
    const matchesLokasi = lokasiFilter === "Semua" || v.lokasi === lokasiFilter;
    return matchesSearch && matchesStatus && matchesLokasi;
  });

  const getStatusStyle = (status: string) => {
    if (status === "terdeteksi") return "bg-yellow-100 text-yellow-800";
    if (status === "dikonfirmasi") return "bg-blue-100 text-blue-800";
    if (status === "sanksi_diberikan") return "bg-green-100 text-green-800";
    if (status === "selesai") return "bg-gray-100 text-gray-700";
    if (status === "banding") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-700";
  };

  const getStatusLabel = (status: string) => {
    if (status === "terdeteksi") return "Belum Diproses";
    if (status === "dikonfirmasi") return "Dikonfirmasi";
    if (status === "sanksi_diberikan") return "Disanksi";
    if (status === "selesai") return "Selesai";
    if (status === "banding") return "Banding";
    return status;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pelanggaran</h1>
        <p className="text-gray-600 mt-1">
          Daftar pelanggaran lalu lintas dari database
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total", value: violations.length, color: "blue" },
          {
            label: "Belum Diproses",
            value: violations.filter((v) => v.status === "terdeteksi").length,
            color: "yellow",
          },
          {
            label: "Disanksi",
            value: violations.filter((v) => v.status === "sanksi_diberikan")
              .length,
            color: "green",
          },
          {
            label: "Selesai",
            value: violations.filter((v) => v.status === "selesai").length,
            color: "gray",
          },
        ].map((item) => (
          <div
            key={item.label}
            className={`bg-${item.color}-50 border border-${item.color}-200 p-4 rounded-xl`}
          >
            <p className={`text-sm text-${item.color}-600 font-medium`}>
              {item.label}
            </p>
            <p className={`text-3xl font-bold text-${item.color}-700`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cari
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nomor plat atau lokasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option>Semua</option>
              <option value="terdeteksi">Belum Diproses</option>
              <option value="dikonfirmasi">Dikonfirmasi</option>
              <option value="sanksi_diberikan">Disanksi</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lokasi
            </label>
            <select
              value={lokasiFilter}
              onChange={(e) => setLokasiFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {lokasis.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
            Memuat data dari database...
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Kode
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Foto
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Nomor Plat
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Lokasi
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Waktu
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Jenis
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredViolations.map((violation) => (
                <tr
                  key={violation.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedViolation(violation)}
                >
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {violation.kode_pelanggaran}
                  </td>
                  <td className="px-6 py-4">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=100&h=60&fit=crop&q=80"
                      alt="Vehicle"
                      className="w-16 h-10 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {violation.no_polisi}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {violation.lokasi}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatWaktu(violation.waktu_pelanggaran)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {violation.jenis_pelanggaran}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(violation.status)}`}
                    >
                      {getStatusLabel(violation.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedViolation(violation);
                        }}
                        className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {violation.status === "terdeteksi" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedViolation(violation);
                          }}
                          className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                          title="Proses"
                        >
                          <FileCheck className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filteredViolations.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-semibold">Tidak ada data ditemukan</p>
            <p className="text-sm mt-1">Coba ubah filter pencarian</p>
          </div>
        )}
      </div>

      {/* Modal Detail */}
      {selectedViolation && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedViolation(null)}
        >
          <div
            className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Detail Pelanggaran
            </h2>
            <div className="space-y-4">
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=450&fit=crop&q=80"
                  alt="Vehicle Detail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Kode Pelanggaran</p>
                  <p className="font-semibold">
                    {selectedViolation.kode_pelanggaran}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nomor Plat</p>
                  <p className="font-semibold">{selectedViolation.no_polisi}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lokasi</p>
                  <p className="font-semibold">{selectedViolation.lokasi}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Waktu</p>
                  <p className="font-semibold">
                    {formatWaktu(selectedViolation.waktu_pelanggaran)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Jenis Pelanggaran</p>
                  <p className="font-semibold">
                    {selectedViolation.jenis_pelanggaran}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Denda</p>
                  <p className="font-semibold text-red-600">
                    {formatRupiah(selectedViolation.denda_amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kendaraan</p>
                  <p className="font-semibold capitalize">
                    {selectedViolation.jenis_kendaraan}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Petugas</p>
                  <p className="font-semibold">{selectedViolation.petugas}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(selectedViolation.status)}`}
                  >
                    {getStatusLabel(selectedViolation.status)}
                  </span>
                </div>
              </div>

              {selectedViolation.status === "terdeteksi" && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        selectedViolation.id,
                        "sanksi_diberikan",
                        selectedViolation.kode_pelanggaran,
                      )
                    }
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
                  >
                    ✓ Berikan Sanksi
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        selectedViolation.id,
                        "selesai",
                        selectedViolation.kode_pelanggaran,
                      )
                    }
                    className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700"
                  >
                    ✗ Legal / Tidak Melanggar
                  </button>
                </div>
              )}

              <button
                onClick={() => setSelectedViolation(null)}
                className="w-full mt-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}
