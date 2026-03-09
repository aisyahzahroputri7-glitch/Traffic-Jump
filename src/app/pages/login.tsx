import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/app/context/AuthContext";
import { User, AlertCircle, ShieldCheck, Users, Lock } from "lucide-react";
import { Logo } from "@/app/components/logo";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [userType, setUserType] = useState<"petugas" | "warga">("petugas");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username dan password harus diisi");
      return;
    }

    const success = await login(username, password, userType);
    if (success) {
      navigate("/");
    } else {
      setError("Username atau password salah");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-6 bg-white/10 backdrop-blur-sm rounded-full p-8 shadow-2xl">
            <Logo size={120} animate={true} showText={false} variant="light" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Clear-O</h1>
          <p className="text-cyan-200 text-lg">
            Sistem Monitoring Pelanggaran Lalu Lintas
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login</h2>
          <p className="text-gray-600 mb-6">
            Masukkan kredensial Anda untuk melanjutkan
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setUserType("petugas")}
              className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                userType === "petugas"
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span className="font-semibold">Petugas</span>
            </button>
            <button
              type="button"
              onClick={() => setUserType("warga")}
              className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                userType === "warga"
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-semibold">Warga</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Masukkan username"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Masukkan password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              Masuk
            </button>
          </form>

          <div className="mt-6 space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Demo Petugas:
              </p>
              <p className="text-xs text-blue-700">
                Username:{" "}
                <span className="font-mono font-semibold">petugas</span>
              </p>
              <p className="text-xs text-blue-700">
                Password:{" "}
                <span className="font-mono font-semibold">petugas123</span>
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs font-semibold text-green-900 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" /> Demo Warga:
              </p>
              <p className="text-xs text-green-700">
                Username: <span className="font-mono font-semibold">warga</span>
              </p>
              <p className="text-xs text-green-700">
                Password:{" "}
                <span className="font-mono font-semibold">warga123</span>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-blue-200 text-sm mt-6">
          © 2025 Dishub/Polri - Sistem Monitoring Pelanggaran
        </p>
      </div>
    </div>
  );
}
