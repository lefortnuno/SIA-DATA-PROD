import "./App.css";
import "./assets/styles/auth.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/home/home";
import Machines from "./pages/tables/machines";
import Productions from "./pages/tables/productions";
import Stats from "./pages/stats/stat";

import PageNotFound from "./pages/404/page404";

function App() {
  return (
    <div className="App">
      <ToastContainer autoClose={3000} position={"bottom-right"} />
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />

          <Route path="home/" element={<Home />} />
          <Route path="machines/" element={<Machines />} />

          <Route path="productions/" element={<Productions />} />
          <Route path="stats/" element={<Stats />} />

          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
