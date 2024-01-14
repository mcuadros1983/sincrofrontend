// import React, { useState, useEffect } from "react";
// import { Container, Table, Button, Spinner } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";

// const DebtList = () => {
//   const [debts, setDebts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Obtener la lista de cobranzas al cargar el componente
//     fetchDebts();
//   }, []);

//   const fetchDebts = async () => {
//     try {
//       const response = await fetch("http://localhost:4000/clientes");
//       const data = await response.json();

//       // Filtrar clientes que tienen cuenta corriente
//       const clientsWithDebts = data.filter(
//         (client) =>
//           client.cuentaCorriente && client.cuentaCorriente.cobranzas.length > 0
//       );

//       // Obtener las cobranzas de los clientes filtrados y mapearlas
//       const cobranzas = clientsWithDebts.flatMap((client) =>
//         client.cuentaCorriente.cobranzas.map((cobranza) => ({
//           ...cobranza,
//           cliente: client, // Agregar la referencia al cliente en cada cobranza
//         }))
//       );

//       // Actualizar el estado con la estructura deseada
//       setDebts(clientsWithDebts);
//       setLoading(false);
//       console.log("cobranzas", cobranzas);
//     } catch (error) {
//       console.error("Error al obtener cobranzas", error);
//     }
//   };

//   const handleDelete = async (cobranzaId) => {
//     const confirmDelete = window.confirm(
//       "¿Estás seguro de que deseas eliminar esta cobranza?"
//     );
//     if (!confirmDelete) {
//       return;
//     }

//     try {
//       // Eliminar la cobranza con el ID cobranzaId
//       await fetch(`http://localhost:4000/cobranzas/${cobranzaId}`, {
//         method: "DELETE",
//       });

//       // Actualizar el estado después de eliminar la cobranza
//       setDebts((prevDebts) =>
//         prevDebts.map((client) => ({
//           ...client,
//           cuentaCorriente: {
//             ...client.cuentaCorriente,
//             cobranzas: client.cuentaCorriente.cobranzas.filter(
//               (cobranza) => cobranza.id !== cobranzaId
//             ),
//           },
//         }))
//       );
//     } catch (error) {
//       console.error("Error al eliminar cobranza", error);
//     }
//   };

//   return (
//     <Container>
//       <h1 className="my-list-title dark-text">Lista de Cobranzas</h1>
//       <Table striped bordered hover>
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Fecha</th>
//             <th>Monto Total</th>
//             <th>Cliente</th>
//             <th>Operaciones</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loading ? (
//             <tr>
//               <td colSpan="4" className="text-center">
//                 <Spinner animation="border" role="status" aria-hidden="true" />
//               </td>
//             </tr>
//           ) : (
//             debts.map((client) =>
//               client.cuentaCorriente.cobranzas.map((cobranza) => (
//                 <tr key={cobranza.id}>
//                   <td>{cobranza.id}</td>
//                   <td>
//                     {new Date(cobranza.createdAt).toLocaleDateString("es-ES", {
//                       day: "2-digit",
//                       month: "2-digit",
//                       year: "numeric",
//                     })}
//                   </td>
//                   <td>{cobranza.monto_total}</td>
//                   <td>{client.nombre}</td>
//                   <td className="text-center">
//                     <Button
//                       variant="danger"
//                       onClick={() => handleDelete(cobranza.id)}
//                       className="mx-2"
//                     >
//                       Eliminar
//                     </Button>
//                     <Button
//                       color="inherit"
//                       onClick={() => navigate(`/debts/${cobranza.id}/edit`)}
//                     >
//                       Editar
//                     </Button>
//                   </td>
//                 </tr>
//               ))
//             )
//           )}
//         </tbody>
//       </Table>
//     </Container>
//   );
// };

// export default DebtList;

import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Spinner,
  Modal,
  FormControl,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createAuthenticatedRequest } from "../utils/createAuthenticatedRequest";

