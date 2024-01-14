// import React, { useEffect, useState } from "react";
// import { Table, Container, Button, FormControl } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { parse, format } from "date-fns";

// export default function OrderList() { 
//   const [orders, setOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortColumn, setSortColumn] = useState(null);
//   const [sortDirection, setSortDirection] = useState("asc");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   const navigate = useNavigate();

//   const loadOrders = async () => {
//     try {
//       const res = await fetch("http://localhost:4000/ordenes/", {
//         include: {
//           model: "Sucursal",
//           attributes: ["nombre"],
//         },
//       });

//       const data = await res.json();
//       console.log("data", data[0].sucursal.nombre)
//       const sortedOrders = data.sort((a, b) => a.id - b.id);
//       setOrders(sortedOrders);
//       console.log("orders", sortedOrders)
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm(
//       "¿Estás seguro de que deseas eliminar esta orden?"
//     );
//     if (!confirmDelete) {
//       return;
//     }

//     try {
//       const res = await fetch(`http://localhost:4000/ordenes/${id}`, {
//         method: "DELETE",
//       });
//       console.log(res);
//       setOrders(orders.filter((order) => order.id !== id));
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // const handleSearch = () => {
//   //   const searchTermLower = searchTerm.toLowerCase();

//   //   if (searchTermLower === "") {
//   //     setFilteredOrders(orders);
//   //   } else {
//   //     const filtered = orders.filter((order) => {
//   //       return (
//   //         order.branch &&
//   //         order.branch.nombre.toLowerCase().includes(searchTermLower)
//   //       );
//   //     });
//   //     setFilteredOrders(filtered);
//   //   }
//   // };
//   const handleSearch = () => {
//     const searchTermLower = searchTerm.toLowerCase();
//     const startDateFilter = startDate
//       ? parse(startDate, "yyyy-MM-dd", new Date())
//       : null;
//     const endDateFilter = endDate
//       ? parse(endDate, "yyyy-MM-dd", new Date())
//       : null;

//     if (startDateFilter) startDateFilter.setHours(0, 0, 0, 0);
//     if (endDateFilter) endDateFilter.setHours(0, 0, 0, 0);

//     console.log("searchTermLower", searchTermLower);
//     console.log("startDateFilter", startDateFilter);
//     console.log("endDateFilter", endDateFilter);

//     if (searchTermLower === "" && !startDate && !endDate) {
//       console.log("No search criteria. Showing all orders.");
//       setFilteredOrders(orders);
//     } else {
//       const filtered = orders.filter((order) => {
//         const matchesBranch =
//           order.sucursal &&
//           order.sucursal.nombre.toLowerCase().includes(searchTermLower);
//         const orderDate = new Date(order.createdAt).setHours(0, 0, 0, 0);

//         console.log("Order ID:", order.id);
//         console.log(
//           "Order Date:",
//           new Date(order.createdAt).toLocaleDateString("es-ES")
//         );
//         console.log("Order Date Filtered:", orderDate);
//         console.log("Matches Branch:", matchesBranch);

//         const matchesDate =
//           (!startDateFilter || orderDate >= startDateFilter) &&
//           (!endDateFilter || orderDate <= endDateFilter);

//         console.log("Matches Date:", matchesDate);

//         return matchesBranch && matchesDate;
//       });

//       console.log("Filtered Orders:", filtered);
//       setFilteredOrders(filtered);
//     }
//   };

//   // const handleSort = (columnName) => {
//   //   setSortDirection(
//   //     columnName === sortColumn && sortDirection === "asc" ? "desc" : "asc"
//   //   );

//   //   setSortColumn(columnName);

//   //   const sortedOrders = [...filteredOrders].sort((a, b) => {
//   //     const valueA =
//   //       columnName === "branch.nombre"
//   //         ? a.branch && a.branch.nombre
//   //         : a[columnName];
//   //     const valueB =
//   //       columnName === "branch.nombre"
//   //         ? b.branch && b.branch.nombre
//   //         : b[columnName];

//   //     if (valueA < valueB) {
//   //       return sortDirection === "asc" ? -1 : 1;
//   //     } else if (valueA > valueB) {
//   //       return sortDirection === "asc" ? 1 : -1;
//   //     } else {
//   //       return 0;
//   //     }
//   //   });

//   //   setFilteredOrders(sortedOrders);
//   // };

//   const handleSort = (columnName) => {
//     setSortDirection(
//       columnName === sortColumn && sortDirection === "asc" ? "desc" : "asc"
//     );

//     setSortColumn(columnName);

//     const sortedOrders = [...filteredOrders].sort((a, b) => {
//       const valueA =
//         columnName === "sucursal.nombre"
//           ? a.sucursal && a.sucursal.nombre
//           : a[columnName];
//       const valueB =
//         columnName === "sucursal.nombre"
//           ? b.sucursal && b.sucursal.nombre
//           : b[columnName];

//       if (columnName === "createdAt") {
//         // Utilizar la columna createdAt para ordenar
//         return sortDirection === "asc"
//           ? new Date(a.createdAt) - new Date(b.createdAt)
//           : new Date(b.createdAt) - new Date(a.createdAt);
//       } else {
//         if (valueA < valueB) {
//           return sortDirection === "asc" ? -1 : 1;
//         } else if (valueA > valueB) {
//           return sortDirection === "asc" ? 1 : -1;
//         } else {
//           return 0;
//         }
//       }
//     });

//     setFilteredOrders(sortedOrders);
//   };

//   useEffect(() => {
//     loadOrders();
//   }, []);

//   useEffect(() => {
//     handleSearch();
//   }, [searchTerm, orders, startDate, endDate]);

//   return (
//     <Container>
//       <h1 className="my-list-title dark-text">Lista de Ordenes</h1>
//       <div className="mb-3">
//         <div className="d-inline-block w-auto">
//           <label className="mr-2">DESDE: </label>
//           <input
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             className="form-control rounded-0 border-transparent text-center"
//           />
//         </div>

//         <div className="d-inline-block w-auto ml-2">
//           <label className="ml-2 mr-2">HASTA:</label>
//           <input
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             className="form-control rounded-0 border-transparent text-center"
//           />
//         </div>
//       </div>
//       <div className="mb-3">
//         <FormControl
//           type="text"
//           placeholder="Buscar por sucursal"
//           className="mr-sm-2"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       <Table striped bordered hover>
//         <thead>
//           <tr>
//             <th>#</th>
//             <th
//               onClick={() => handleSort("createdAt")}
//               style={{ cursor: "pointer" }}
//             >
//               Fecha de ingreso
//             </th>
//             <th
//               onClick={() => handleSort("cantidad_total")}
//               style={{ cursor: "pointer" }}
//             >
//               Cantidad de medias
//             </th>
//             <th
//               onClick={() => handleSort("peso_total")}
//               style={{ cursor: "pointer" }}
//             >
//               Peso total
//             </th>
//             <th
//               onClick={() => handleSort("sucursal.nombre")}
//               style={{ cursor: "pointer" }}
//             >
//               Sucursal
//             </th>
//             <th>Operaciones</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredOrders.map((order) => (
//             <tr
//               key={order.id}
//               style={{ cursor: "pointer" }}
//               onDoubleClick={() => navigate(`/orders/${order.id}/products`)}
//             >
//               <td>{order.id}</td>
//               <td>{new Date(order.createdAt).toLocaleDateString("es-ES")}</td>
//               <td>{order.cantidad_total}</td>
//               <td>{order.peso_total}</td>
//               <td>
//                 {order.sucursal ? order.sucursal.nombre : "Sucursal Desconocida"}
//               </td>
//               <td className="text-center">
//                 <Button
//                   variant="danger"
//                   onClick={() => handleDelete(order.id)}
//                   className="mx-2"
//                 >
//                   Eliminar
//                 </Button>
//                 <Button
//                   color="inherit"
//                   onClick={() => navigate(`/orders/${order.id}/edit`)}
//                 >
//                   Editar
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </Container>
//   );
// }


import React, { useEffect, useState } from "react";
import { Table, Container, Button, FormControl } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { parse } from "date-fns";
import { createAuthenticatedRequest } from "../utils/createAuthenticatedRequest";

export default function OrderList() { 
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();

  const loadOrders = async () => {
    try {
      const res = await fetch("http://localhost:4000/ordenes/", {
        credentials:"include",  
        include: {
          model: "Sucursal",
          attributes: ["nombre"],
        },
      });

      const data = await res.json();
      
      const sortedOrders = data.sort((a, b) => a.id - b.id);
      setOrders(sortedOrders);
      console.log("orders", sortedOrders);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar esta orden?"
    );
    if (!confirmDelete) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/ordenes/${id}`, {
        credentials:"include",
        method: "DELETE",
      });
      console.log("delete", res);
      setOrders(orders.filter((order) => order.id !== id));
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

    console.log("searchTermLower", searchTermLower);
    console.log("startDateFilter", startDateFilter);
    console.log("endDateFilter", endDateFilter);

    if (searchTermLower === "" && !startDate && !endDate) {
      console.log("No search criteria. Showing all orders.");
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) => {
        const matchesBranch =
          order.Sucursal &&
          order.Sucursal.nombre.toLowerCase().includes(searchTermLower);
        const orderDate = new Date(order.createdAt).setHours(0, 0, 0, 0);

        console.log("Order ID:", order.id);
        console.log(
          "Order Date:",
          new Date(order.createdAt).toLocaleDateString("es-ES")
        );
        console.log("Order Date Filtered:", orderDate);
        console.log("Matches Branch:", matchesBranch);

        const matchesDate =
          (!startDateFilter || orderDate >= startDateFilter) &&
          (!endDateFilter || orderDate <= endDateFilter);

        console.log("Matches Date:", matchesDate);

        return matchesBranch && matchesDate;
      });

      console.log("Filtered Orders:", filtered);
      setFilteredOrders(filtered);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, orders, startDate, endDate]);

  return (
    <Container>
      <h1 className="my-list-title dark-text">Lista de Ordenes</h1>
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
          placeholder="Buscar por sucursal"
          className="mr-sm-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Fecha de ingreso</th>
            <th>Cantidad de medias</th>
            <th>Peso total</th>
            <th>Sucursal</th>
            <th>Operaciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr
              key={order.id}
              style={{ cursor: "pointer" }}
              onDoubleClick={() => navigate(`/orders/${order.id}/products`)}
            >
              <td>{order.id}</td>
              <td>{new Date(order.createdAt).toLocaleDateString("es-ES")}</td>
              <td>{order.cantidad_total}</td>
              <td>{order.peso_total}</td>
              <td>
                {order.Sucursal ? order.Sucursal.nombre : "Sucursal Desconocida"}
              </td>
              <td className="text-center">
                <Button
                  variant="danger"
                  onClick={() => handleDelete(order.id)}
                  className="mx-2"
                >
                  Eliminar
                </Button>
                {/* <Button
                  color="inherit"
                  onClick={() => navigate(`/orders/${order.id}/edit`)}
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
