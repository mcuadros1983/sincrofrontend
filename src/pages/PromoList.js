import { useEffect, useState, useContext } from "react";
import { Table, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createAuthenticatedRequest } from "../utils/createAuthenticatedRequest";
import Contexts from "../context/Contexts";

export default function PromoList() {
  const [promos, setPromos] = useState([]);
  const [branches, setBranches] = useState([]);
  // const [articulos, setArticulos] = useState([]);
  const navigate = useNavigate();

  const context = useContext(Contexts.promoContext);

  const loadBranches = async () => {
    const res = await fetch("http://localhost:4000/sucursales", {
      credentials: "include",
    });
    const data = await res.json();
    setBranches(data);
    context.setSucursales(data)
    console.log("context", context)
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
    console.log("dataproductlist", data);
    const sortedPromos = data.sort((a, b) => a.id - b.id);
    setPromos(sortedPromos);
    context.setPromos(sortedPromos)
    console.log("sortedPromos", sortedPromos);
  };


  useEffect(() => {
    loadPromos();
    loadBranches();
    // loadCustomers();
  }, []);

  // funcion para buscar el nombre de la sucursal segun el product.branch_id
  const getBranchName = (branchId) => {
    console.log("idsucursal", branchId)
    const branch = branches.find((branch) => branch.id == branchId);
    return branch ? branch.nombre : "";
  };

  const handleRowDoubleClick = (promocionId, articulos) => {
    console.log("datos", articulos)
    // Redireccionar a la página deseada con el id y nombre del artículo
    navigate(`/promotions/${promocionId}/products/`, { state: { articulos } });
  };

  return (
    <Container>
      <h1 className="my-list-title dark-text">Lista de Productos</h1>
      {/* <Table striped bordered hover variant="dark"> */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Prioridad</th>
            <th>Sucursal</th>
          </tr>
        </thead>
        <tbody>
          {promos.map((promo) => (
            <tr
              key={promo.promocion.id}
              style={{ cursor: "pointer" }}
              onDoubleClick={() => handleRowDoubleClick(promo.promocion.id, promo.articulos)}
            >
              <td>{promo.promocion.id}</td>
              <td>{promo.promocion.nombre}</td>
              <td>{promo.promocion.fechainicio}</td>
              <td>{promo.promocion.fechafin}</td>
              <td>{promo.promocion.prioridad}</td>
              <td>{getBranchName(promo.promocion.sucursal_id)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
