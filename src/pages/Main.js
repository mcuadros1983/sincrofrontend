import React from "react";
import { useEffect, useState, useContext } from "react";
import Contexts from "../context/Contexts";

export default function Main() {
  const context = useContext(Contexts.promoContext);
  console.log("main", context.promos)
  // const loadBranches = async () => {
  //   const res = await fetch("http://localhost:4000/sucursales", {
  //     credentials: "include",
  //   });
  //   const data = await res.json();
  //   context.setSucursales(data);
  //   console.log("context", context);
  // };

  // const loadPromos = async () => {
  //   const res = await fetch("http://localhost:4000/promociones", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     credentials: "include", // Agrega esta línea para incluir las cookies en la solicitud
  //   });
  //   // console.log(res)
  //   const data = await res.json();
  //   console.log("dataproductlist", data);
  //   const sortedPromos = data.sort((a, b) => a.id - b.id);
  //   context.setPromos(sortedPromos);
  //   console.log("sortedPromos", sortedPromos);
  // };

  // useEffect(() => {
  //   loadPromos();
  //   loadBranches();
  //   // loadCustomers();
  // }, []);

  return (
    <div className="d-flex align-items-center justify-content-center">
      {/* Agregar imagen centrada */}
      <img
        src="/ltc.png" // Ruta relativa al directorio "public"
        alt="LTC Logo"
        className="img-fluid"
        style={{ maxWidth: "50%", height: "auto" }}
      />
    </div>
  );
}
