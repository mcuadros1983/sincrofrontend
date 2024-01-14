import { useEffect, useState } from "react";
import { Table, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createAuthenticatedRequest } from "../utils/createAuthenticatedRequest";

export default function BranchList() {
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';

  const loadBranches = async () => {
    const res = await fetch(`${apiUrl}/sucursales`, {
      credentials: "include",
    });
    const data = await res.json();
    const sortedBranches = data.sort((a, b) => a.id - b.id);
    setBranches(sortedBranches);
    console.log("storagebranchlist", localStorage.token);
  };

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
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
