import React, { useEffect, useState } from "react";
import { Table, Container, FormControl } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { parse } from "date-fns";
import { createAuthenticatedRequest } from "../utils/createAuthenticatedRequest";

export default function StockList() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [products, setProducts] = useState([]); //agregado para el doble clickf

  const navigate = useNavigate();

  const loadOrders = async () => {
    try {
      const res = await fetch("http://localhost:4000/ordenes/", {
        credentials: "include",
        include: [
          {
            model: "Sucursal",
            attributes: ["id", "nombre"],
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
            ],
          },
        ],
      });

      const data = await res.json();
      const sortedOrders = data.sort((a, b) => a.id - b.id);
      setOrders(sortedOrders);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = () => {
    const startDateFilter = startDate
      ? parse(startDate, "yyyy-MM-dd", new Date())
      : null;
    const endDateFilter = endDate
      ? parse(endDate, "yyyy-MM-dd", new Date())
      : null;

    if (startDateFilter) startDateFilter.setHours(0, 0, 0, 0);
    if (endDateFilter) endDateFilter.setHours(0, 0, 0, 0);

    if (!startDate && !endDate) {
      // console.log("Sin criterios de búsqueda. Mostrando totales por sucursal.");
      // console.log("test0", orders);
      const totalsByBranch = calculateTotalsByBranch(orders);
      setFilteredOrders(totalsByBranch);
    } else {
      const filtered = orders.filter((order) => {
        const orderDate = new Date(order.createdAt).setHours(0, 0, 0, 0);

        const matchesDate =
          (!startDateFilter || orderDate >= startDateFilter) &&
          (!endDateFilter || orderDate <= endDateFilter);

        return matchesDate;
      });

      // console.log("test3", filtered);
      // console.log("test4",totalsByBranch)
      const totalsByBranch = calculateTotalsByBranch(filtered);
      setFilteredOrders(totalsByBranch);
      // console.log("test1", orders);
      // console.log("test2", filteredOrders);
    }
  };

  const calculateTotalsByBranch = (orders) => {
    const totalsByBranch = {};

    orders.forEach((order) => {
      const branchId = order.Sucursal ? order.Sucursal.id : null; // Obtener el id del branch
      const branchName = order.Sucursal
        ? order.Sucursal.nombre
        : "Sin Sucursal";
      console.log();

      if (!totalsByBranch[branchId]) {
        totalsByBranch[branchId] = {
          cantidad_total: 0,
          peso_total: 0,
          nombre: branchName,
        };
      }

      totalsByBranch[branchId].cantidad_total += order.cantidad_total;
      totalsByBranch[branchId].peso_total += order.peso_total;

      console.log("data", totalsByBranch);
      console.log("test2", orders);
    });

    return Object.entries(totalsByBranch).map(([branchId, totals]) => ({
      branch: {
        id: branchId, // Incluir el id del branch en el resultado
        nombre: totals.nombre,
      },
      ...totals,
    }));
  };

  const handleSort = (columnName) => {
    setSortDirection(
      columnName === sortColumn && sortDirection === "asc" ? "desc" : "asc"
    );

    setSortColumn(columnName);

    const sortedOrders = [...filteredOrders].sort((a, b) => {
      const valueA =
        columnName === "Sucursal.nombre"
          ? a.Sucursal && a.Sucursal.nombre
          : a[columnName];
      const valueB =
        columnName === "Sucursal.nombre"
          ? b.Sucursal && b.Sucursal.nombre
          : b[columnName];

      if (columnName === "createdAt") {
        return sortDirection === "asc"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        if (valueA < valueB) {
          return sortDirection === "asc" ? -1 : 1;
        } else if (valueA > valueB) {
          return sortDirection === "asc" ? 1 : -1;
        } else {
          return 0;
        }
      }
    });

    setFilteredOrders(sortedOrders);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, orders, startDate, endDate]);

  const handleDoubleClick = async (order) => {
    try {
      console.log("test", orders);
      const branchId = order.branch ? order.branch.id : null;

      // Construye la URL con o sin fechas dependiendo de su disponibilidad
      let url = `http://localhost:4000/productos/filteredProducts/${branchId}`;

      if (startDate && endDate) {
        url += `/${startDate}/${endDate}`;
      }
      // if (startDate) {
      //   url += `/${startDate}`;
      // }

      // if (endDate) {
      //   url += `/${endDate}`;
      // }

      const response = await fetch(url, {
        credentials: "include",
      });
      // router.get("/productos/filteredProducts", productosController.obtenerProductosFiltradosSucursalFecha);

      if (!response.ok) {
        console.error("La solicitud no fue exitosa:", response.status);
        return;
      }

      const data = await response.json();

      console.log("Datos de productos:", data);
      navigate(`/stock/products`, { state: { products: data } });
    } catch (error) {
      console.error("Error al procesar la doble pulsación", error);
    }
  };

  return (
    <Container>
      <h1 className="my-list-title dark-text">Lista de Stock</h1>
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
      {/* <div className="mb-3">
        <FormControl
          type="text"
          placeholder="Buscar por sucursal"
          className="mr-sm-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div> */}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th
            // onClick={() => handleSort("cantidad_total")}
            // style={{ cursor: "pointer" }}
            >
              Cantidad de medias
            </th>
            <th
            // onClick={() => handleSort("peso_total")}
            // style={{ cursor: "pointer" }}
            >
              Peso total
            </th>
            <th
            // onClick={() => handleSort("sucursal.nombre")}
            // style={{ cursor: "pointer" }}
            >
              Sucursal
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order, index) => (
            <tr
              key={index}
              style={{ cursor: "pointer" }}
              onDoubleClick={() => handleDoubleClick(order)}
            >
              <td>{order.cantidad_total}</td>
              <td>{order.peso_total}</td>
              {/* <td>{order.branch ? order.branch.nombre : "Sin Sucursal"}</td> */}
              <td>{order.nombre}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

//setFilteredOrders
