import {
  Camera,
  MapPin,
  DollarSign,
  Users,
  Save,
  User,
  Car,
  Bell,
  FileText,
  Phone,
  Eye,
  EyeOff,
  CheckCircle,
  Plus,
  Trash2,
  Settings as SettingsIcon,
  X,
  Shield,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

// Modal Component
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
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

// Toast Component
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

type CCTV = { id: string; nama: string; lokasi: string; status: string };
type Zone = { name: string; duration: string };
type UserData = { name: string; email: string; role: string; status: string };

export default function Pengaturan() {
  const { user } = useAuth();
  const isPetugas = user?.userType === "petugas";
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState("");

  // CCTV State
  const [cctvList, setCctvList] = useState<CCTV[]>([
    {
      id: "CCTV-01",
      nama: "Sudirman Utara",
      lokasi: "Jl. Sudirman",
      status: "Aktif",
    },
    {
      id: "CCTV-02",
      nama: "Sudirman Utara",
      lokasi: "Jl. Sudirman",
      status: "Aktif",
    },
    {
      id: "CCTV-03",
      nama: "Sudirman Utara",
      lokasi: "Jl. Sudirman",
      status: "Aktif",
    },
    {
      id: "CCTV-04",
      nama: "Sudirman Utara",
      lokasi: "Jl. Sudirman",
      status: "Aktif",
    },
  ]);
  const [cctvModal, setCctvModal] = useState<null | "add" | CCTV>(null);
  const [cctvForm, setCctvForm] = useState({
    id: "",
    nama: "",
    lokasi: "",
    status: "Aktif",
  });
  const [deleteCctv, setDeleteCctv] = useState<CCTV | null>(null);

  // Zone State
  const [zones, setZones] = useState<Zone[]>([
    { name: "Jl. Sudirman (0 - 500m)", duration: "24 jam" },
    { name: "Jl. Thamrin (100 - 800m)", duration: "06:00 - 22:00" },
    { name: "Jl. Gatot Subroto (200 - 700m)", duration: "24 jam" },
    { name: "Jl. Rasuna Said (0 - 400m)", duration: "07:00 - 20:00" },
  ]);
  const [zoneModal, setZoneModal] = useState<null | "add" | Zone>(null);
  const [zoneForm, setZoneForm] = useState({ name: "", duration: "" });
  const [deleteZone, setDeleteZone] = useState<Zone | null>(null);

  // User State
  const [users, setUsers] = useState<UserData[]>([
    {
      name: "Admin Pusat",
      email: "admin@dishub.jakarta.go.id",
      role: "Administrator",
      status: "Aktif",
    },
    {
      name: "Petugas 1",
      email: "petugas1@dishub.jakarta.go.id",
      role: "Petugas",
      status: "Aktif",
    },
    {
      name: "Petugas 2",
      email: "petugas2@dishub.jakarta.go.id",
      role: "Petugas",
      status: "Aktif",
    },
    {
      name: "Viewer",
      email: "viewer@dishub.jakarta.go.id",
      role: "Read Only",
      status: "Aktif",
    },
  ]);
  const [userModal, setUserModal] = useState<null | "add" | UserData>(null);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "Petugas",
    status: "Aktif",
  });
  const [deactivateUser, setDeactivateUser] = useState<UserData | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // CCTV Handlers
  const openAddCctv = () => {
    setCctvForm({
      id: `CCTV-0${cctvList.length + 1}`,
      nama: "",
      lokasi: "",
      status: "Aktif",
    });
    setCctvModal("add");
  };
  const openEditCctv = (cctv: CCTV) => {
    setCctvForm({ ...cctv });
    setCctvModal(cctv);
  };
  const saveCctv = () => {
    if (cctvModal === "add") {
      setCctvList([...cctvList, cctvForm]);
    } else {
      setCctvList(
        cctvList.map((c) => (c.id === (cctvModal as CCTV).id ? cctvForm : c)),
      );
    }
    setCctvModal(null);
    showToast("Data CCTV berhasil disimpan");
  };
  const confirmDeleteCctv = () => {
    setCctvList(cctvList.filter((c) => c.id !== deleteCctv!.id));
    setDeleteCctv(null);
    showToast("CCTV berhasil dihapus");
  };

  // Zone Handlers
  const openAddZone = () => {
    setZoneForm({ name: "", duration: "" });
    setZoneModal("add");
  };
  const openEditZone = (zone: Zone) => {
    setZoneForm({ ...zone });
    setZoneModal(zone);
  };
  const saveZone = () => {
    if (zoneModal === "add") {
      setZones([...zones, zoneForm]);
    } else {
      setZones(
        zones.map((z) => (z.name === (zoneModal as Zone).name ? zoneForm : z)),
      );
    }
    setZoneModal(null);
    showToast("Data zona berhasil disimpan");
  };
  const confirmDeleteZone = () => {
    setZones(zones.filter((z) => z.name !== deleteZone!.name));
    setDeleteZone(null);
    showToast("Zona berhasil dihapus");
  };

  // User Handlers
  const openAddUser = () => {
    setUserForm({ name: "", email: "", role: "Petugas", status: "Aktif" });
    setUserModal("add");
  };
  const openEditUser = (u: UserData) => {
    setUserForm({ ...u });
    setUserModal(u);
  };
  const saveUser = () => {
    if (userModal === "add") {
      setUsers([...users, userForm]);
    } else {
      setUsers(
        users.map((u) =>
          u.email === (userModal as UserData).email ? userForm : u,
        ),
      );
    }
    setUserModal(null);
    showToast("Data user berhasil disimpan");
  };
  const confirmDeactivate = () => {
    setUsers(
      users.map((u) =>
        u.email === deactivateUser!.email ? { ...u, status: "Nonaktif" } : u,
      ),
    );
    setDeactivateUser(null);
    showToast("User berhasil dinonaktifkan");
  };

  // Warga View
  if (!isPetugas) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pengaturan</h1>
          <p className="text-gray-600 mt-1">Kelola akun dan preferensi Anda</p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-blue-900 px-6 py-4 flex items-center gap-3">
            <User className="w-6 h-6 text-white" />
            <h2 className="text-lg font-bold text-white">Akun & Profil</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">
                  Status Akun: Aktif
                </p>
                <p className="text-sm text-green-700">
                  Akun Anda dalam kondisi baik dan dapat mengakses semua layanan
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue="Budi Santoso"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nomor HP <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  defaultValue="081234567890"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  defaultValue="budi.santoso@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nomor KTP
                </label>
                <input
                  type="text"
                  defaultValue="3174012345678901"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ubah Password
              </label>
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password lama"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <input
                  type="password"
                  placeholder="Password baru"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="password"
                  placeholder="Konfirmasi password baru"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t">
              <button
                onClick={() => showToast("Perubahan berhasil disimpan")}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Save className="w-5 h-5" />
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-green-900 px-6 py-4 flex items-center gap-3">
            <Bell className="w-6 h-6 text-white" />
            <h2 className="text-lg font-bold text-white">
              Pengaturan Notifikasi
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {[
              {
                label: "Notifikasi Pelanggaran Baru",
                desc: "Terima pemberitahuan saat ada pelanggaran terdeteksi",
                checked: true,
              },
              {
                label: "Status Sanksi",
                desc: "Update proses verifikasi dan status sanksi",
                checked: true,
              },
              {
                label: "Pengingat Pembayaran",
                desc: "Reminder sebelum jatuh tempo denda",
                checked: true,
              },
              {
                label: "Info CCTV Area Tertentu",
                desc: "Informasi lokasi CCTV aktif di rute Anda",
                checked: false,
              },
              {
                label: "Promo & Informasi",
                desc: "Berita dan informasi terkait layanan",
                checked: false,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{item.label}</h4>
                  <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    defaultChecked={item.checked}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-orange-900 px-6 py-4 flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-white" />
            <h2 className="text-lg font-bold text-white">
              Bantuan & Informasi
            </h2>
          </div>
          <div className="p-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Butuh Bantuan?
              </h4>
              <div className="space-y-2 text-sm text-blue-800">
                <p>
                  <strong>WhatsApp:</strong> 0812-3456-7890
                </p>
                <p>
                  <strong>Email:</strong> support@dishub.jakarta.go.id
                </p>
                <p>
                  <strong>Jam Operasional:</strong> Senin-Jumat, 08:00 - 17:00
                  WIB
                </p>
              </div>
              <button
                onClick={() => showToast("Laporan berhasil dikirim")}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Laporkan Masalah Aplikasi
              </button>
            </div>
          </div>
        </div>

        {toast && <Toast message={toast} onClose={() => setToast("")} />}
      </div>
    );
  }

  // Petugas View
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pengaturan</h1>
        <p className="text-gray-600 mt-1">Manajemen sistem dan konfigurasi</p>
      </div>

      {/* CCTV Management */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-blue-900 px-6 py-4 flex items-center gap-3">
          <Camera className="w-6 h-6 text-white" />
          <h2 className="text-lg font-bold text-white">Data CCTV</h2>
        </div>
        <div className="p-6">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Kelola data CCTV yang terpasang
            </p>
            <button
              onClick={openAddCctv}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              + Tambah CCTV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    ID CCTV
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Nama
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Lokasi
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cctvList.map((cctv) => (
                  <tr key={cctv.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {cctv.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {cctv.nama}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {cctv.lokasi}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${cctv.status === "Aktif" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {cctv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditCctv(cctv)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteCctv(cctv)}
                          className="text-red-600 hover:text-red-800 text-sm font-semibold"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Zone Management */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-purple-900 px-6 py-4 flex items-center gap-3">
          <MapPin className="w-6 h-6 text-white" />
          <h2 className="text-lg font-bold text-white">
            Area Larangan Berhenti
          </h2>
        </div>
        <div className="p-6">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Kelola zona yang dilarang untuk berhenti
            </p>
            <button
              onClick={openAddZone}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              + Tambah Zona
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {zones.map((zone, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h4 className="font-semibold text-gray-900 mb-2">
                  {zone.name}
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Waktu berlaku: {zone.duration}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditZone(zone)}
                    className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteZone(zone)}
                    className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sanctions */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-green-900 px-6 py-4 flex items-center gap-3">
          <DollarSign className="w-6 h-6 text-white" />
          <h2 className="text-lg font-bold text-white">Nominal Sanksi</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Denda Berhenti Sembarangan
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  Rp
                </span>
                <input
                  type="number"
                  defaultValue="250000"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Denda Pelanggaran Berulang (tambahan)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  Rp
                </span>
                <input
                  type="number"
                  defaultValue="500000"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durasi Minimum Berhenti (detik)
              </label>
              <input
                type="number"
                defaultValue="30"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grace Period (detik)
              </label>
              <input
                type="number"
                defaultValue="10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* User Access */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-red-900 px-6 py-4 flex items-center gap-3">
          <Users className="w-6 h-6 text-white" />
          <h2 className="text-lg font-bold text-white">Hak Akses User</h2>
        </div>
        <div className="p-6">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Kelola pengguna dan hak akses mereka
            </p>
            <button
              onClick={openAddUser}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              + Tambah User
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Nama
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((u, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {u.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {u.email}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${u.status === "Aktif" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditUser(u)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                        >
                          Edit
                        </button>
                        {u.status === "Aktif" && (
                          <button
                            onClick={() => setDeactivateUser(u)}
                            className="text-red-600 hover:text-red-800 text-sm font-semibold"
                          >
                            Nonaktifkan
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={() => showToast("Semua perubahan berhasil disimpan")}
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
        >
          <Save className="w-5 h-5" />
          Simpan Semua Perubahan
        </button>
      </div>

      {/* CCTV Modal */}
      {cctvModal !== null && (
        <Modal
          title={cctvModal === "add" ? "Tambah CCTV" : "Edit CCTV"}
          onClose={() => setCctvModal(null)}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                ID CCTV
              </label>
              <input
                value={cctvForm.id}
                onChange={(e) =>
                  setCctvForm({ ...cctvForm, id: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="CCTV-01"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nama
              </label>
              <input
                value={cctvForm.nama}
                onChange={(e) =>
                  setCctvForm({ ...cctvForm, nama: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Nama lokasi"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Lokasi
              </label>
              <input
                value={cctvForm.lokasi}
                onChange={(e) =>
                  setCctvForm({ ...cctvForm, lokasi: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Jl. ..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Status
              </label>
              <select
                value={cctvForm.status}
                onChange={(e) =>
                  setCctvForm({ ...cctvForm, status: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option>Aktif</option>
                <option>Nonaktif</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCctvModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={saveCctv}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete CCTV Confirm */}
      {deleteCctv && (
        <Modal title="Hapus CCTV" onClose={() => setDeleteCctv(null)}>
          <p className="text-gray-700 mb-6">
            Apakah Anda yakin ingin menghapus <strong>{deleteCctv.id}</strong>?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteCctv(null)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={confirmDeleteCctv}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
            >
              Hapus
            </button>
          </div>
        </Modal>
      )}

      {/* Zone Modal */}
      {zoneModal !== null && (
        <Modal
          title={zoneModal === "add" ? "Tambah Zona" : "Edit Zona"}
          onClose={() => setZoneModal(null)}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nama Zona
              </label>
              <input
                value={zoneForm.name}
                onChange={(e) =>
                  setZoneForm({ ...zoneForm, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Jl. Sudirman (0 - 500m)"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Waktu Berlaku
              </label>
              <input
                value={zoneForm.duration}
                onChange={(e) =>
                  setZoneForm({ ...zoneForm, duration: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="24 jam / 06:00 - 22:00"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setZoneModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={saveZone}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Zone Confirm */}
      {deleteZone && (
        <Modal title="Hapus Zona" onClose={() => setDeleteZone(null)}>
          <p className="text-gray-700 mb-6">
            Apakah Anda yakin ingin menghapus zona{" "}
            <strong>{deleteZone.name}</strong>?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteZone(null)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={confirmDeleteZone}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
            >
              Hapus
            </button>
          </div>
        </Modal>
      )}

      {/* User Modal */}
      {userModal !== null && (
        <Modal
          title={userModal === "add" ? "Tambah User" : "Edit User"}
          onClose={() => setUserModal(null)}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nama
              </label>
              <input
                value={userForm.name}
                onChange={(e) =>
                  setUserForm({ ...userForm, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Nama lengkap"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                value={userForm.email}
                onChange={(e) =>
                  setUserForm({ ...userForm, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="email@dishub.jakarta.go.id"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Role
              </label>
              <select
                value={userForm.role}
                onChange={(e) =>
                  setUserForm({ ...userForm, role: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option>Administrator</option>
                <option>Petugas</option>
                <option>Read Only</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setUserModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={saveUser}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Deactivate User Confirm */}
      {deactivateUser && (
        <Modal title="Nonaktifkan User" onClose={() => setDeactivateUser(null)}>
          <p className="text-gray-700 mb-6">
            Apakah Anda yakin ingin menonaktifkan{" "}
            <strong>{deactivateUser.name}</strong>?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeactivateUser(null)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={confirmDeactivate}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
            >
              Nonaktifkan
            </button>
          </div>
        </Modal>
      )}

      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}
