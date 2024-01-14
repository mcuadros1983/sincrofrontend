import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Container, Button } from "react-bootstrap";
import { createAuthenticatedRequest } from "../utils/createAuthenticatedRequest";

export default function ReceiptItem() {
  const [productsReceipt, setProductsReceipt] = useState([]);

  const params = useParams();

  const loadReceiptsProducts = async (id) => {
    const res = await fetch(`http://localhost:4000/ingresos/${id}/productos`, {
      credentials: "include",
    });
    const data = await res.json();
    setProductsReceipt(data);
  };

  useEffect(() => {
    loadReceiptsProducts(params.id);
  }, [params.id]);

  return (
    <Container>
      <h1 className="my-list-title dark-text">Lista de Productos</h1>
      {/* <Table striped bordered hover variant="dark"> */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Codigo de Barra</th>
            <th>Numero de Media</th>
            <th>precio</th>
            <th>Peso</th>
            <th>Tropa</th>
            {/* <th>Operaciones</th> */}
          </tr>
        </thead>
        <tbody>
          {productsReceipt.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.codigo_de_barra}</td>
              <td>{product.num_media}</td>
              <td>{product.precio}</td>
              <td>{product.kg}</td>
              <td>{product.tropa}</td>
              {/* <td className="text-center">
                <Button
                  variant="danger"
                  onClick={() => handleDelete(product.id)}
                  className="mx-2"
                >
                  Eliminar
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate(`/products/${product.id}/edit`)}
                >
                  Editar
                </Button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
