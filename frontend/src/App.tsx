import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "sonner";
import Spinner from "./components/layout/Spinner";
import { useAuthStore } from "./features/auth/stores/useAuthStore";
import DashboardLayout from "./components/layout/DashboardLayout";

const AdminDashboardPage = lazy(
  () => import("./features/dashboard/admin/pages/AdminDashboardPage"),
);
const UserDashboardPage = lazy(
  () => import("./features/dashboard/user/pages/UserDashboardPage"),
);
const ITDashboardPage = lazy(
  () => import("./features/dashboard/IT/pages/ITDashboardPage"),
);
const ProfilePage = lazy(() => import("./features/profile/pages/ProfilePage"));
const EntityPage = lazy(() => import("./features/entity/pages/EntityPage"));
const DirectoratePage = lazy(
  () => import("./features/directorate/pages/DirectoratePage"),
);
const Assets = lazy(() => import("./features/assets/pages/Assets"));
const AssetDetail = lazy(() => import("./features/assets/pages/DetailAsset"));
const CategoryPage = lazy(
  () => import("./features/categories/pages/CategoryPage"),
);
const MyAssetPage = lazy(() => import("./features/assets/pages/MyAssets"));
const ProcurementPage = lazy(
  () => import("./features/procurement/pages/ProcurementPage"),
);
const ProcurementDetailPage = lazy(
  () => import("./features/procurement/pages/DetailProcurementPage"),
);
const AdminHandoverPage = lazy(
  () => import("./features/handover/admin/pages/AdminHandoverPage"),
);
const DetailHandoverPage = lazy(
  () => import("./features/handover/admin/pages/DetailHandoverPage"),
);
const AdminBorrowPage = lazy(
  () => import("./features/borrow/admin/pages/AdminBorrowPage"),
);
const DetailBorrowPage = lazy(
  () => import("./features/borrow/admin/pages/DetailBorrowPage"),
);
const Borrow = lazy(() => import("./features/borrow/user/pages/BorrowPage"));
const ReturnPage = lazy(() => import("./features/return/pages/ReturnPage"));
const MyMaintenancePage = lazy(
  () => import("./features/maintenance/user/pages/MyMaintenancePage"),
);
const MaintenanceDetailPage = lazy(
  () => import("./features/maintenance/user/pages/MaintenanceDetailPage"),
);
const AdminMaintenancePage = lazy(
  () => import("./features/maintenance/admin/pages/AllMaintenancePage"),
);
const AdminMaintenanceDetailPage = lazy(
  () => import("./features/maintenance/admin/pages/MaintenanceDetailAdminPage"),
);
const ITMaintenancePage = lazy(
  () => import("./features/maintenance/IT/pages/ITMaintenancePage"),
);
const ITMaintenanceDetailPage = lazy(
  () => import("./features/maintenance/IT/pages/MaintenanceDetailITPage"),
);
const DisposalPage = lazy(
  () => import("./features/disposal/pages/DisposalPage"),
);
const DisposalDetailPage = lazy(
  () => import("./features/disposal/pages/DetailDisposalPage"),
);
const UserManagementPage = lazy(() => import("./features/user/pages/UserPage"));
const NotificationPage = lazy(
  () => import("./features/notifications/pages/NotificationPage"),
);
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./features/auth/pages/Login"));
const Register = lazy(() => import("./features/auth/pages/Register"));
const SOP = lazy(() => import("./features/SOP/pages/SOP"));
const RoomPage = lazy(() => import("./features/rooms/pages/RoomPage"));
const DetailRoomPage = lazy(
  () => import("./features/rooms/pages/DetailRoomPage"),
);
const AdminBookingPage = lazy(
  () => import("./features/bookings/admin/pages/AdminBookingPage"),
);
const UserBookingPage = lazy(
  () => import("./features/bookings/user/pages/UserBookingPage"),
);

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.role || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const RoleBasedDashboard = () => {
  const { user } = useAuthStore();

  if (user?.role === "ADMIN") return <AdminDashboardPage />;
  if (user?.role === "IT") return <ITDashboardPage />;
  if (user?.role === "USER") return <UserDashboardPage />;

  return <Navigate to="/login" replace />;
};

function App() {
  const { user, checkAuth, checkingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) {
    return <Spinner />;
  }

  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Suspense fallback={<Spinner />}>
        <Routes>
          {/* 1. ROUTE PUBLIK */}
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/" />}
          />

          {/* 2. ROUTE PROTECTED */}
          <Route
            element={user ? <DashboardLayout /> : <Navigate to="/login" />}
          >
            {/* ROUTE ALL ROLES */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "IT", "USER"]} />
              }
            >
              <Route path="/" element={<RoleBasedDashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/notifikasi" element={<NotificationPage />} />
              <Route path="/aset-perusahaan/:id" element={<AssetDetail />} />
              <Route path="/sop" element={<SOP />} />
            </Route>

            {/* ROUTE ADMIN */}
            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/pengadaan" element={<ProcurementPage />} />
              <Route
                path="/pengadaan/:id"
                element={<ProcurementDetailPage />}
              />
              <Route path="/serah-terima" element={<AdminHandoverPage />} />
              <Route
                path="/serah-terima/:id"
                element={<DetailHandoverPage />}
              />
              <Route path="/peminjaman" element={<AdminBorrowPage />} />
              <Route path="/peminjaman/:id" element={<DetailBorrowPage />} />
              <Route path="/pengembalian" element={<ReturnPage />} />
              <Route path="/penghapusan" element={<DisposalPage />} />
              <Route path="/penghapusan/:id" element={<DisposalDetailPage />} />
              <Route path="/aset-perusahaan" element={<Assets />} />
              <Route path="/kategori-aset" element={<CategoryPage />} />
              <Route path="/pemeliharaan" element={<AdminMaintenancePage />} />
              <Route
                path="/pemeliharaan/:id"
                element={<AdminMaintenanceDetailPage />}
              />
              <Route
                path="/management-users"
                element={<UserManagementPage />}
              />
              <Route path="/entity" element={<EntityPage />} />
              <Route path="/directorate" element={<DirectoratePage />} />
              <Route path="/aset-karyawan" element={<AdminDashboardPage />} />
              <Route path="/kendaraan" element={<AdminDashboardPage />} />
              <Route path="/ruangan" element={<RoomPage />} />
              <Route path="/ruangan/:id" element={<DetailRoomPage />} />
              <Route
                path="/persetujuan-ruangan"
                element={<AdminBookingPage />}
              />
              <Route path="/ruangan" element={<RoomPage />} />
            </Route>

            {/* ROUTE IT */}
            <Route element={<ProtectedRoute allowedRoles={["IT"]} />}>
              <Route path="/perbaikan" element={<ITMaintenancePage />} />
              <Route
                path="/perbaikan/:id"
                element={<ITMaintenanceDetailPage />}
              />
            </Route>
            {/* ROUTE USER */}
            <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
              <Route path="/lapor-kerusakan" element={<MyMaintenancePage />} />
              <Route
                path="/lapor-kerusakan/:id"
                element={<MaintenanceDetailPage />}
              />
              <Route path="/pengajuan" element={<Borrow />} />
              <Route path="/aset-saya" element={<MyAssetPage />} />
              <Route path="/peminjaman-ruangan" element={<UserBookingPage />} />
            </Route>
          </Route>
          {/* 3. FALLBACK / 404 NOT FOUND */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
