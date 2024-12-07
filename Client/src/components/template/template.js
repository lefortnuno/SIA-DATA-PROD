import { useState } from "react";
import { toast } from "react-toastify";

import Header from "../../components/header/header";
import Sidebar from "../../components/sidebar/sidebar";
import Footer from "../../components/footer/footer";

import "./template.css";

export default function Template({ children, customInput }) {
  const [val, setVal] = useState(false);

  return (
    <div
      className={`g-sidenav-show  bg-gray-200  ${
        val ? "g-sidenav-pinned" : ""
      }`}
      style={{ margin: "0px", padding: "0px", top: "-40px" }}
    >
      <Sidebar setVal={setVal} />
      <main className="main-content position-relative max-height-vh-200 h-100 border-radius-lg">
        <Header setVal={setVal} />
        <div className="container-fluid py-0">
          {children}
          <Footer />
        </div>
      </main>
    </div>
  );
}
