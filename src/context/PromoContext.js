import React, { createContext, useState, useContext, useEffect } from "react";
import Contexts from "./Contexts";
// const UserContext = createContext();

export default function PromoContext({ children }) {
  const [promos, setPromos] = useState(null);
  const [sucursales, setSucursales] = useState(null);
  const [databaseConnected, setDatabaseConnected] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:4000";

  const syncDatabase = async () => {
    try {
      const response = await fetch(`${apiUrl}/sync-database`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Error al sincronizar la base de datos: ${response.status} ${response.statusText}`
        );
      }

      // La sincronización fue exitosa, actualizamos el estado
      setDatabaseConnected(true);
      console.log("Sincronización exitosa");
    } catch (error) {
      // Error al sincronizar, actualizamos el estado
      setDatabaseConnected(false);
      console.error("Error al sincronizar la base de datos:", error.message);
    }
  };

  const loadSucursales = async () => {
    const res = await fetch(`${apiUrl}/sucursales`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Agrega esta línea para incluir las cookies en la solicitud
    });
    // console.log(res)
    const data = await res.json();
    const sortedSucursales = data.sort((a, b) => a.id - b.id);
    setSucursales(sortedSucursales);
  };
  const loadPromos = async () => {
    const res = await fetch(`${apiUrl}/promociones`, {
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
    syncDatabase();
    // loadCustomers();
  }, []);

  return (
    <Contexts.promoContext.Provider
      value={{
        promos,
        setPromos,
        sucursales,
        setSucursales,
        databaseConnected,
      }}
    >
      {children}
    </Contexts.promoContext.Provider>
  );
}
