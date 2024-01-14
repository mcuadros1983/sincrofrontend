import { useEffect, useState } from "react";
import { Table, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createAuthenticatedRequest } from "../utils/createAuthenticatedRequest";

export default function ReceiptList() {
  const [receipts, setReceipts] = useState([]);
  const navigate = useNavigate();

  const loadReceipts = async () => {
    const res = await fetch("http://localhost:4000/ingresos/", {
      credentials: "include",
    });
    const data = await res.json();
    const sortedReceipts = data.sort((a, b) => a.id - b.id);
    setReceipts(sortedReceipts);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este ingreso?"
    );
    if (!confirmDelete) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/ingresos/${id}`, {
        credentials: "include",
        method: "DELETE",
      });

      const data = await res.json();

      // Verificar si la respuesta contiene un mensaje de error
      if (res.status === 400) {
        // Mostrar un alert con el mensaje de error
        window.alert(data.mensaje);
      } else {
        // Eliminación exitosa, actualizar la lista de ingresos
        setReceipts(receipts.filter((receipt) => receipt.id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadReceipts();
  }, []);

  return (
    <Container>
      <h1 className="my-list-title dark-text">Lista de Ingresos</h1>
      {/* <Table striped bordered hover variant="dark"> */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Fecha</th>
            <th>Cantidad de medias</th>
            <th>Peso total</th>
            {/* <th>Ver productos</th> */}
            <th>Operaciones</th>
          </tr>
        </thead>
        <tbody>
          {receipts.map((receipt) => (
            <tr
              key={receipt.id}
              style={{ cursor: "pointer" }}
              onDoubleClick={() => navigate(`/receipts/${receipt.id}/products`)}
            >
              <td>{receipt.id}</td>
              <td>{new Date(receipt.createdAt).toLocaleDateString("es-ES")}</td>
              <td>{receipt.cantidad_total}</td>
              <td>{receipt.peso_total}</td>
              {/* <td>
              <Button
                  color="inherit"
                  // onClick={() => navigate(`/receipts/${receipt.id}/edit`)}
                >
                  Productos
                </Button>
              </td> */}
              <td className="text-center">
                <Button
                  variant="danger"
                  onClick={() => handleDelete(receipt.id)}
                  className="mx-2"
                >
                  Eliminar
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate(`/receipts/${receipt.id}/edit`)}
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
