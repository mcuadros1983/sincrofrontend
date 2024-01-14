import React from "react";
import { useEffect, useState, useContext } from "react";
import Contexts from "../context/Contexts";

export default function Main() {
  const context = useContext(Contexts.promoContext);
  return (
    <div className="d-flex align-items-center justify-content-center">
      <img
        src="/ltc.png" // Ruta relativa al directorio "public"
        alt="LTC Logo"
        className="img-fluid"
        style={{ maxWidth: "50%", height: "auto" }}
      />
    </div>
  );
}
