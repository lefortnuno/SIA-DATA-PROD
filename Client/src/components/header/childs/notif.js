import axios from "../../../contexts/api/axios";

import { BsBell } from "react-icons/bs";

export default function Notif() {
  function glitchResetDataBase() {
    axios
      .get(`machines/glitch/`)
      .then(function (response) {
        console.log(response);
      })
      .catch((error) => {});
  }
  return (
    <li className="nav-item  pe-2 d-flex align-items-center">
      <div
        className="nav-link text-body p-0"
        onClick={() => glitchResetDataBase()}
      >
        <BsBell className="cursor-pointer" size={15} />
      </div>
    </li>
  );
}
