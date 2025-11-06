import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Upload from "../pages/Upload";
import Recommend from "../pages/Recommend";
import Cart from "../pages/Cart";
import Layout from "./Layout";


export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/upload" />} />
        <Route element={<Layout />}>
            <Route path="/upload" element={<Upload />} />
            <Route path="/recommend" element={<Recommend />} />
            <Route path="/cart" element={<Cart />} />
        </Route>
        <Route path="*" element={<div className="p-10 text-center text-gray-500">404 Not Found</div>} />
      </Routes>
    </Router>
  );
}
