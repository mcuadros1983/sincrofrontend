import React, { useEffect, useState } from "react";
import { Table, Container, Button, FormControl } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { parse } from "date-fns";
import { createAuthenticatedRequest } from "../utils/createAuthenticatedRequest";

export default function SellList() {
  const [sells, setSells] = useState([]);
  const [filteredSells, setFilteredSells] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();

  const loadSells = async () => {
    try {
      const res = await fetch("http://localhost:4000/ventas/", { 
        credentials:"include",  
        include: [
          {
            model: "Cliente",
            attributes: ["nombre"],
          },
          {
            model: "FormaPago",
            attributes: ["tipo"],
          },
          {
            model: "Producto",
            attributes: [
              "id",
              "codigo_de_barra",
              "num_media",
              "precio",
              "kg",
              "tropa",
              "sucursal_id",
            ],
            as: "productos",
          },
        ],
      });

      const data = await res.json();
      console.log("info", data);
      const sortedSells = data.sort((a, b) => a.id - b.id);
      setSells(sortedSells);
      console.log("sells", sortedSells);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar esta venta?"
    );
    if (!confirmDelete) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/ventas/${id}`, {
        credentials:"include",
        method: "DELETE",
      });
      console.log("delete", res);
      setSells(sells.filter((sell) => sell.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = () => {
    const searchTermLower = searchTerm.toLowerCase();
    const startDateFilter = startDate
      ? parse(startDate, "yyyy-MM-dd", new Date())
      : null;
    const endDateFilter = endDate
      ? parse(endDate, "yyyy-MM-dd", new Date())
      : null;

    if (startDateFilter) startDateFilter.setHours(0, 0, 0, 0);
    if (endDateFilter) endDateFilter.setHours(0, 0, 0, 0);

    // console.log("searchTermLower", searchTermLower);
    // console.log("startDateFilter", startDateFilter);
    // console.log("endDateFilter", endDateFilter);

    if (searchTermLower === "" && !startDate && !endDate) {
      // console.log("No search criteria. Showing all sells.");
      setFilteredSells(sells);
      console.log("handlesearch", sells);
    } else {
      const filtered = sells.filter((sell) => {
        const matchesCustomer =
          sell.Cliente &&
          sell.Cliente.nombre.toLowerCase().includes(searchTermLower);
        const sellDate = new Date(sell.createdAt).setHours(0, 0, 0, 0);

        console.log("Sell ID:", sell.id);
        console.log(
          "Sell Date:",
          new Date(sell.createdAt).toLocaleDateString("es-ES")
        );
        console.log("Sell Date Filtered:", sellDate);
        console.log("Matches Customer:", matchesCustomer);

        const matchesDate =
          (!startDateFilter || sellDate >= startDateFilter) &&
          (!endDateFilter || sellDate <= endDateFilter);

        console.log("Matches Date:", matchesDate);

        return matchesCustomer && matchesDate;
      });

      console.log("Filtered Sells:", filtered);
      setFilteredSells(filtered);
    }
  };

  useEffect(() => {
    loadSells();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, sells, startDate, endDate]);

  return (
    <Container>
      <h1 className="my-list-title dark-text">Lista de Ventas</h1>
      <div className="mb-3">
        <div className="d-inline-block w-auto">
          <label className="mr-2">DESDE: </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="form-control rounded-0 border-transparent text-center"
          />
        </div>

        <div className="d-inline-block w-auto ml-2">
          <label className="ml-2 mr-2">HASTA:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="form-control rounded-0 border-transparent text-center"
          />
        </div>
      </div>
      <div className="mb-3">
        <FormControl
          type="text"
          placeholder="Buscar por cliente"
          className="mr-sm-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Fecha de venta</th>
            <th>Cantidad de medias</th>
            <th>Peso total</th>
            <th>Cliente</th>
            <th>Forma Pago</th>
            <th>Operaciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredSells.map((sell) => (
            <tr
              key={sell.id}
              style={{ cursor: "pointer" }}
              onDoubleClick={() => navigate(`/sells/${sell.id}/products`)}
            >
              <td>{sell.id}</td>
              <td>{new Date(sell.createdAt).toLocaleDateString("es-ES")}</td>
              <td>{sell.cantidad_total}</td>
              <td>{sell.peso_total}</td>
              <td>
                {sell.Cliente ? sell.Cliente.nombre : "Cliente Desconocido"}
              </td>
              <td>
                {sell.FormaPago
                  ? sell.FormaPago.tipo
                  : "Forma de pago desconocida"}
              </td>

              <td className="text-center">
                <Button
                  variant="danger"
                  onClick={() => handleDelete(sell.id)}
                  className="mx-2"
                >
                  Eliminar
                </Button>
                {/* <Button
              color="inherit"
              onClick={() => navigate(`/se,,s/${sell.id}/edit`)}
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
