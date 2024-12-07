import { Link, useLocation } from "react-router-dom";

import {
  BsHouseFill,
  BsCalendarFill,
  BsClockFill,
  BsPeopleFill,
  BsBarChartFill,
  BsPersonCircle,
  BsGearFill,
  BsSpeedometer2,
  BsSpeedometer,
  BsTable,
} from "react-icons/bs";

import "./sidebar.css";

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside
      className="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3 bg-white"
      id="sidenav-main"
    >
      <div className="sidenav-header">
        <div className="sidenav-header-logo"></div>
      </div>
      <hr className="horizontal dark mt-0" />
      <div
        className="collapse navbar-collapse w-auto nySidebar-ko"
        // id="sidenav-collapse-main"
      >
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link
              to="/home/"
              className={`nav-link customNavLink ${
                location.pathname === "/home/" ? "atato" : ""
              }`}
            >
              <div className="navIcone">
                <BsHouseFill />
              </div>
              <span
                className={`navText ${
                  location.pathname === "/home/" ? "atato" : ""
                }`}
              >
                Tableau de Bord
              </span>
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/productions/"
              className={`nav-link customNavLink ${
                location.pathname === "/productions/" ? "atato" : ""
              }`}
            >
              <div className="navIcone">
                <BsTable />
              </div>
              <span
                className={`navText ${
                  location.pathname === "/productions/" ? "atato" : ""
                }`}
              >
                Table des Voitures
              </span>
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/machines/"
              className={`nav-link customNavLink ${
                location.pathname === "/machines/" ? "atato" : ""
              }`}
            >
              <div className="navIcone">
                <BsSpeedometer2 />
              </div>
              <span
                className={`navText ${
                  location.pathname === "/machines/" ? "atato" : ""
                }`}
              >
                Capteurs et Données IRL
              </span>
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/stats/"
              className={`nav-link customNavLink ${
                location.pathname === "/stats/" ? "atato" : ""
              }`}
            >
              <div className="navIcone">
                <BsCalendarFill />
              </div>
              <span
                className={`navText ${
                  location.pathname === "/stats/" ? "atato" : ""
                }`}
              >
                Planning et Reunion
              </span>
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/stats/"
              className={`nav-link customNavLink ${
                location.pathname === "/stats/" ? "atato" : ""
              }`}
            >
              <div className="navIcone">
                <BsBarChartFill />
              </div>
              <span
                className={`navText ${
                  location.pathname === "/stats/" ? "atato" : ""
                }`}
              >
                Statistiques et Rapports
              </span>
            </Link>
          </li>

          <hr className="horizontal dark mt-0" />

          <li className="nav-item mt-3">
            <h6 className="ps-4 ms-2 text-uppercase text-xs font-weight-bolder opacity-6">
              Pages: Administrateurs
            </h6>
          </li>

          <li className="nav-item">
            <Link
              to="/users/"
              className={`nav-link customNavLink ${
                location.pathname === "/users/" ? "atato" : ""
              }`}
            >
              <div className="navIcone">
                <BsPeopleFill />
              </div>
              <span
                className={`navText ${
                  location.pathname === "/users/" ? "atato" : ""
                }`}
              >
                Gestions des Utilisateurs
              </span>
            </Link>
          </li>
        </ul>
      </div>

      {/* <div className="sidenav-footer mx-3 ">
        <div
          className="card card-background shadow-none card-background-mask-secondary"
          id="sidenavCard"
        >
          <div className="full-background"></div>
          <div className="card-body text-start p-3 w-100">
            <div className="docs-info">
              <h6 className="text-black text-xs up mb-0">Avez-vous</h6>
              <p className="text-black text-xs font-weight-bold">
                Besoin d'aide ?
              </p>
              <Link to="/docs/">
                <div className="btn btn-white btn-sm w-100 mb-0 docs-aide">
                  Documentation
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div> */}
    </aside>
  );
}
