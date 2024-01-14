import { useLocation } from "react-router-dom";
import { Table, Container, Button } from "react-bootstrap";
import { createAuthenticatedRequest } from "../utils/createAuthenticatedRequest";

export default function StockProductsList() {
  const location = useLocation();
  const { state } = location;

  // Verifica si hay productos en el estado de la ubicación
  const products = state?.products || [];
  console.log("products", products);

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
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.codigo_de_barra}</td>
              <td>{product.num_media}</td>
              <td>{product.precio}</td>
              <td>{product.kg}</td>
              <td>{product.tropa}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
