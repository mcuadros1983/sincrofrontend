import React, { useEffect, useState, useRef } from "react";
import { Container, Form, Button, Spinner, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";
import { createAuthenticatedRequest } from "../utils/createAuthenticatedRequest";

export default function SellForm() {
  const codigoDeBarraRef = useRef(null);

  const initialProductState = {
    codigo_de_barra: "",
    num_media: "",
    precio: "",
    kg: "",
    tropa: "",
  };

  const [product, setProduct] = useState(initialProductState);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [waypays, setWaypays] = useState([]);
  const [loadingWaypays, setLoadingWaypays] = useState(true);
  const [selectedWaypaysId, setSelectedWaypaysId] = useState("");
  const [sell, setSell] = useState({
    cantidad_total: 0,
    peso_total: 0,
    cliente_id: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://localhost:4000/clientes", {
          credentials: "include",
        });
        const data = await response.json();
        const sortedCustomers = data.sort((a, b) => {
          if (a.nombre === "CENTRAL") return -1;
          if (b.nombre === "CENTRAL") return 1;
          return a.nombre.localeCompare(b.nombre);
        });
        setCustomers(sortedCustomers);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoadingCustomers(false);
      }
    };

    const fetchWaypays = async () => {
      try {
        const response = await fetch("http://localhost:4000/formas-pago", {
          credentials: "include",
        });
        const data = await response.json();
        setWaypays(data);
      } catch (error) {
        console.error("Error fetching Way Pays:", error);
      } finally {
        setLoadingWaypays(false);
      }
    };

    fetchCustomers();
    fetchWaypays();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      alert("Por favor, seleccione un cliente antes de grabar.");
      return;
    }

    if (!selectedWaypaysId) {
      alert("Por favor, seleccione una forma de pago antes de grabar.");
      return;
    }

    if (selectedCustomerId == 1) {
      alert("No se pueden hacer ventas a la central, cambie de cliente.");
      return;
    }

    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas grabar esta venta?"
    );
    if (!confirmDelete) {
      return;
    }

    const cantidad_total = products.length;
    const peso_total = products.reduce(
      (acum, product) => acum + Number(product.kg),
      0
    );

    await fetch(`http://localhost:4000/ventas`, { 
      credentials: "include",
      method: "POST",
      body: JSON.stringify({
        cantidad_total,
        peso_total,
        cliente_id: selectedCustomerId,
        formaPago_id: selectedWaypaysId,
        productos: products,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    navigate("/sells");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: name === "kg" ? Number(value) : value,
    });

    if (name === "cliente_destino" && codigoDeBarraRef.current) {
      setSelectedCustomerId(value);
      codigoDeBarraRef.current.focus();
    }

    if (name === "tipo") {
      setSelectedWaypaysId(value);
    }
  };

  const handleSave = async () => {
    const productResponse = await fetch(
      `http://localhost:4000/productos/${product.codigo_de_barra}/barra`,
      {
        credentials: "include",
      }
    );
    const productData = await productResponse.json();

    if (!productData) {
      alert("El producto no existe en la base de datos");
      return;
    }

    const formFields = ["codigo_de_barra"];
    if (formFields.some((field) => !product[field])) {
      alert("Todos los campos son obligatorios");
      return;
    }

    if (productData.sucursal_id !== 1) {
      alert("El producto ya no se encuentra en stock");
      return;
    }

    const existingProductIndex = products.findIndex(
      (prod) => prod.codigo_de_barra === productData.codigo_de_barra
    );

    if (existingProductIndex !== -1) {
      alert("El código de barras ya existe en la lista");
      return;
    }

    const barcodePattern = /^\d+$/;
    if (!barcodePattern.test(product.codigo_de_barra)) {
      alert("El código de barras debe contener solo números");
      return;
    }

    setProducts([...products, productData]);
    setProduct(initialProductState);
  };

  const handleDelete = (barcode) => {
    const confirmDelete = window.confirm(
      "¿Seguro que desea eliminar este producto?"
    );

    if (confirmDelete) {
      const updatedProducts = products.filter(
        (prod) => prod.codigo_de_barra !== barcode
      );

      setProducts(updatedProducts);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handlePriceChange = (e, index) => {
    const newPrice = e.target.value;
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index].precio = newPrice;
      return updatedProducts;
    });
  };

  return (
    <Container className="d-flex flex-column align-items-center">
      <h1 className="my-form-title text-center">Ventas</h1>
      <Form onSubmit={(e) => e.preventDefault()} className="w-50">
        <Form.Group className="mb-3 text-center">
          {/* <Form.Label className="px-2">Seleccione el cliente</Form.Label> */}
          <Form.Select
            name="cliente_destino"
            value={selectedCustomerId}
            onChange={handleChange}
            className="my-input custom-style-select"
            size="lg"
          >
            <option value="">Seleccione un cliente</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.nombre}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3 text-center">
          {/* <Form.Label className="px-2">Seleccione una forma de pago</Form.Label> */}
          <Form.Select
            name="tipo"
            value={selectedWaypaysId}
            onChange={handleChange}
            className="my-input custom-style-select"
            size="lg"
          >
            <option value="">Seleccione una forma de pago</option>
            {waypays.map((waypay) => (
              <option key={waypay.id} value={waypay.id}>
                {waypay.tipo}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Codigo de barra</Form.Label>
          <Form.Control
            type="text"
            name="codigo_de_barra"
            value={product.codigo_de_barra}
            onChange={handleChange}
            placeholder="Ingresa el codigo de barra"
            className="my-input"
            ref={codigoDeBarraRef}
          />
        </Form.Group>

        <Button
          variant="primary"
          type="button"
          onClick={handleSave}
          disabled={loading}
          style={{ position: "relative" }}
        >
          Guardar
        </Button>
      </Form>
      <h1 className="my-list-title dark-text">Productos a agregar</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Codigo de Barra</th>
            <th>Numero de Media</th>
            <th>Precio</th>
            <th>Peso</th>
            <th>Numero de Tropa</th>
            <th>Operaciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.codigo_de_barra}>
              <td>{product.codigo_de_barra}</td>
              <td>{product.num_media}</td>
              <td>
                {editingIndex === index ? (
                  <Form.Control
                    type="number"
                    value={product.precio}
                    onChange={(e) => handlePriceChange(e, index)}
                  />
                ) : (
                  product.precio
                )}
              </td>
              <td>{product.kg}</td>
              <td>{product.tropa}</td>
              <td className="text-center">
                <div className="d-flex justify-content-center align-items-center">
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(product.codigo_de_barra)}
                    className="mx-2"
                  >
                    Eliminar
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleEdit(index)}
                    className="mx-2"
                  >
                    Precio
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="py-2">
        <Button variant="primary" onClick={handleSubmit}>
          Grabar
        </Button>
      </div>
    </Container>
  );
}
