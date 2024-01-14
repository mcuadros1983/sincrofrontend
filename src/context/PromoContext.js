import React, { createContext, useState, useContext, useEffect } from "react";
import Contexts from "./Contexts";
// const UserContext = createContext();

export default function PromoContext({ children }) {
  const [promos, setPromos] = useState(null);
  const [sucursales, setSucursales] = useState(null);

  const loadSucursales = async () => {
    const res = await fetch("http://localhost:4000/sucursales", {
      credentials: "include",
    });
    const data = await res.json();
    setSucursales(data);
  };

  const loadPromos = async () => {
    const res = await fetch("http://localhost:4000/promociones", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Agrega esta línea para incluir las cookies en la solicitud
    });
    // console.log(res)
    const data = await res.json();
    const sortedPromos = data.sort((a, b) => a.id - b.id);
    setPromos(sortedPromos);
  };

  useEffect(() => {
    loadPromos();
    loadSucursales();
    // loadCustomers();
  }, []);

  return (
    <Contexts.promoContext.Provider
      value={{ promos, setPromos, sucursales, setSucursales }}
    >
      {children}
    </Contexts.promoContext.Provider>
  );
}