import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "sonner";
import Spinner from "./components/layout/Spinner";
import { useAuthStore } from "./features/auth/stores/useAuthStore";

const Dashboard = lazy(() => import("./pages/Dashboard"));
// const Projects = lazy(() => import("./pages/projects/Projects"));
// const LoansPage = lazy(() => import("./pages/Loans"));
// const ReturnsPage = lazy(() => import("./pages/Returns"));
const Assets = lazy(() => import("./features/assets/pages/Assets"));
const AssetDetail = lazy(() => import("./features/assets/pages/DetailAsset"));
const ProcurementPage = lazy(
  () => import("./features/procurement/pages/ProcurementPage"),
);
const ProcurementDetailPage = lazy(
  () => import("./features/procurement/pages/DetailProcurementPage"),
);
const AdminHandoverPage = lazy(() => import("./features/handover/admin/pages/AdminHandoverPage"))
const DetailHandoverPage = lazy(
  () => import("./features/handover/admin/pages/DetailHandoverPage"),
);
const AdminBorrowPage = lazy(
  () => import("./features/borrow/admin/pages/AdminBorrowPage"),
);
const Borrow = lazy(() => import("./features/borrow/user/pages/BorrowPage"));
const ReturnPage = lazy(() => import("./features/return/pages/ReturnPage"));
const MyMaintenancePage = lazy(() => import("./features/maintenance/user/pages/MyMaintenancePage"));
const MaintenanceDetailPage = lazy(() => import("./features/maintenance/user/pages/MaintenanceDetailPage"));
const AdminMaintenancePage = lazy(() => import("./features/maintenance/admin/pages/AllMaintenancePage"))
const AdminMaintenanceDetailPage = lazy(() => import("./features/maintenance/admin/pages/MaintenanceDetailAdminPage"))
const ITMaintenancePage = lazy(() => import("./features/maintenance/IT/pages/ITMaintenancePage"))
const  ITMaintenanceDetailPage = lazy(() => import("./features/maintenance/IT/pages/MaintenanceDetailITPage"))
const DisposalPage = lazy(() => import("./features/disposal/pages/DisposalPage"))
const DisposalDetailPage = lazy(() => import("./features/disposal/pages/DetailDisposalPage"))
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./features/auth/pages/Login"));
const Register = lazy(() => import("./features/auth/pages/Register"));
const SOP = lazy(() => import("./features/SOP/pages/SOP"));

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
          <Route
            path="/"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          {/* <Route path="/projects" element={user ? <Projects /> : <Navigate to="/login" />} /> */}
          <Route
            path="/pengadaan"
            element={user ? <ProcurementPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/pengadaan/:id"
            element={
              user ? <ProcurementDetailPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/serah-terima"
            element={
              user ? <AdminHandoverPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/serah-terima/:id"
            element={
              user ? <DetailHandoverPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/peminjaman"
            element={user ? <AdminBorrowPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/pengembalian"
            element={user ? <ReturnPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/penghapusan"
            element={user ? <DisposalPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/penghapusan/:id"
            element={user ? <DisposalDetailPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/aset-perusahaan"
            element={user ? <Assets /> : <Navigate to="/login" />}
          />
          <Route
            path="/aset-perusahaan/:id"
            element={user ? <AssetDetail /> : <Navigate to="/login" />}
          />
          <Route
            path="/pengajuan"
            element={user ? <Borrow /> : <Navigate to="/login" />}
          />
          <Route
            path="/aset-karyawan"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/lapor-kerusakan"
            element={user ? <MyMaintenancePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/lapor-kerusakan/:id"
            element={user ? <MaintenanceDetailPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/pemeliharaan"
            element={user ? <AdminMaintenancePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/pemeliharaan/:id"
            element={user ? <AdminMaintenanceDetailPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/perbaikan"
            element={user ? <ITMaintenancePage/> : <Navigate to="/login" />}
          />
          <Route
            path="/perbaikan/:id"
            element={user ? <ITMaintenanceDetailPage/> : <Navigate to="/login" />}
          />
          <Route
            path="/kendaraan"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/ruangan"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/sop"
            element={user ? <SOP /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/" />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
