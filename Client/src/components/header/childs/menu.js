import LogoutConfirmationModal from "../../modals/session/session";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BsGear, BsPower } from "react-icons/bs";

export default function Menu() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleShowLogoutModal = () => setShowLogoutModal(true);
  const handleCloseLogoutModal = () => setShowLogoutModal(false);

  // Fonction pour se déconnecter et rediriger vers la page de connexion
  const seDeconnecterDuSession = (event) => {
    setShowLogoutModal(false);
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <li className="nav-item px-3 d-flex align-items-center">
        <div className="nav-item dropdown">
          <span
            className="profile-pic"
            id="dropdownMenuButton2"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            role="button"
          >
            <span>Menu</span>
          </span>
          <ul
            className="dropdown-menu dropdown-menu-end dropdownProfile px-2 py-3 me-sm-n4"
            aria-labelledby="dropdownMenuButton2"
          >
            <li>
              <div className="user-box">
                <a
                  className="u-img"
                  href="https://trofel.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={
                      process.env.REACT_APP_SUN_COMPLET_URL +
                      "uploads/trofel.png"
                    }
                    alt="Photo de profil"
                  />
                </a>
                <div className="u-text">
                  <h5> LEFORT</h5>
                  <a
                    className="btn btn-rounded btn-danger btn-sm"
                    href="https://trofel.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ cursor: "pointer" }}
                  >
                    Profile
                  </a>
                  <p>CA.23031093</p>
                </div>
              </div>
            </li>
            <div className="dropdown-divider"></div>
            <div className="dropdown-item">
              <BsGear />
              <span>Paramètres</span>
            </div>
            <div
              className="dropdown-item"
              onClick={handleShowLogoutModal}
              role="button"
            >
              <BsPower />
              <span>Se déconnecter</span>
            </div>
          </ul>
        </div>
      </li>

      <LogoutConfirmationModal
        show={showLogoutModal}
        handleClose={handleCloseLogoutModal}
        handleLogout={seDeconnecterDuSession}
      />
    </>
  );
}
