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

  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:4000";

  const context = useContext(Contexts.promoContext);

  const loadBranches = async () => {
    try {
      console.log("api", apiUrl);
      const res = await fetch(`${apiUrl}/sucursales`, {
        credentials: "include",
      });

      if (!res.ok) {
        // Si la respuesta no es exitosa, lanzamos un error
        throw new Error(`Error de red: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setBranches(data);
      context.setSucursales(data);
      console.log("context", context);
    } catch (error) {
      // En caso de error, mostramos una alerta
      console.error("Error al obtener las sucursales:", error.message);
      alert("Las sucursales no se han podido obtener");
    }
  };

  const loadPromos = async () => {
    try {
      const res = await fetch(`${apiUrl}/promociones`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        // Si la respuesta no es exitosa (por ejemplo, 404 Not Found), lanzamos un error
        throw new Error(
          `Error al obtener las promociones: ${res.status} ${res.statusText}`
        );
      }

      const data = await res.json();
      console.log("dataproductlist", data);
      const sortedPromos = data.sort((a, b) => a.id - b.id);
      setPromos(sortedPromos);
      context.setPromos(sortedPromos);
      console.log("sortedPromos", sortedPromos);
    } catch (error) {
      // En caso de error, mostramos una alerta
      console.error("Error al obtener las promociones:", error.message);
      alert("Las promociones no se han podido obtener");
    }
  };

  useEffect(() => {
    loadPromos();
    loadBranches();
    // loadCustomers();
  }, []);

  // funcion para buscar el nombre de la sucursal segun el product.branch_id
  const getBranchName = (branchId) => {
    try {
      console.log("idsucursal", branchId);
      const branch = branches.find((branch) => branch.id == branchId);
      return branch ? branch.nombre : "";
    } catch (error) {
      // En caso de error, mostramos un mensaje en la consola y devolvemos una cadena vacía
      console.error(
        "Error al obtener el nombre de la sucursal:",
        error.message
      );
      return "";
    }
  };

  const handleRowDoubleClick = (promocionId, articulos) => {
    try {
      console.log("datos", articulos);
      // Redireccionar a la página deseada con el id y nombre del artículo
      navigate(`/promotions/${promocionId}/products/`, {
        state: { articulos },
      });
    } catch (error) {
      // En caso de error, mostramos un mensaje en la consola
      console.error(
        "Error al manejar el doble clic en la fila:",
        error.message
      );
    }
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
              onDoubleClick={() =>
                handleRowDoubleClick(promo.promocion.id, promo.articulos)
              }
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
