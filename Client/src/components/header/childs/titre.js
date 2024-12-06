import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BsArrowLeftCircle, BsArrowLeftCircleFill } from "react-icons/bs";

export default function Titre({ setVal, children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.pathname !== "http://192.168.1.40:8301/") {
      navigate(-1);
    } else {
      navigate("/home");
    }
  };

  return (
    <div onClick={handleBack} className="back-button me-4">
      <BsArrowLeftCircle />
    </div>
  );
}
