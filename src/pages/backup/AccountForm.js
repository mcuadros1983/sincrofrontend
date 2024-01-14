// import { useState, useEffect } from "react";
// import { Table, Container, Button, FormControl } from "react-bootstrap";

// export default function AccountList() {
//   const [clientes, setClientes] = useState([]);
//   const [selectedCliente, setSelectedCliente] = useState(null);
//   const [movimientos, setMovimientos] = useState([]);
//   const [saldoActual, setSaldoActual] = useState(0);

//   useEffect(() => {
//     // Obtener lista de clientes al cargar el componente
//     obtenerClientes();
//   }, []);

//   const obtenerClientes = async () => {
//     try {
//       const response = await fetch("http://localhost:4000/clientes/"); // Ajusta la ruta de la API
//       const data = await response.json();
//       setClientes(data);
//       console.log("clientes", data);
//     } catch (error) {
//       console.error("Error al obtener clientes", error);
//     }
//   };

//   const handleClienteChange = async (clienteId) => {
//     try {
//       // Obtener movimientos y saldo actual al seleccionar un cliente
//       const response = await fetch(
//         `http://localhost:4000/cuentas-corrientes/${clienteId}/operaciones`
//       ); // Ajusta la ruta de la API
//       const data = await response.json();
//       console.log("data", data);
//       setMovimientos([...data.ventas, ...data.cobranzas]);
//       setSaldoActual(data.saldoActual);
//       setSelectedCliente(clienteId);
//     } catch (error) {
//       console.error("Error al obtener movimientos y saldo", error);
//     }
//   };

//   return (
//     <Container>
//       <h1 className="my-list-title dark-text">
//         Registros de Cuentas Corrientes
//       </h1>

//       <div className="mb-3" style={{ width: "30%", float: "left" }}>
//         <label>Filtrar por Cliente:</label>
//         <select
//           onChange={(e) => handleClienteChange(e.target.value)}
//           className="form-control rounded-0 border-transparent text-center"
//           style={{ width: "100%" }} // Establece el ancho al 100%
//         >
//           <option value="">Seleccione un cliente</option>
//           {clientes.map((cliente) => (
//             <option key={cliente.id} value={cliente.id}>
//               {cliente.nombre}
//             </option>
//           ))}
//         </select>
//       </div>

//       {selectedCliente && (
//         <div style={{ clear: "both", marginTop: "20px" }}>
//           {/* Movimientos de Cuenta Corriente */}
//           <h2>Movimientos de Cuenta Corriente</h2>

//           <Table striped bordered hover>
//             <thead>
//               <tr>
//                 <th>Fecha</th>
//                 <th>Descripción</th>
//                 <th>Monto</th>
//               </tr>
//             </thead>
//             <tbody>
//               {/* Iterar sobre los movimientos y mostrarlos en la tabla */}
//               {movimientos.map((movimiento) => (
//                 <tr key={movimiento.id}>
//                   <td>
//                     {new Date(movimiento.createdAt).toLocaleDateString(
//                       "es-ES",
//                       {
//                         day: "2-digit",
//                         month: "2-digit",
//                         year: "numeric",
//                       }
//                     )}
//                   </td>
//                   <td>{movimiento.productos ? "Venta" : "Cobranza"}</td>
//                   <td>{movimiento.monto_total}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//           <div
//             style={{
//               border: "1px solid #ccc",
//               padding: "10px",
//               marginBottom: "20px",
//             }}
//           >
//             {/* Aquí puedes mostrar el saldo actual o cualquier otra información */}
//             <p>Saldo Actual: {saldoActual}</p>
//           </div>
//         </div>
//       )}
//     </Container>
//   );
// }

import { useState, useEffect } from "react";
import { Table, Container, Button, FormControl, Modal } from "react-bootstrap";
import { createAuthenticatedRequest } from "../utils/createAuthenticatedRequest";

