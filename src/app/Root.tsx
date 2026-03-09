import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  AlertTriangle,
  Video,
  Map,
  FileText,
  Settings,
  Moon,
  Sun,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Logo } from "@/app/components/logo";
import { ChatbotButton } from "@/app/components/chatbot";

export default function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Define all menu items
  const allNavItems = [
    {
      path: "/",
      icon: LayoutDashboard,
      label: "Dashboard",
      roles: ["petugas", "warga"],
    },
    {
      path: "/pelanggaran",
      icon: AlertTriangle,
      label: "Pelanggaran",
      roles: ["petugas"],
    },
    { path: "/cctv-live", icon: Video, label: "CCTV Live", roles: ["petugas"] },
    { path: "/peta-cctv", icon: Map, label: "Peta CCTV", roles: ["petugas"] },
    {
      path: "/laporan",
      icon: FileText,
      label: "Laporan & Riwayat",
      roles: ["petugas", "warga"],
    },
    {
      path: "/pengaturan",
      icon: Settings,
      label: "Pengaturan",
      roles: ["petugas", "warga"],
    },
  ];

  // Filter menu items based on user role
  const navItems = allNavItems.filter((item) =>
    item.roles.includes(user?.userType || "warga"),
  );

  return (
    <div
      className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8">
              <Logo
                size={32}
                animate={false}
                showText={false}
                variant="light"
              />
            </div>
            <h1 className="text-lg font-bold">Clear-O</h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 ${darkMode ? "bg-gray-800" : "bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900"} text-white shadow-xl z-50 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 border-b border-blue-700/50 bg-white/5 backdrop-blur-sm">
          <Logo size={64} animate={true} showText={true} variant="light" />
        </div>

        <nav className="px-3 space-y-1 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "text-blue-100 hover:bg-blue-800"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-36 left-6 right-6 space-y-2">
          <div className="bg-blue-800 bg-opacity-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-blue-200" />
              <span className="text-xs text-blue-200">Login sebagai:</span>
            </div>
            <p className="font-semibold text-sm">{user?.username}</p>
            <p className="text-xs text-blue-200">{user?.role}</p>
          </div>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-20 left-6 right-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>

        {/* Dark Mode Toggle - Desktop only */}
        <div className="hidden lg:block absolute bottom-6 left-6 right-6">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-800 hover:bg-blue-700 rounded-lg transition-colors"
          >
            {darkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
            <span className="text-sm">
              {darkMode ? "Mode Terang" : "Mode Gelap"}
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-0 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-1 px-2 py-2">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium truncate w-full text-center">
                  {item.label.split(" ")[0]}
                </span>
              </Link>
            );
          })}
          {navItems.length > 4 && (
            <Link
              to={navItems[navItems.length - 1].path}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg transition-colors ${
                location.pathname === navItems[navItems.length - 1].path
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="text-xs font-medium">Lainnya</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Chatbot */}
      <ChatbotButton />
    </div>
  );
}
