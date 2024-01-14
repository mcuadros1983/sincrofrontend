import { useEffect, useState } from "react";
import { Table, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createAuthenticatedRequest } from "../utils/createAuthenticatedRequest";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  const loadBranches = async () => {
    const res = await fetch("http://localhost:4000/sucursales", {
      credentials: "include",
    });
    const data = await res.json();
    setBranches(data);
  };

  const loadCustomers = async () => {
    const res = await fetch("http://localhost:4000/clientes", {
      credentials: "include",
    });
    const data = await res.json();
    setCustomers(data);
  };

  const loadProducts = async () => {
    const res = await fetch("http://localhost:4000/productos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Agrega esta línea para incluir las cookies en la solicitud
      include: [
        {
          model: "Sucursal",
          attributes: ["nombre"],
        },
        {
          model: "Cliente", // Ajusta el nombre del modelo según tu implementación
          attributes: ["nombre"], // Agrega las propiedades que necesitas
        },
      ],
    });
    // console.log(res)
    const data = await res.json();
    console.log("dataproductlist", data);
    const sortedProducts = data.sort((a, b) => a.id - b.id);
    setProducts(sortedProducts);
    console.log("sortedProducts", sortedProducts);
    //setProducts(data)
    // console.log(products);
    // products.map((product) => {
    //   console.log(product.codigo_de_barra);
    // });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este producto?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/productos/${id}`, {
        credentials: "include",
        method: "DELETE",
      });

      if (!res.ok) {
        // Si la respuesta no es exitosa, mostrar mensaje de error
        const errorData = await res.json();
        alert(errorData.mensaje)
      } else {
        // Si la respuesta es exitosa, eliminar el producto del estado local
        setProducts(products.filter((product) => product.id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadProducts();
    loadBranches();
    loadCustomers();
  }, []);

  // funcion para buscar el nombre de la sucursal segun el product.branch_id
  const getBranchName = (branchId) => {
    const branch = branches.find((branch) => branch.id === branchId);
    return branch ? branch.nombre : "";
  };

  const getCustomerName = (customer_id) => {
    const customer = customers.find((customer) => customer.id === customer_id);
    return customer ? customer.nombre : "";
  };

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
            <th>Precio</th>
            <th>Peso</th>
            <th>Tropa</th>
            <th>Sucursal</th>
            <th>Cliente</th>
            <th>Operaciones</th>
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
              {/* <td>{product.sucursal_id}</td> */}
              {/* <td>{getBranchName(product.sucursal_id)}</td> */}
              {/* <td>{getCustomerName(product.cliente_id)}</td> */}
              <td>
                {product.Sucursal
                  ? product.Sucursal.nombre
                  : "Sucursal Desconocida"}
              </td>
              <td>
                {product.Cliente
                  ? product.Cliente.nombre
                  : "Cliente Desconocido"}
              </td>
              <td className="text-center">
                <Button
                  variant="danger"
                  onClick={() => handleDelete(product.id)}
                  className="mx-2"
                >
                  Eliminar
                </Button>
                {/* <Button
                  color="inherit"
                  onClick={() => navigate(`/productos/${product.id}/edit`)}
                >
                  Editar
                </Button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