export default function AccountForm() {
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [movimientos, setMovimientos] = useState([]);
  const [saldoActual, setSaldoActual] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false); // Nuevo estado para controlar la visibilidad del modal
  const [montoCobranza, setMontoCobranza] = useState(""); // Nuevo estado para el monto de la cobranza

  useEffect(() => {
    // Obtener lista de clientes al cargar el componente
    obtenerClientes();
  }, []);

  const obtenerClientes = async () => {
    try {
      const response = await fetch("http://localhost:4000/clientes/", {
        credentials: "include",
      }); // Ajusta la ruta de la API
      const data = await response.json();
      setClientes(data);
      console.log("clientes", data);
      setLoaded(true);
    } catch (error) {
      console.error("Error al obtener clientes", error);
    }
  };

  const obtenerCliente = async (clienteId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/clientes/${clienteId}`,
        {
          credentials: "include",
        }
      );
      const cliente = await response.json();
      console.log("nuevocliente", cliente);
      return cliente;
    } catch (error) {
      console.error("Error al obtener datos del cliente", error);
      return null;
    }
  };

  const handleClienteChange = async (clienteId) => {
    try {
      // Obtener datos del cliente y operaciones de cuenta corriente
      const [cliente, operaciones] = await Promise.all([
        obtenerCliente(clienteId),
        fetch(
          `http://localhost:4000/cuentas-corrientes/${clienteId}/operaciones`,
          {
            credentials: "include",
          }
        ).then((response) => response.json()),
      ]);

      console.log("cliente", cliente);
      console.log("operaciones", operaciones);

      // Verificar si el cliente tiene cuenta corriente
      if (cliente && cliente.cuentaCorriente) {
        setMovimientos([...operaciones.ventas, ...operaciones.cobranzas]);
        setSaldoActual(operaciones.saldoActual);
        setSelectedCliente(cliente);
      } else {
        // Cliente no tiene cuenta corriente, restablecer valores
        setMovimientos([]);
        setSaldoActual(0);
        setSelectedCliente(null);
      }
    } catch (error) {
      console.error("Error al obtener movimientos y saldo", error);
    }
  };

  const handleRegistrarCobranza = () => {
    // Abre el formulario modal para registrar cobranza
    setShowModal(true);
  };

  const handleCloseModal = () => {
    // Cierra el formulario modal
    setShowModal(false);
  };

  const handleGuardarCobranza = async () => {
    // Validación: Verificar que el monto de la cobranza no sea vacío
    if (!montoCobranza.trim()) {
      alert("Por favor, ingrese un monto de cobranza válido.");
      return;
    }

    // Validación: Verificar que el monto de la cobranza sea un número
    if (isNaN(parseFloat(montoCobranza))) {
      alert(
        "Por favor, ingrese un valor numérico para el monto de la cobranza."
      );
      return;
    }

    const confirmGuardarCobranza = window.confirm(
      "¿Seguro que desea grabar esta cobranza?"
    );

    if (!confirmGuardarCobranza) {
      return;
    }

    try {
      // Lógica para guardar la cobranza, puedes implementarla según tu necesidad
      // Aquí puedes realizar la lógica para enviar el monto de la cobranza al servidor, por ejemplo
      await fetch(`http://localhost:4000/cobranzas`, {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
          clienteId: selectedCliente.id,
          detallesCobranza: montoCobranza,
          montoTotal: montoCobranza,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      // Obtén nuevamente las operaciones de cuenta corriente para el cliente
      const response = await fetch(
        `http://localhost:4000/cuentas-corrientes/${selectedCliente.id}/operaciones`,
        {
          credentials: "include",
        }
      );
      const operaciones = await response.json();

      // Actualiza los movimientos en el estado
      setMovimientos([...operaciones.ventas, ...operaciones.cobranzas]);
      setSaldoActual(operaciones.saldoActual);

      console.log("Monto de la cobranza:", montoCobranza);
    } catch (error) {
      console.error(
        "Error al guardar la cobranza o al obtener movimientos y saldo después de la cobranza",
        error
      );
      // Puedes manejar el error de alguna manera, como mostrar un mensaje al usuario
      alert("Error al guardar la cobranza o al obtener movimientos y saldo.");
    }
    // Resto de la lógica (limpiar campos, cerrar modal, etc.)
    setMontoCobranza("");
    handleCloseModal();
  };

  return (
    <Container>
      <h1 className="my-list-title dark-text">
        Registros de Cuentas Corrientes
      </h1>

      <div className="mb-3" style={{ width: "30%", float: "left" }}>
        <label>Filtrar por Cliente:</label>
        <select
          onChange={(e) => handleClienteChange(e.target.value)}
          className="form-control rounded-0 border-transparent text-center"
          style={{ width: "100%" }}
        >
          <option value="">Seleccione un cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre}
            </option>
          ))}
        </select>
      </div>

      {selectedCliente ? (
        <div style={{ clear: "both", marginTop: "20px" }}>
          <div className="mb-3" style={{ width: "30%", float: "right" }}>
            <Button
              variant="primary"
              // style={{ marginLeft: "10px" }}
              // style={{ width: "30%", float: "rigth" }}
              onClick={handleRegistrarCobranza}
              disabled={!selectedCliente.cuentaCorriente} // Deshabilitar el botón si el cliente no tiene cuenta corriente
            >
              Registrar Cobranza
            </Button>
          </div>

          {/* Movimientos de Cuenta Corriente */}
          <h2>Movimientos de Cuenta Corriente</h2>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              {/* Iterar sobre los movimientos y mostrarlos en la tabla */}
              {movimientos.map((movimiento) => (
                <tr key={movimiento.id}>
                  <td>
                    {new Date(movimiento.createdAt).toLocaleDateString(
                      "es-ES",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </td>
                  <td>{movimiento.productos ? "Venta" : "Cobranza"}</td>
                  <td>{movimiento.monto_total}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "20px",
            }}
          >
            {/* Aquí puedes mostrar el saldo actual o cualquier otra información */}
            <p>Saldo Actual: {saldoActual}</p>
          </div>
        </div>
      ) : (
        <div style={{ clear: "both", marginTop: "20px" }}>
          {/* Movimientos de Cuenta Corriente */}
          <h2>Movimientos de Cuenta Corriente</h2>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody></tbody>
          </Table>
        </div>
      )}

      {/* Formulario Modal para Registrar Cobranza */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Registrar Cobranza</Modal.Title>
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
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardarCobranza}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
