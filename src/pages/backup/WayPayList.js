import { useEffect, useState } from "react";
import { Table, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createAuthenticatedRequest } from "../utils/createAuthenticatedRequest";

export default function WayPayList() {
  const [waypays, setWaypays] = useState([]);
  const navigate = useNavigate();

  const loadWayPays = async () => {
    const res = await fetch("http://localhost:4000/formas-pago/", {
      credentials: "include",
    });
    const data = await res.json();
    const sortedWayPays = data.sort((a, b) => a.id - b.id);
    setWaypays(sortedWayPays);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar esta forma de pago?"
    );
    if (!confirmDelete) {
      return;
    }
    try {
      const res = await fetch(`http://localhost:4000/formas-pago/${id}`, {
        credentials:"include",
        method: "DELETE",
      });
      console.log(res);
      setWaypays(waypays.filter((waypay) => waypay.id !== id));
      // loadProducts() ////este metodo funciona pero no es el mas optimo ya que vuelve a cargar todos los productos de la base de datos y no solo el que se elimino;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadWayPays();
  }, []);

  return (
    <Container>
      <h1 className="my-list-title dark-text">Lista de Formas de Pago</h1>
      {/* <Table striped bordered hover variant="dark"> */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Tipo</th>
            <th>Operaciones</th>
          </tr>
        </thead>
        <tbody>
          {waypays.map((waypay) => (
            <tr key={waypay.id}>
              <td>{waypay.id}</td>
              <td>{waypay.tipo}</td>
              <td className="text-center">
                <Button
                  variant="danger"
                  onClick={() => handleDelete(waypay.id)}
                  className="mx-2"
                >
                  Eliminar
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate(`/waypays/${waypay.id}/edit`)}
                >
                  Editar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
