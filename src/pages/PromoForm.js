import React, { useContext, useEffect, useState } from "react";
import { Container, Table, Button, Spinner } from "react-bootstrap";
import Contexts from "../context/Contexts";

export default function PromoForm() {
  const context = useContext(Contexts.promoContext);
  const [loading, setLoading] = useState({});
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:4000";

  const copyPromotions = async (sucursalId, promocionesData) => {
    const confirmCopy = window.confirm(
      "¿Estás seguro de querer copiar las promociones?"
    );

    if (!confirmCopy) {
      return;
    }

    setLoading((prevLoading) => ({ ...prevLoading, [sucursalId]: true }));

    try {
      const response = await fetch(`${apiUrl}/copiarpromociones`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sucursal_id: sucursalId,
          promociones: promocionesData,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al copiar promociones");
      }

      window.alert("¡Promociones copiadas correctamente!");
    } catch (error) {
      console.error("Error al copiar promociones:", error.message);
      // Mostrar una alerta en caso de error al copiar promociones
      alert("Error al copiar las promociones");
    } finally {
      setLoading((prevLoading) => ({ ...prevLoading, [sucursalId]: false }));
    }
  };

  useEffect(() => {
    // Verificar si la conexión con la base de datos local es exitosa
    if (!context.databaseConnected) {
      // Si no es exitosa, mostrar una alerta y deshabilitar los botones
      alert("Error al conectarse con la base de datos local");
    }
  }, [context.databaseConnected]);

  return (
    <Container className="mt-4">
      <h1 className="text-center">Copiar Promociones</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Sucursal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {context.sucursales.map((sucursal) => (
            <tr key={sucursal.id}>
              <td>{sucursal.nombre}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => copyPromotions(sucursal.id, context.promos)}
                  disabled={
                    !context.databaseConnected ||
                    Object.values(loading).some((status) => status)
                  }
                >
                  {loading[sucursal.id] ? (
                    <Spinner
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : (
                    "Copiar Promociones"
                  )}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
