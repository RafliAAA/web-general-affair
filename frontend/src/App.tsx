import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../src/pages/Dashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard/>}></Route>
          <Route path="/aset-perusahaan" element={<Dashboard/>}></Route>
          <Route path="/aset-karyawan" element={<Dashboard/>}></Route>
          <Route path="/kendaraan" element={<Dashboard/>}></Route>
          <Route path="/ruangan" element={<Dashboard/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
