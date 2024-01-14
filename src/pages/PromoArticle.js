import { useEffect, useState, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Table, Container, Button } from "react-bootstrap";
import { createAuthenticatedRequest } from "../utils/createAuthenticatedRequest";
import Contexts from "../context/Contexts";

export default function PromoArticle(props) {
  const location = useLocation();
  const { articulos } = location.state;

  const [products, setProducts] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';
  const context = useContext(Contexts.promoContext);
  const params = useParams();

  const loadProductsList = async (id) => {
    console.log("promociones", context)
    const res = await fetch(`${apiUrl}/articulos`, {
      credentials: "include",
    });
    const data = await res.json();
    setProductsList(data);
  };

  const getProductName = (productId) => {
    console.log("id", productId);
    const product = productsList.find((product) => product.id == productId);
    console.log("encontrado", product);
    return product ? product.descripcion : "";
  };

  useEffect(() => {
    loadProductsList();
    // loadProducts(params.id);
    //   }, [params.id]);
  }, []);

  return (
    <Container>
      <h1 className="my-list-title dark-text">Detalle de productos</h1>
      {/* <Table striped bordered hover variant="dark"> */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Producto</th>
            <th>Precio/Valor</th>
          </tr>
        </thead>
        <tbody>
          {articulos.map((articulo, index) => (
            <tr key={index}>
              <td> {articulo.articulo_id}</td>
              <td>{getProductName(articulo.articulo_id)}</td>
              <td>{articulo.valor}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
