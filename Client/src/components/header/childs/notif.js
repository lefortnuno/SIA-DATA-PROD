import { BsBell } from "react-icons/bs";

export default function Notif() {
  return (
    <li className="nav-item  pe-2 d-flex align-items-center">
      <div className="nav-link text-body p-0">
        <BsBell className="cursor-pointer" size={15} />
      </div>
    </li>
  );
}
