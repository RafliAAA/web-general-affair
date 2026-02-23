import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "sonner";
import Spinner from "./components/layout/Spinner";
import { useAuthStore } from "./features/auth/stores/useAuthStore";

const Dashboard = lazy(() => import("./pages/Dashboard"));
// const Projects = lazy(() => import("./pages/projects/Projects"));
// const LoansPage = lazy(() => import("./pages/Loans"));
// const ReturnsPage = lazy(() => import("./pages/Returns"));
const Assets = lazy(() => import("./features/assets/Assets"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./features/auth/pages/Login"));
const Register = lazy(() => import("./features/auth/pages/Register"));

function App() {
  const { user, checkAuth, checkingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  if(checkingAuth) {
    return <Spinner />
  }

  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          {/* <Route path="/projects" element={user ? <Projects /> : <Navigate to="/login" />} />
          <Route path="/peminjaman" element={user ? <LoansPage /> : <Navigate to="/login" />} />
          <Route path="/pengembalian" element={user ? <ReturnsPage /> : <Navigate to="/login" />} /> */}
          <Route path="/aset-perusahaan" element={user ? <Assets /> : <Navigate to="/login" />} />
          <Route path="/aset-karyawan" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/kendaraan" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/ruangan" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
