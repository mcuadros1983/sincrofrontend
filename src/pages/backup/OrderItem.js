import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Container, Button, FormControl } from "react-bootstrap";
import { createAuthenticatedRequest } from "../utils/createAuthenticatedRequest";

export default function OrderItem() {
  const [productsOrder, setProductsOrder] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const params = useParams();

  // loadOrdersProducts

  const loadProductsOrder = async (id) => {
    const res = await fetch(`http://localhost:4000/ordenes/${id}/productos`, {
      credentials: "include",
    });
    const data = await res.json();
    console.log("info", data, params.id);

    // Mapear cada producto para incluir la información de la sucursal
    const productsWithBranch = await Promise.all(
      data.map(async (product) => {
        const productWithBranch = { ...product };

        if (product.sucursal_id) {
          const branch = await fetch(
            `http://localhost:4000/sucursales/${product.sucursal_id}`,
            {
              credentials: "include",
            }
          );
          const branchData = await branch.json();
          productWithBranch.sucursal = branchData;
        }

        return productWithBranch;
      })
    );

    setProductsOrder(productsWithBranch);
  };

  const handleDelete = async (id) => {
    // ... (tu código de eliminación)
  };

  const handleSearch = () => {
    const searchTermLower = searchTerm.toLowerCase();

    if (searchTermLower === "") {
      setFilteredProducts(productsOrder);
    } else {
      const filtered = productsOrder.filter((product) => {
        return (
          product.codigo_de_barra.toLowerCase().includes(searchTermLower) ||
          product.num_media.toString().includes(searchTermLower) ||
          product.tropa.toString().includes(searchTermLower) ||
          (product.sucursal &&
            product.sucursal.nombre.toLowerCase().includes(searchTermLower))
        );
      });
      setFilteredProducts(filtered);
    }
  };

  const handleSort = (columnName) => {
    setSortDirection(
      columnName === sortColumn && sortDirection === "asc" ? "desc" : "asc"
    );

    setSortColumn(columnName);

    const sortedProducts = [...filteredProducts].sort((a, b) => {
      const valueA = a[columnName];
      const valueB = b[columnName];

      if (valueA < valueB) {
        return sortDirection === "asc" ? -1 : 1;
      } else if (valueA > valueB) {
        return sortDirection === "asc" ? 1 : -1;
      } else {
        return 0;
      }
    });

    setFilteredProducts(sortedProducts);
  };

  useEffect(() => {
    loadProductsOrder(params.id);
  }, [params.id]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, productsOrder]);

  return (
    <Container>
      <h1 className="my-list-title dark-text">Lista de Productos Enviados</h1>
      <div className="mb-3">
        <FormControl
          type="text"
          placeholder="Buscar por código de barras, numero de ingreso, número de media o tropa"
          className="mr-sm-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            {/* <th onClick={() => handleSort("createdAt")} style={{ cursor: "pointer" }}>Fecha de ingreso</th> */}
            <th
              onClick={() => handleSort("ingreso_id")}
              style={{ cursor: "pointer" }}
            >
              Num Ingreso
            </th>
            <th
              onClick={() => handleSort("codigo_de_barra")}
              style={{ cursor: "pointer" }}
            >
              Codigo de Barra
            </th>
            <th
              onClick={() => handleSort("num_media")}
              style={{ cursor: "pointer" }}
            >
              Numero de Media
            </th>
            <th
              onClick={() => handleSort("precio")}
              style={{ cursor: "pointer" }}
            >
              precio
            </th>
            <th onClick={() => handleSort("kg")} style={{ cursor: "pointer" }}>
              Peso
            </th>
            <th
              onClick={() => handleSort("tropa")}
              style={{ cursor: "pointer" }}
            >
              Tropa
            </th>
            <th>Sucursal</th>
            {/* <th>Operaciones</th> */}
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              {/* <td>{new Date(product.createdAt).toLocaleDateString("es-ES")}</td> */}
              <td>{product.ingreso_id}</td>
              <td>{product.codigo_de_barra}</td>
              <td>{product.num_media}</td>
              <td>{product.precio}</td>
              <td>{product.kg}</td>
              <td>{product.tropa}</td>
              <td>
                {product.sucursal
                  ? product.sucursal.nombre
                  : "Sucursal Desconocida"}
              </td>
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