const DebtList = () => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [montoCobranza, setMontoCobranza] = useState(0);
  const [cobranzaIdToUpdate, setCobranzaIdToUpdate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener la lista de cobranzas al cargar el componente
    fetchDebts();
  }, []);

  const fetchDebts = async () => {
    try {
      const response = await fetch("http://localhost:4000/clientes", {
        credentials: "include",
      });
      const data = await response.json();

      // Filtrar clientes que tienen cuenta corriente
      const clientsWithDebts = data.filter(
        (client) =>
          client.cuentaCorriente && client.cuentaCorriente.cobranzas.length > 0
      );

      // Obtener las cobranzas de los clientes filtrados y mapearlas
      const cobranzas = clientsWithDebts.flatMap((client) =>
        client.cuentaCorriente.cobranzas.map((cobranza) => ({
          ...cobranza,
          cliente: client, // Agregar la referencia al cliente en cada cobranza
        }))
      );

      // Actualizar el estado con la estructura deseada
      setDebts(clientsWithDebts);
      setLoading(false);
      console.log("cobranzas", cobranzas);
    } catch (error) {
      console.error("Error al obtener cobranzas", error);
    }
  };

  const handleDelete = async (cobranzaId) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar esta cobranza?"
    );
    if (!confirmDelete) {
      return;
    }

    try {
      // Eliminar la cobranza con el ID cobranzaId
      await fetch(`http://localhost:4000/cobranzas/${cobranzaId}`, {
        credentials:"include",
        method: "DELETE",
      });

      // Actualizar el estado después de eliminar la cobranza
      setDebts((prevDebts) =>
        prevDebts.map((client) => ({
          ...client,
          cuentaCorriente: {
            ...client.cuentaCorriente,
            cobranzas: client.cuentaCorriente.cobranzas.filter(
              (cobranza) => cobranza.id !== cobranzaId
            ),
          },
        }))
      );
    } catch (error) {
      console.error("Error al eliminar cobranza", error);
    }
  };

  const handleEdit = (cobranzaId, monto) => {
    setMontoCobranza(monto);
    setCobranzaIdToUpdate(cobranzaId);
    setShowModal(true);
  };

  const handleGuardarCobranza = async () => {
    const confirmGuardar = window.confirm(
      "¿Estás seguro de que deseas editar esta cobranza?"
    );
    if (!confirmGuardar) {
      return;
    }
    try {
      // Actualizar la cobranza con el ID cobranzaId
      console.log("datosfront", cobranzaIdToUpdate, montoCobranza);

      await fetch(`http://localhost:4000/cobranzas/${cobranzaIdToUpdate}`, {
        credentials:"include",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          monto_total: montoCobranza,
        }),
      });

      // Actualizar el estado después de editar la cobranza
      setDebts((prevDebts) =>
        prevDebts.map((client) => ({
          ...client,
          cuentaCorriente: {
            ...client.cuentaCorriente,
            cobranzas: client.cuentaCorriente.cobranzas.map((cobranza) => {
              if (cobranza.id === cobranzaIdToUpdate) {
                return {
                  ...cobranza,
                  monto_total: montoCobranza,
                };
              }
              return cobranza;
            }),
          },
        }))
      );

      // Cerrar el modal después de editar la cobranza
      setShowModal(false);
    } catch (error) {
      console.error("Error al editar cobranza", error);
    }
  };

  return (
    <Container>
      <h1 className="my-list-title dark-text">Lista de Cobranzas</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Fecha</th>
            <th>Monto Total</th>
            <th>Cliente</th>
            <th>Operaciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="text-center">
                <Spinner animation="border" role="status" aria-hidden="true" />
              </td>
            </tr>
          ) : (
            debts.map((client) =>
              client.cuentaCorriente.cobranzas.map((cobranza) => (
                <tr key={cobranza.id}>
                  <td>{cobranza.id}</td>
                  <td>
                    {new Date(cobranza.createdAt).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td>{cobranza.monto_total}</td>
                  <td>{client.nombre}</td>
                  <td className="text-center">
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(cobranza.id)}
                      className="mx-2"
                    >
                      Eliminar
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() =>
                        handleEdit(cobranza.id, cobranza.monto_total)
                      }
                    >
                      Editar
                    </Button>
                  </td>
                </tr>
              ))
            )
          )}
        </tbody>
      </Table>

      {/* Modal para editar cobranza */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar Cobranza</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Monto:</label>
          <FormControl
            type="number"
            value={montoCobranza}
            onChange={(e) => setMontoCobranza(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardarCobranza}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DebtList;
