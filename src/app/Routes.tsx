import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Dashboard from "./pages/dashboard";
import Pelanggaran from "./pages/pelanggaran";
import CCTVLive from "./pages/cctvlive";
import PetaCCTV from "./pages/petacctv";
import Laporan from "./pages/laporan";
import Pengaturan from "./pages/pengaturan";
import Login from "./pages/login";
import ProtectedRoute from "./components/protectedroute";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Root />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Dashboard },
      { path: "pelanggaran", Component: Pelanggaran },
      { path: "cctv-live", Component: CCTVLive },
      { path: "peta-cctv", Component: PetaCCTV },
      { path: "laporan", Component: Laporan },
      { path: "pengaturan", Component: Pengaturan },
    ],
  },
]);
