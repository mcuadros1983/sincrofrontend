import { useEffect, useState } from "react";
import { Table, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createAuthenticatedRequest } from "../utils/createAuthenticatedRequest";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  const loadCustomers = async () => {
    const res = await fetch("http://localhost:4000/clientes/", {
      credentials: "include",
    });
    const data = await res.json();
    // const sortedCustomers = data.sort((a, b) => a.id - b.id);
    const sortedCustomers = data.sort((a, b) => {
      if (a.nombre === "CENTRAL") return -1;
      if (b.nombre === "CENTRAL") return 1;
      return a.nombre.localeCompare(b.nombre);
    });
    setCustomers(sortedCustomers);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este cliente?"
    );
    if (!confirmDelete) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/clientes/${id}`, {
        credentials: "include",
        method: "DELETE",
      });

      if (res.status === 204) {
        // Eliminación exitosa, actualiza el estado del cliente eliminado
        setCustomers(customers.filter((customer) => customer.id !== id));
      } else {
        // Si hay un error, intenta extraer el mensaje del cuerpo de la respuesta
        const data = await res.json();
        const errorMessage =
          data && data.message ? data.message : "Error desconocido";
        alert(errorMessage);
      }
    } catch (error) {
      console.log(error);
      alert("Error desconocido al eliminar el cliente");
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <Container>
      <h1 className="my-list-title dark-text">Lista de Clientes</h1>
      {/* <Table striped bordered hover variant="dark"> */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre Cliente</th>
            <th>Operaciones</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.nombre}</td>
              <td className="text-center">
                <Button
                  variant="danger"
                  onClick={() => handleDelete(customer.id)}
                  className="mx-2"
                >
                  Eliminar
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate(`/customers/${customer.id}/edit`)}
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
