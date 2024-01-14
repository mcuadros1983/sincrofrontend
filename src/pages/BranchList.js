import { useEffect, useState } from "react";
import { Table, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createAuthenticatedRequest } from "../utils/createAuthenticatedRequest";

export default function BranchList() {
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();

  const loadBranches = async () => {
    const res = await fetch("http://localhost:4000/sucursales/", {
      credentials: "include",
    });
    const data = await res.json();
    const sortedBranches = data.sort((a, b) => a.id - b.id);
    setBranches(sortedBranches);
    console.log("storagebranchlist", localStorage.token);
  };

  // const handleDelete = async (id) => {
  //   const confirmDelete = window.confirm(
  //     "¿Estás seguro de que deseas eliminar esta sucursal?"
  //   );
  //   if (!confirmDelete) {
  //     return;
  //   }
  //   try {
  //     const res = await fetch(`http://localhost:4000/sucursales/${id}`, {
  //       credentials: "include",
  //       method: "DELETE",
  //     });
  //     console.log(res);
  //     setBranches(branches.filter((branch) => branch.id !== id));
  //     // loadProducts() ////este metodo funciona pero no es el mas optimo ya que vuelve a cargar todos los productos de la base de datos y no solo el que se elimino;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    loadBranches();
  }, []);

  return (
    <Container>
      <h1 className="my-list-title dark-text">Lista de Sucursales</h1>
      {/* <Table striped bordered hover variant="dark"> */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre Sucursal</th>
            {/* <th>Operaciones</th> */}
          </tr>
        </thead>
        <tbody>
          {branches.map((branch) => (
            <tr key={branch.id}>
              <td>{branch.id}</td>
              <td>{branch.nombre}</td>
              {/* <td className="text-center">
                <Button
                  variant="danger"
                  onClick={() => handleDelete(branch.id)}
                  className="mx-2"
                >
                  Eliminar
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate(`/branches/${branch.id}/edit`)}
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
