import React, { useState, useEffect } from "react";
import { Table, Container } from "react-bootstrap";
import { createAuthenticatedRequest } from "../utils/createAuthenticatedRequest";

const AccountList = () => {
  const [clientesConCuenta, setClientesConCuenta] = useState([]);
  const [totalSaldo, setTotalSaldo] = useState(0);

  useEffect(() => {
    // Lógica para obtener la lista de clientes con cuenta corriente
    obtenerClientesConCuenta();
  }, []);

  const obtenerClientesConCuenta = async () => {
    try {
      // Lógica para obtener clientes con cuenta corriente desde el servidor
      // Puedes ajustar la ruta y la lógica según tu API
      const response = await fetch("http://localhost:4000/clientes", {
        credentials: "include",
      });
      const data = await response.json();

      console.log("data", data);

      // Filtrar solo los clientes que tienen cuenta corriente
      const clientesConCuenta = data.filter(
        (cliente) => cliente.cuentaCorriente !== null
      );

      // Mapear los clientes con cuenta corriente
      const clientes = clientesConCuenta.map((cliente) => ({
        id: cliente.id,
        nombre: cliente.nombre,
        saldo: cliente.cuentaCorriente.saldoActual,
      }));

      console.log("clientes", clientes);
      setClientesConCuenta(clientes);

      // // Calcular la suma total de los saldos
      const total = clientes.reduce((suma, cliente) => suma + cliente.saldo, 0);
      setTotalSaldo(total);
      console.log("total", total);
    } catch (error) {
      console.error("Error al obtener clientes con cuenta corriente", error);
    }
  };

  return (
    <Container>
      <h1>Saldos de Clientes</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {clientesConCuenta.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.nombre}</td>
              <td>{cliente.saldo}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div>
        <strong>Total Saldo: {totalSaldo}</strong>
      </div>
    </Container>
  );
};

export default AccountList;
